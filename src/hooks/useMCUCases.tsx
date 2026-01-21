import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface MCUCase {
  id: string;
  case_number: string;
  patient_id: string;
  status: "pending_assessment" | "pending_documents" | "pending_conclusion" | "completed" | "cancelled";
  created_by: string;
  assigned_nurse: string | null;
  assigned_doctor: string | null;
  created_at: string;
  updated_at: string;
  patient?: {
    id: string;
    nama: string;
    no_rm: string;
    tanggal_lahir: string | null;
    jenis_kelamin: string | null;
    perusahaan: string | null;
    alamat: string | null;
    no_telepon: string | null;
  };
  nursing_assessment?: NursingAssessment | null;
  doctor_conclusion?: DoctorConclusion | null;
  documents?: MCUDocument[];
}

export interface NursingAssessment {
  id: string;
  mcu_case_id: string;
  nurse_id: string;
  tekanan_darah: string | null;
  nadi: string | null;
  suhu_badan: string | null;
  frekuensi_nafas: string | null;
  tinggi: string | null;
  berat: string | null;
  bmi: string | null;
  status_gizi: string | null;
  visus_mata_kanan: string | null;
  visus_mata_kiri: string | null;
  keadaan_umum_mata_kanan: string | null;
  keadaan_umum_mata_kiri: string | null;
  test_buta_warna: string | null;
  riwayat_penyakit_sekarang: string | null;
  riwayat_penyakit_dahulu: string | null;
  riwayat_penyakit_keluarga: string | null;
  riwayat_pengobatan: string | null;
  riwayat_rawat_inap: string | null;
  riwayat_operasi: string | null;
  riwayat_kecelakaan: string | null;
  merokok_vape: string | null;
  jumlah_batang: string | null;
  alkohol: string | null;
  olahraga: string | null;
  catatan_perawat: string | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorConclusion {
  id: string;
  mcu_case_id: string;
  doctor_id: string;
  diagnosis: string | null;
  kesimpulan: string | null;
  saran: string | null;
  kriteria_status: "FIT TO WORK" | "FIT TO WORK WITH NOTE" | "UNFIT TO WORK" | null;
  status_resume: string | null;
  doctor_name: string | null;
  doctor_sip: string | null;
  created_at: string;
  updated_at: string;
}

export interface MCUDocument {
  id: string;
  mcu_case_id: string;
  document_type: "photo_1" | "photo_2" | "photo_3" | "lab_result";
  file_name: string;
  file_path: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
}

export const useMCUCases = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cases, setCases] = useState<MCUCase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("mcu_cases")
        .select(`
          *,
          patient:patients(*),
          nursing_assessment:nursing_assessments(*),
          doctor_conclusion:doctor_conclusions(*),
          documents:mcu_documents(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform array results to single objects where needed
      const transformedCases = (data || []).map((c: any): MCUCase => ({
        ...c,
        status: c.status as MCUCase["status"],
        nursing_assessment: Array.isArray(c.nursing_assessment) 
          ? c.nursing_assessment[0] || null 
          : c.nursing_assessment,
        doctor_conclusion: Array.isArray(c.doctor_conclusion) 
          ? c.doctor_conclusion[0] || null 
          : c.doctor_conclusion,
        patient: Array.isArray(c.patient) 
          ? c.patient[0] 
          : c.patient,
      }));

      setCases(transformedCases);
    } catch (error) {
      console.error("Error fetching MCU cases:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data kasus MCU",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      fetchCases();
    }
  }, [user, fetchCases]);

  const createCase = async (patientId: string): Promise<MCUCase | null> => {
    if (!user) return null;

    try {
      // Generate case number
      const { data: caseNumber, error: caseNumberError } = await supabase
        .rpc("generate_mcu_case_number");

      if (caseNumberError) throw caseNumberError;

      const { data, error } = await supabase
        .from("mcu_cases")
        .insert({
          case_number: caseNumber,
          patient_id: patientId,
          created_by: user.id,
          status: "pending_assessment",
        })
        .select(`
          *,
          patient:patients(*)
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: `Kasus MCU ${caseNumber} berhasil dibuat`,
      });

      await fetchCases();
      return data as unknown as MCUCase;
    } catch (error) {
      console.error("Error creating MCU case:", error);
      toast({
        title: "Error",
        description: "Gagal membuat kasus MCU",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCaseStatus = async (
    caseId: string,
    status: MCUCase["status"]
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("mcu_cases")
        .update({ status })
        .eq("id", caseId);

      if (error) throw error;

      await fetchCases();
      return true;
    } catch (error) {
      console.error("Error updating case status:", error);
      toast({
        title: "Error",
        description: "Gagal mengupdate status kasus",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCase = async (caseId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("mcu_cases")
        .delete()
        .eq("id", caseId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Kasus MCU berhasil dihapus",
      });

      await fetchCases();
      return true;
    } catch (error) {
      console.error("Error deleting case:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus kasus MCU",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    cases,
    loading,
    createCase,
    updateCaseStatus,
    deleteCase,
    refetch: fetchCases,
  };
};

export const useMCUCase = (caseId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mcuCase, setMcuCase] = useState<MCUCase | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCase = useCallback(async () => {
    if (!user || !caseId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("mcu_cases")
        .select(`
          *,
          patient:patients(*),
          nursing_assessment:nursing_assessments(*),
          doctor_conclusion:doctor_conclusions(*),
          documents:mcu_documents(*)
        `)
        .eq("id", caseId)
        .single();

      if (error) throw error;

      // Transform data
      const transformed = {
        ...data,
        status: data.status as MCUCase["status"],
        nursing_assessment: Array.isArray(data.nursing_assessment) 
          ? data.nursing_assessment[0] || null 
          : data.nursing_assessment,
        doctor_conclusion: Array.isArray(data.doctor_conclusion) 
          ? data.doctor_conclusion[0] || null 
          : data.doctor_conclusion,
        patient: Array.isArray(data.patient) 
          ? data.patient[0] 
          : data.patient,
        documents: (data.documents || []).map((d: any) => ({
          ...d,
          document_type: d.document_type as MCUDocument["document_type"],
        })),
      } as MCUCase;

      setMcuCase(transformed);
    } catch (error) {
      console.error("Error fetching MCU case:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data kasus MCU",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, caseId, toast]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const saveAssessment = async (
    data: Partial<NursingAssessment>
  ): Promise<boolean> => {
    if (!user || !caseId) return false;

    try {
      // Check if assessment exists
      const { data: existing } = await supabase
        .from("nursing_assessments")
        .select("id")
        .eq("mcu_case_id", caseId)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("nursing_assessments")
          .update(data)
          .eq("mcu_case_id", caseId);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("nursing_assessments")
          .insert({
            ...data,
            mcu_case_id: caseId,
            nurse_id: user.id,
          });

        if (error) throw error;
      }

      // Update case status
      await supabase
        .from("mcu_cases")
        .update({ status: "pending_documents" })
        .eq("id", caseId);

      toast({
        title: "Berhasil",
        description: "Asesmen keperawatan berhasil disimpan",
      });

      await fetchCase();
      return true;
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan asesmen",
        variant: "destructive",
      });
      return false;
    }
  };

  const saveConclusion = async (
    data: Partial<DoctorConclusion>
  ): Promise<boolean> => {
    if (!user || !caseId) return false;

    try {
      // Check if conclusion exists
      const { data: existing } = await supabase
        .from("doctor_conclusions")
        .select("id")
        .eq("mcu_case_id", caseId)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from("doctor_conclusions")
          .update(data)
          .eq("mcu_case_id", caseId);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("doctor_conclusions")
          .insert({
            ...data,
            mcu_case_id: caseId,
            doctor_id: user.id,
          });

        if (error) throw error;
      }

      // Update case status
      await supabase
        .from("mcu_cases")
        .update({ status: "completed" })
        .eq("id", caseId);

      toast({
        title: "Berhasil",
        description: "Kesimpulan dokter berhasil disimpan",
      });

      await fetchCase();
      return true;
    } catch (error) {
      console.error("Error saving conclusion:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan kesimpulan",
        variant: "destructive",
      });
      return false;
    }
  };

  const uploadDocument = async (
    file: File,
    documentType: MCUDocument["document_type"]
  ): Promise<boolean> => {
    if (!user || !caseId) return false;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${caseId}/${documentType}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("mcu-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save record
      const { error } = await supabase.from("mcu_documents").insert({
        mcu_case_id: caseId,
        document_type: documentType,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        uploaded_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Dokumen berhasil diupload",
      });

      await fetchCase();
      return true;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Gagal mengupload dokumen",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDocument = async (documentId: string, filePath: string): Promise<boolean> => {
    try {
      // Delete from storage
      await supabase.storage.from("mcu-documents").remove([filePath]);

      // Delete record
      const { error } = await supabase
        .from("mcu_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Dokumen berhasil dihapus",
      });

      await fetchCase();
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus dokumen",
        variant: "destructive",
      });
      return false;
    }
  };

  const getDocumentUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from("mcu-documents")
        .createSignedUrl(filePath, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting document URL:", error);
      return null;
    }
  };

  return {
    mcuCase,
    loading,
    saveAssessment,
    saveConclusion,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    refetch: fetchCase,
  };
};