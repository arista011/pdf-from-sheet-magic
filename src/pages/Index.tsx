import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUploader } from '@/components/FileUploader';
import { MCUDataTable } from '@/components/MCUDataTable';
import { PDFHistoryTable } from '@/components/PDFHistoryTable';
import { parseExcelFile } from '@/utils/excelParser';
import { generateMCUPDF, downloadPDF } from '@/utils/pdfGenerator';
import { MCUData } from '@/types/mcu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useMCUData } from '@/hooks/useMCUData';
import { FileSpreadsheet, Loader2, LogOut, User, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { pdfHistory, loading: dataLoading, saveMCURecords, savePDFHistory, deletePDFHistory, mcuRecords, convertRecordToMCUData } = useMCUData();
  
  const [mcuData, setMcuData] = useState<MCUData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      setMcuData(data);
      
      // Save to database
      await saveMCURecords(data, file.name);
      
      toast({
        title: 'File berhasil diproses!',
        description: `${data.length} data karyawan ditemukan dan disimpan ke database`,
      });
    } catch (error) {
      console.error('Error parsing Excel:', error);
      toast({
        title: 'Error',
        description: 'Gagal memproses file Excel. Pastikan format file sesuai.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePDF = async (employee: MCUData, index: number) => {
    try {
      const doc = generateMCUPDF(employee);
      const filename = `MCU_${employee.NPK}_${employee["Nama Karyawan"].replace(/\s+/g, '_')}.pdf`;
      downloadPDF(doc, filename);
      
      // Save to history
      await savePDFHistory(null, employee["Nama Karyawan"], employee.NPK, filename);
      
      toast({
        title: 'PDF berhasil dibuat!',
        description: `File ${filename} telah didownload`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat PDF',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateAll = async () => {
    setIsProcessing(true);
    
    try {
      for (let i = 0; i < mcuData.length; i++) {
        const employee = mcuData[i];
        const doc = generateMCUPDF(employee);
        const filename = `MCU_${employee.NPK}_${employee["Nama Karyawan"].replace(/\s+/g, '_')}.pdf`;
        downloadPDF(doc, filename);
        
        // Save to history
        await savePDFHistory(null, employee["Nama Karyawan"], employee.NPK, filename);
        
        // Small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      toast({
        title: 'Semua PDF berhasil dibuat!',
        description: `${mcuData.length} file PDF telah didownload`,
      });
    } catch (error) {
      console.error('Error generating PDFs:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat beberapa PDF',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadFromDatabase = () => {
    const data = mcuRecords.map(convertRecordToMCUData);
    setMcuData(data);
    setFileName('Data dari Database');
    toast({
      title: 'Data dimuat!',
      description: `${data.length} data karyawan dari database`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-lg">
                <FileSpreadsheet className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MCU PDF Generator</h1>
                <p className="text-primary-foreground/80 text-sm">
                  PT. Suzuki Indomobil Motor - Mitra Keluarga Grand Wisata
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upload">Upload Excel</TabsTrigger>
              <TabsTrigger value="database">Data Tersimpan</TabsTrigger>
              <TabsTrigger value="history">Riwayat PDF</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              {/* Instructions Card */}
              <Card className="bg-secondary/20 border-secondary">
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-2">Cara Penggunaan:</h2>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Upload file Excel yang berisi data Medical Check-Up karyawan</li>
                    <li>Data akan otomatis tersimpan di database</li>
                    <li>Klik "Generate PDF" untuk membuat PDF individual</li>
                    <li>Riwayat PDF tersimpan di tab "Riwayat PDF"</li>
                  </ol>
                </CardContent>
              </Card>

              {/* File Uploader */}
              {mcuData.length === 0 ? (
                <FileUploader onFileSelect={handleFileSelect} />
              ) : (
                <Card className="bg-green-50 border-secondary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-secondary" />
                        <div>
                          <p className="font-semibold">File Loaded: {fileName}</p>
                          <p className="text-sm text-muted-foreground">
                            {mcuData.length} karyawan siap diproses
                          </p>
                        </div>
                      </div>
                      <FileUploader onFileSelect={handleFileSelect} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Processing Indicator */}
              {isProcessing && (
                <Card className="bg-blue-50 border-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="font-medium">Memproses data...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Data Table */}
              {mcuData.length > 0 && (
                <MCUDataTable
                  data={mcuData}
                  onGeneratePDF={handleGeneratePDF}
                  onGenerateAll={handleGenerateAll}
                />
              )}
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              {dataLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : mcuRecords.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada data MCU tersimpan</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload file Excel untuk menyimpan data ke database
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="bg-secondary/20 border-secondary">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{mcuRecords.length} Data MCU Tersimpan</h3>
                          <p className="text-sm text-muted-foreground">
                            Klik tombol di bawah untuk memuat data dan generate PDF
                          </p>
                        </div>
                        <Button onClick={handleLoadFromDatabase}>
                          <Database className="h-4 w-4 mr-2" />
                          Muat Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {mcuData.length > 0 && (
                    <MCUDataTable
                      data={mcuData}
                      onGeneratePDF={handleGeneratePDF}
                      onGenerateAll={handleGenerateAll}
                    />
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="history">
              <PDFHistoryTable data={pdfHistory} onDelete={deletePDFHistory} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 MCU PDF Generator - PT. Suzuki Indomobil Motor
          </p>
          <p className="text-xs mt-1">
            Powered by Mitra Keluarga Grand Wisata
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
