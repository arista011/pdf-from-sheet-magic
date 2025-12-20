import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Patient {
  id: string;
  user_id: string;
  no_rm: string;
  nama: string;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  perusahaan: string | null;
  alamat: string | null;
  no_telepon: string | null;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  no_rm: string;
  nama: string;
  tanggal_lahir?: string;
  jenis_kelamin?: string;
  perusahaan?: string;
  alamat?: string;
  no_telepon?: string;
}

export const usePatients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pasien",
        variant: "destructive",
      });
    } else {
      setPatients(data || []);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchPatients().finally(() => setLoading(false));
    }
  }, [user, fetchPatients]);

  const addPatient = async (data: PatientFormData): Promise<Patient | null> => {
    if (!user) return null;

    const { data: newPatient, error } = await supabase
      .from("patients")
      .insert({
        user_id: user.id,
        no_rm: data.no_rm,
        nama: data.nama,
        tanggal_lahir: data.tanggal_lahir || null,
        jenis_kelamin: data.jenis_kelamin || null,
        perusahaan: data.perusahaan || null,
        alamat: data.alamat || null,
        no_telepon: data.no_telepon || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: "Gagal menambah pasien",
        variant: "destructive",
      });
      return null;
    }

    toast({
      title: "Berhasil",
      description: "Pasien berhasil ditambahkan",
    });

    await fetchPatients();
    return newPatient;
  };

  const updatePatient = async (
    id: string,
    data: Partial<PatientFormData>
  ): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase
      .from("patients")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Gagal mengupdate pasien",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Berhasil",
      description: "Pasien berhasil diupdate",
    });

    await fetchPatients();
    return true;
  };

  const deletePatient = async (id: string): Promise<boolean> => {
    if (!user) return false;

    const { error } = await supabase.from("patients").delete().eq("id", id);

    if (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus pasien",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Berhasil",
      description: "Pasien berhasil dihapus",
    });

    await fetchPatients();
    return true;
  };

  const addBulkPatients = async (
    patientsData: PatientFormData[]
  ): Promise<boolean> => {
    if (!user) return false;

    const records = patientsData.map((p) => ({
      user_id: user.id,
      no_rm: p.no_rm,
      nama: p.nama,
      tanggal_lahir: p.tanggal_lahir || null,
      jenis_kelamin: p.jenis_kelamin || null,
      perusahaan: p.perusahaan || null,
      alamat: p.alamat || null,
      no_telepon: p.no_telepon || null,
    }));

    const { error } = await supabase.from("patients").insert(records);

    if (error) {
      console.error("Error adding bulk patients:", error);
      toast({
        title: "Error",
        description: "Gagal menambah pasien secara bulk",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Berhasil",
      description: `${patientsData.length} pasien berhasil ditambahkan`,
    });

    await fetchPatients();
    return true;
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    addBulkPatients,
    refetch: fetchPatients,
  };
};
