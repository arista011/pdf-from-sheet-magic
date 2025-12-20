import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { MCUDataTable } from "@/components/MCUDataTable";
import { parseExcelFile } from "@/utils/excelParser";
import { generateMCUPDF, downloadPDF } from "@/utils/pdfGenerator";
import { MCUData } from "@/types/mcu";
import { useToast } from "@/hooks/use-toast";
import { useMCUData } from "@/hooks/useMCUData";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MCUUpload = () => {
  const { saveMCURecords, savePDFHistory } = useMCUData();
  const [mcuData, setMcuData] = useState<MCUData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setFileName(file.name);

    try {
      const data = await parseExcelFile(file);
      setMcuData(data);

      await saveMCURecords(data, file.name);

      toast({
        title: "File berhasil diproses!",
        description: `${data.length} data karyawan ditemukan dan disimpan ke database`,
      });
    } catch (error) {
      console.error("Error parsing Excel:", error);
      toast({
        title: "Error",
        description: "Gagal memproses file Excel. Pastikan format file sesuai.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGeneratePDF = async (employee: MCUData, index: number) => {
    try {
      const doc = generateMCUPDF(employee);
      const filename = `MCU_${employee.NPK}_${employee["Nama Karyawan"].replace(
        /\s+/g,
        "_"
      )}.pdf`;
      downloadPDF(doc, filename);

      await savePDFHistory(
        null,
        employee["Nama Karyawan"],
        employee.NPK,
        filename
      );

      toast({
        title: "PDF berhasil dibuat!",
        description: `File ${filename} telah didownload`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Gagal membuat PDF",
        variant: "destructive",
      });
    }
  };

  const handleGenerateAll = async () => {
    setIsProcessing(true);

    try {
      for (let i = 0; i < mcuData.length; i++) {
        const employee = mcuData[i];
        const doc = generateMCUPDF(employee);
        const filename = `MCU_${employee.NPK}_${employee[
          "Nama Karyawan"
        ].replace(/\s+/g, "_")}.pdf`;
        downloadPDF(doc, filename);

        await savePDFHistory(
          null,
          employee["Nama Karyawan"],
          employee.NPK,
          filename
        );

        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      toast({
        title: "Semua PDF berhasil dibuat!",
        description: `${mcuData.length} file PDF telah didownload`,
      });
    } catch (error) {
      console.error("Error generating PDFs:", error);
      toast({
        title: "Error",
        description: "Gagal membuat beberapa PDF",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout
      title="Upload Excel MCU"
      subtitle="Upload file Excel data Medical Check-Up"
    >
      <div className="space-y-6">
        {/* Instructions Card */}
        <Card className="bg-secondary/20 border-secondary">
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-2">Cara Penggunaan:</h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Upload file Excel yang berisi data Medical Check-Up karyawan</li>
              <li>Data akan otomatis tersimpan di database</li>
              <li>Klik "Generate PDF" untuk membuat PDF individual</li>
              <li>Riwayat PDF tersimpan di menu "Riwayat PDF"</li>
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
    </DashboardLayout>
  );
};

export default MCUUpload;
