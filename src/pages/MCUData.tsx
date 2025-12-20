import { useState } from "react";
import { Database, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { MCUDataTable } from "@/components/MCUDataTable";
import { useMCUData } from "@/hooks/useMCUData";
import { generateMCUPDF, downloadPDF } from "@/utils/pdfGenerator";
import { MCUData } from "@/types/mcu";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MCUDataPage = () => {
  const {
    mcuRecords,
    loading,
    convertRecordToMCUData,
    savePDFHistory,
  } = useMCUData();
  const { toast } = useToast();
  const [mcuData, setMcuData] = useState<MCUData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLoadFromDatabase = () => {
    const data = mcuRecords.map(convertRecordToMCUData);
    setMcuData(data);
    toast({
      title: "Data dimuat!",
      description: `${data.length} data karyawan dari database`,
    });
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
      title="Data MCU Tersimpan"
      subtitle="Data Medical Check-Up yang tersimpan di database"
    >
      <div className="space-y-6">
        {loading ? (
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
                    <h3 className="font-semibold">
                      {mcuRecords.length} Data MCU Tersimpan
                    </h3>
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

        {isProcessing && (
          <Card className="bg-blue-50 border-primary">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="font-medium">Memproses PDF...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MCUDataPage;
