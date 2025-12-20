import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Loader2, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { usePatients, PatientFormData } from "@/hooks/usePatients";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addPatient, updatePatient } = usePatients();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState<PatientFormData>({
    no_rm: "",
    nama: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    perusahaan: "",
    alamat: "",
    no_telepon: "",
  });
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (isEdit && id) {
      const fetchPatient = async () => {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error || !data) {
          navigate("/patients");
          return;
        }

        setFormData({
          no_rm: data.no_rm,
          nama: data.nama,
          tanggal_lahir: data.tanggal_lahir || "",
          jenis_kelamin: data.jenis_kelamin || "",
          perusahaan: data.perusahaan || "",
          alamat: data.alamat || "",
          no_telepon: data.no_telepon || "",
        });

        if (data.tanggal_lahir) {
          setDate(new Date(data.tanggal_lahir));
        }

        setFetching(false);
      };

      fetchPatient();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        tanggal_lahir: date ? format(date, "yyyy-MM-dd") : undefined,
      };

      if (isEdit && id) {
        const success = await updatePatient(id, dataToSave);
        if (success) {
          navigate("/patients");
        }
      } else {
        const result = await addPatient(dataToSave);
        if (result) {
          navigate("/patients");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEdit ? "Edit Pasien" : "Tambah Pasien"}
      subtitle={isEdit ? "Ubah data pasien" : "Tambah pasien baru"}
    >
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/patients")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEdit ? "Form Edit Pasien" : "Form Tambah Pasien"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="no_rm">No. Rekam Medis *</Label>
                  <Input
                    id="no_rm"
                    value={formData.no_rm}
                    onChange={(e) =>
                      setFormData({ ...formData, no_rm: e.target.value })
                    }
                    required
                    placeholder="Contoh: 100548220"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tanggal Lahir</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd MMMM yyyy") : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                  <Select
                    value={formData.jenis_kelamin}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jenis_kelamin: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laki-Laki">Laki-Laki</SelectItem>
                      <SelectItem value="Perempuan">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="perusahaan">Perusahaan</Label>
                  <Input
                    id="perusahaan"
                    value={formData.perusahaan}
                    onChange={(e) =>
                      setFormData({ ...formData, perusahaan: e.target.value })
                    }
                    placeholder="Nama perusahaan"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                    placeholder="Alamat lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="no_telepon">No. Telepon</Label>
                  <Input
                    id="no_telepon"
                    value={formData.no_telepon}
                    onChange={(e) =>
                      setFormData({ ...formData, no_telepon: e.target.value })
                    }
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/patients")}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEdit ? "Simpan Perubahan" : "Tambah Pasien"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PatientForm;
