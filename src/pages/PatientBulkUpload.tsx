import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { ArrowLeft, Upload, FileSpreadsheet, Loader2, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { usePatients, PatientFormData } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const PatientBulkUpload = () => {
  const navigate = useNavigate();
  const { addBulkPatients } = usePatients();
  const { toast } = useToast();
  const [parsedData, setParsedData] = useState<PatientFormData[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const patients: PatientFormData[] = jsonData.map((row: any) => ({
          no_rm: String(row["No. RM"] || row["no_rm"] || row["NO_RM"] || ""),
          nama: String(row["Nama"] || row["nama"] || row["NAMA"] || ""),
          tanggal_lahir: row["Tanggal Lahir"] || row["tanggal_lahir"] || "",
          jenis_kelamin: row["Jenis Kelamin"] || row["jenis_kelamin"] || "",
          perusahaan: row["Perusahaan"] || row["perusahaan"] || "",
          alamat: row["Alamat"] || row["alamat"] || "",
          no_telepon: row["No. Telepon"] || row["no_telepon"] || "",
        }));

        // Filter out rows without required fields
        const validPatients = patients.filter((p) => p.no_rm && p.nama);

        setParsedData(validPatients);
        setFileName(file.name);

        toast({
          title: "File berhasil dibaca",
          description: `${validPatients.length} data pasien ditemukan`,
        });
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast({
          title: "Error",
          description: "Gagal membaca file Excel",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      parseExcel(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (parsedData.length === 0) return;

    setLoading(true);
    try {
      const success = await addBulkPatients(parsedData);
      if (success) {
        setUploaded(true);
        setTimeout(() => {
          navigate("/patients");
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Bulk Upload Pasien"
      subtitle="Upload data pasien dari file Excel"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/patients")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Format File Excel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              File Excel harus memiliki kolom-kolom berikut (header di baris pertama):
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Kolom</TableHead>
                    <TableHead>Wajib</TableHead>
                    <TableHead>Contoh</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">No. RM</TableCell>
                    <TableCell>Ya</TableCell>
                    <TableCell>100548220</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nama</TableCell>
                    <TableCell>Ya</TableCell>
                    <TableCell>TRISNO</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tanggal Lahir</TableCell>
                    <TableCell>Tidak</TableCell>
                    <TableCell>1974-03-03</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jenis Kelamin</TableCell>
                    <TableCell>Tidak</TableCell>
                    <TableCell>Laki-Laki</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Perusahaan</TableCell>
                    <TableCell>Tidak</TableCell>
                    <TableCell>PT. NGK CERAMIC INDONESIA</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        {!uploaded && (
          <Card>
            <CardContent className="pt-6">
              {parsedData.length === 0 ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? "Lepaskan file di sini..."
                      : "Drag & drop file Excel, atau klik untuk memilih"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mendukung format .xlsx dan .xls
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {parsedData.length} pasien siap diupload
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setParsedData([]);
                          setFileName("");
                        }}
                      >
                        Ganti File
                      </Button>
                      <Button onClick={handleUpload} disabled={loading}>
                        {loading && (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Upload ke Database
                      </Button>
                    </div>
                  </div>

                  {/* Preview Table */}
                  <div className="border rounded-lg max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>No. RM</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>Jenis Kelamin</TableHead>
                          <TableHead>Perusahaan</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedData.slice(0, 20).map((patient, index) => (
                          <TableRow key={index}>
                            <TableCell>{patient.no_rm}</TableCell>
                            <TableCell>{patient.nama}</TableCell>
                            <TableCell>{patient.jenis_kelamin || "-"}</TableCell>
                            <TableCell>{patient.perusahaan || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {parsedData.length > 20 && (
                      <div className="p-4 text-center text-sm text-muted-foreground border-t">
                        ... dan {parsedData.length - 20} data lainnya
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {uploaded && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <Check className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <p className="text-lg font-medium text-green-800">
                Upload berhasil!
              </p>
              <p className="text-sm text-green-600 mt-2">
                Mengalihkan ke daftar pasien...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientBulkUpload;
