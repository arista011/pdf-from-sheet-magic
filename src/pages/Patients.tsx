import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { usePatients, Patient } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";

const Patients = () => {
  const { patients, loading, deletePatient } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.no_rm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handleDelete = async () => {
    if (deleteId) {
      await deletePatient(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return dateString;
    }
  };

  return (
    <DashboardLayout
      title="Daftar Pasien"
      subtitle="Kelola data pasien Anda"
    >
      <div className="space-y-6">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, No. RM, atau perusahaan..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/patients/bulk">
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Link>
            </Button>
            <Button asChild>
              <Link to="/patients/add">
                <UserPlus className="h-4 w-4 mr-2" />
                Tambah Pasien
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Tidak ada pasien yang cocok dengan pencarian"
                    : "Belum ada data pasien"}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" asChild>
                    <Link to="/patients/add">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Tambah Pasien Pertama
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. RM</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tanggal Lahir</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead className="w-[80px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.no_rm}
                      </TableCell>
                      <TableCell>{patient.nama}</TableCell>
                      <TableCell>{formatDate(patient.tanggal_lahir)}</TableCell>
                      <TableCell>{patient.jenis_kelamin || "-"}</TableCell>
                      <TableCell>{patient.perusahaan || "-"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/patients/edit/${patient.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(patient.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          Total: {filteredPatients.length} pasien
          {searchTerm && ` (dari ${patients.length} total)`}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pasien</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pasien ini? Semua dokumen medis
              terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
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

export default Patients;
