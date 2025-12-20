import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export type DocumentType = "rontgen" | "ekg" | "spirometry";

export interface MedicalDocument {
  id: string;
  user_id: string;
  patient_id: string;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number | null;
  notes: string | null;
  examination_date: string | null;
  created_at: string;
}

export interface MedicalDocumentWithPatient extends MedicalDocument {
  patient?: {
    nama: string;
    no_rm: string;
  };
}

export const useMedicalDocuments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<MedicalDocumentWithPatient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("medical_documents")
      .select(
        `
        *,
        patient:patients(nama, no_rm)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching medical documents:", error);
      toast({
        title: "Error",
        description: "Gagal mengambil data dokumen medis",
        variant: "destructive",
      });
    } else {
      setDocuments((data || []) as MedicalDocumentWithPatient[]);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchDocuments().finally(() => setLoading(false));
    }
  }, [user, fetchDocuments]);

  const uploadDocument = async (
    patientId: string,
    documentType: DocumentType,
    file: File,
    examinationDate?: string,
    notes?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      // Upload file to storage
      const filePath = `${user.id}/${patientId}/${documentType}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("medical-documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast({
          title: "Error",
          description: "Gagal mengupload file",
          variant: "destructive",
        });
        return false;
      }

      // Create database record
      const { error: dbError } = await supabase.from("medical_documents").insert({
        user_id: user.id,
        patient_id: patientId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        examination_date: examinationDate || null,
        notes: notes || null,
      });

      if (dbError) {
        console.error("Error saving document record:", dbError);
        toast({
          title: "Error",
          description: "Gagal menyimpan data dokumen",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Berhasil",
        description: "Dokumen berhasil diupload",
      });

      await fetchDocuments();
      return true;
    } catch (error) {
      console.error("Error in uploadDocument:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat upload dokumen",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDocument = async (id: string, filePath: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("medical-documents")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("medical_documents")
        .delete()
        .eq("id", id);

      if (dbError) {
        console.error("Error deleting document record:", dbError);
        toast({
          title: "Error",
          description: "Gagal menghapus dokumen",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Berhasil",
        description: "Dokumen berhasil dihapus",
      });

      await fetchDocuments();
      return true;
    } catch (error) {
      console.error("Error in deleteDocument:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus dokumen",
        variant: "destructive",
      });
      return false;
    }
  };

  const getDocumentUrl = async (filePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from("medical-documents")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error("Error getting signed URL:", error);
      return null;
    }

    return data.signedUrl;
  };

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    refetch: fetchDocuments,
  };
};
