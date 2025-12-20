import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { PDFHistoryTable } from "@/components/PDFHistoryTable";
import { useMCUData } from "@/hooks/useMCUData";
import { Loader2 } from "lucide-react";

const PDFHistoryPage = () => {
  const { pdfHistory, loading, deletePDFHistory } = useMCUData();

  return (
    <DashboardLayout
      title="Riwayat PDF"
      subtitle="Daftar PDF yang telah di-generate"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <PDFHistoryTable data={pdfHistory} onDelete={deletePDFHistory} />
      )}
    </DashboardLayout>
  );
};

export default PDFHistoryPage;
