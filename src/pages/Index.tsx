import { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { MCUDataTable } from '@/components/MCUDataTable';
import { parseExcelFile } from '@/utils/excelParser';
import { generateMCUPDF, downloadPDF } from '@/utils/pdfGenerator';
import { MCUData } from '@/types/mcu';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [mcuData, setMcuData] = useState<MCUData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      setMcuData(data);
      
      toast({
        title: 'File berhasil diproses!',
        description: `${data.length} data karyawan ditemukan`,
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

  const handleGeneratePDF = (employee: MCUData, index: number) => {
    try {
      const doc = generateMCUPDF(employee);
      const filename = `MCU_${employee.NPK}_${employee["Nama Karyawan"].replace(/\s+/g, '_')}.pdf`;
      downloadPDF(doc, filename);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-lg">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">MCU PDF Generator</h1>
              <p className="text-primary-foreground/80 mt-1">
                PT. Suzuki Indomobil Motor - Mitra Keluarga Grand Wisata
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Instructions Card */}
          <Card className="bg-secondary/20 border-secondary">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-2">Cara Penggunaan:</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Upload file Excel yang berisi data Medical Check-Up karyawan</li>
                <li>Sistem akan membaca dan menampilkan data karyawan</li>
                <li>Klik "Generate PDF" untuk membuat PDF individual, atau "Generate Semua PDF" untuk semua karyawan sekaligus</li>
                <li>File PDF akan otomatis terunduh dengan format template Mitra Keluarga</li>
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
