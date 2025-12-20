import { useState, useCallback } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { useDropzone } from "react-dropzone";
import {
  Stethoscope,
  Upload,
  Trash2,
  Eye,
  FileImage,
  Search,
  CalendarIcon,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import {
  useMedicalDocuments,
  DocumentType,
} from "@/hooks/useMedicalDocuments";
import { usePatients } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const documentTypeLabels: Record<DocumentType, string> = {
  rontgen: "Rontgen",
  ekg: "EKG",
  spirometry: "Spirometry",
};

const documentTypeColors: Record<DocumentType, string> = {
  rontgen: "bg-blue-100 text-blue-800",
  ekg: "bg-red-100 text-red-800",
  spirometry: "bg-green-100 text-green-800",
};

const MedicalDocuments = () => {
  const { documents, loading, uploadDocument, deleteDocument, getDocumentUrl } =
    useMedicalDocuments();
  const { patients } = usePatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | DocumentType>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<{ id: string; path: string } | null>(
    null
  );
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);

  // Upload form state
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [selectedType, setSelectedType] = useState<DocumentType>("rontgen");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [examDate, setExamDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  });

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.patient?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.patient?.no_rm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === "all" || doc.document_type === activeTab;
    return matchesSearch && matchesType;
  });

  const handleUpload = async () => {
    if (!selectedPatient || !selectedFile) return;

    setUploading(true);
    try {
      const success = await uploadDocument(
        selectedPatient,
        selectedType,
        selectedFile,
        examDate ? format(examDate, "yyyy-MM-dd") : undefined,
        notes || undefined
      );

      if (success) {
        setUploadDialogOpen(false);
        resetUploadForm();
      }
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setSelectedPatient("");
    setSelectedType("rontgen");
    setSelectedFile(null);
    setExamDate(undefined);
    setNotes("");
  };

  const handleView = async (filePath: string) => {
    const url = await getDocumentUrl(filePath);
    if (url) {
      setViewingUrl(url);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteDocument(deleteId.id, deleteId.path);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <DashboardLayout
      title="Dokumen Medis"
      subtitle="Kelola dokumen Rontgen, EKG, dan Spirometry"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama pasien atau file..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Dokumen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Dokumen Medis</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Pilih Pasien *</Label>
                  <Select
                    value={selectedPatient}
                    onValueChange={setSelectedPatient}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pasien" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.no_rm} - {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Jenis Dokumen *</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(v) => setSelectedType(v as DocumentType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rontgen">Rontgen</SelectItem>
                      <SelectItem value="ekg">EKG</SelectItem>
                      <SelectItem value="spirometry">Spirometry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>File Dokumen *</Label>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary"
                    }`}
                  >
                    <input {...getInputProps()} />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileImage className="h-6 w-6 text-primary" />
                        <span className="font-medium">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm">
                          Drag & drop atau klik untuk upload
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, PDF (max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Pemeriksaan</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !examDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examDate
                          ? format(examDate, "dd MMMM yyyy")
                          : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={examDate}
                        onSelect={setExamDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Catatan</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadDialogOpen(false);
                      resetUploadForm();
                    }}
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedPatient || !selectedFile || uploading}
                  >
                    {uploading && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Upload
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs & Table */}
        <Card>
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as typeof activeTab)}
            >
              <div className="border-b px-4">
                <TabsList className="h-12 bg-transparent">
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="rontgen">Rontgen</TabsTrigger>
                  <TabsTrigger value="ekg">EKG</TabsTrigger>
                  <TabsTrigger value="spirometry">Spirometry</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="py-12 text-center">
                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Tidak ada dokumen yang cocok"
                        : "Belum ada dokumen medis"}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Tgl Periksa</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {doc.patient?.nama || "-"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {doc.patient?.no_rm || "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "font-normal",
                                documentTypeColors[doc.document_type]
                              )}
                            >
                              {documentTypeLabels[doc.document_type]}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {doc.file_name}
                          </TableCell>
                          <TableCell>
                            {formatDate(doc.examination_date)}
                          </TableCell>
                          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(doc.file_path)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDeleteId({
                                    id: doc.id,
                                    path: doc.file_path,
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          Total: {filteredDocuments.length} dokumen
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewingUrl} onOpenChange={() => setViewingUrl(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Preview Dokumen</DialogTitle>
          </DialogHeader>
          {viewingUrl && (
            <div className="overflow-auto max-h-[70vh]">
              {viewingUrl.includes(".pdf") ? (
                <iframe
                  src={viewingUrl}
                  className="w-full h-[70vh]"
                  title="PDF Preview"
                />
              ) : (
                <img
                  src={viewingUrl}
                  alt="Document preview"
                  className="max-w-full h-auto"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Dokumen</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MedicalDocuments;
