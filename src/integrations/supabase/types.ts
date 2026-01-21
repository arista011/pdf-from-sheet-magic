export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      doctor_conclusions: {
        Row: {
          created_at: string
          diagnosis: string | null
          doctor_id: string
          doctor_name: string | null
          doctor_sip: string | null
          id: string
          kesimpulan: string | null
          kriteria_status: string | null
          mcu_case_id: string
          saran: string | null
          status_resume: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          doctor_id: string
          doctor_name?: string | null
          doctor_sip?: string | null
          id?: string
          kesimpulan?: string | null
          kriteria_status?: string | null
          mcu_case_id: string
          saran?: string | null
          status_resume?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string
          doctor_name?: string | null
          doctor_sip?: string | null
          id?: string
          kesimpulan?: string | null
          kriteria_status?: string | null
          mcu_case_id?: string
          saran?: string | null
          status_resume?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_conclusions_mcu_case_id_fkey"
            columns: ["mcu_case_id"]
            isOneToOne: true
            referencedRelation: "mcu_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      mcu_cases: {
        Row: {
          assigned_doctor: string | null
          assigned_nurse: string | null
          case_number: string
          created_at: string
          created_by: string
          id: string
          patient_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_doctor?: string | null
          assigned_nurse?: string | null
          case_number: string
          created_at?: string
          created_by: string
          id?: string
          patient_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_doctor?: string | null
          assigned_nurse?: string | null
          case_number?: string
          created_at?: string
          created_by?: string
          id?: string
          patient_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcu_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      mcu_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mcu_case_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mcu_case_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mcu_case_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcu_documents_mcu_case_id_fkey"
            columns: ["mcu_case_id"]
            isOneToOne: false
            referencedRelation: "mcu_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      mcu_generated_pdfs: {
        Row: {
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          file_name: string
          file_path: string | null
          generated_by: string
          id: string
          mcu_case_id: string
        }
        Insert: {
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          file_name: string
          file_path?: string | null
          generated_by: string
          id?: string
          mcu_case_id: string
        }
        Update: {
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          file_name?: string
          file_path?: string | null
          generated_by?: string
          id?: string
          mcu_case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcu_generated_pdfs_mcu_case_id_fkey"
            columns: ["mcu_case_id"]
            isOneToOne: false
            referencedRelation: "mcu_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      mcu_records: {
        Row: {
          alkohol: string | null
          batch_id: string | null
          berat: string | null
          bmi: string | null
          created_at: string
          departemen: string | null
          frekuensi_nafas: string | null
          id: string
          jenis_kelamin: string | null
          jumlah_batang: string | null
          keadaan_umum_kanan: string | null
          keadaan_umum_kiri: string | null
          kesimpulan: string | null
          kriteria_status: string | null
          merokok_vape: string | null
          nadi: string | null
          nama_karyawan: string
          npk: string | null
          olahraga: string | null
          patid: string | null
          riwayat_kecelakaan: string | null
          riwayat_operasi: string | null
          riwayat_pengobatan: string | null
          riwayat_penyakit_dahulu: string | null
          riwayat_penyakit_keluarga: string | null
          riwayat_penyakit_sekarang: string | null
          riwayat_rawat_inap: string | null
          saran: string | null
          seksi: string | null
          status_gizi: string | null
          status_resume: string | null
          suhu_badan: string | null
          tanggal_lahir: string | null
          tanggal_mcu: string | null
          tekanan_darah: string | null
          test_buta_warna: string | null
          tinggi: string | null
          user_id: string
          usia: string | null
          visus_mata_kanan: string | null
          visus_mata_kiri: string | null
        }
        Insert: {
          alkohol?: string | null
          batch_id?: string | null
          berat?: string | null
          bmi?: string | null
          created_at?: string
          departemen?: string | null
          frekuensi_nafas?: string | null
          id?: string
          jenis_kelamin?: string | null
          jumlah_batang?: string | null
          keadaan_umum_kanan?: string | null
          keadaan_umum_kiri?: string | null
          kesimpulan?: string | null
          kriteria_status?: string | null
          merokok_vape?: string | null
          nadi?: string | null
          nama_karyawan: string
          npk?: string | null
          olahraga?: string | null
          patid?: string | null
          riwayat_kecelakaan?: string | null
          riwayat_operasi?: string | null
          riwayat_pengobatan?: string | null
          riwayat_penyakit_dahulu?: string | null
          riwayat_penyakit_keluarga?: string | null
          riwayat_penyakit_sekarang?: string | null
          riwayat_rawat_inap?: string | null
          saran?: string | null
          seksi?: string | null
          status_gizi?: string | null
          status_resume?: string | null
          suhu_badan?: string | null
          tanggal_lahir?: string | null
          tanggal_mcu?: string | null
          tekanan_darah?: string | null
          test_buta_warna?: string | null
          tinggi?: string | null
          user_id: string
          usia?: string | null
          visus_mata_kanan?: string | null
          visus_mata_kiri?: string | null
        }
        Update: {
          alkohol?: string | null
          batch_id?: string | null
          berat?: string | null
          bmi?: string | null
          created_at?: string
          departemen?: string | null
          frekuensi_nafas?: string | null
          id?: string
          jenis_kelamin?: string | null
          jumlah_batang?: string | null
          keadaan_umum_kanan?: string | null
          keadaan_umum_kiri?: string | null
          kesimpulan?: string | null
          kriteria_status?: string | null
          merokok_vape?: string | null
          nadi?: string | null
          nama_karyawan?: string
          npk?: string | null
          olahraga?: string | null
          patid?: string | null
          riwayat_kecelakaan?: string | null
          riwayat_operasi?: string | null
          riwayat_pengobatan?: string | null
          riwayat_penyakit_dahulu?: string | null
          riwayat_penyakit_keluarga?: string | null
          riwayat_penyakit_sekarang?: string | null
          riwayat_rawat_inap?: string | null
          saran?: string | null
          seksi?: string | null
          status_gizi?: string | null
          status_resume?: string | null
          suhu_badan?: string | null
          tanggal_lahir?: string | null
          tanggal_mcu?: string | null
          tekanan_darah?: string | null
          test_buta_warna?: string | null
          tinggi?: string | null
          user_id?: string
          usia?: string | null
          visus_mata_kanan?: string | null
          visus_mata_kiri?: string | null
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          created_at: string
          document_type: string
          examination_date: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          notes: string | null
          patient_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          examination_date?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          examination_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      nursing_assessments: {
        Row: {
          alkohol: string | null
          berat: string | null
          bmi: string | null
          catatan_perawat: string | null
          created_at: string
          frekuensi_nafas: string | null
          id: string
          jumlah_batang: string | null
          keadaan_umum_mata_kanan: string | null
          keadaan_umum_mata_kiri: string | null
          mcu_case_id: string
          merokok_vape: string | null
          nadi: string | null
          nurse_id: string
          olahraga: string | null
          riwayat_kecelakaan: string | null
          riwayat_operasi: string | null
          riwayat_pengobatan: string | null
          riwayat_penyakit_dahulu: string | null
          riwayat_penyakit_keluarga: string | null
          riwayat_penyakit_sekarang: string | null
          riwayat_rawat_inap: string | null
          status_gizi: string | null
          suhu_badan: string | null
          tekanan_darah: string | null
          test_buta_warna: string | null
          tinggi: string | null
          updated_at: string
          visus_mata_kanan: string | null
          visus_mata_kiri: string | null
        }
        Insert: {
          alkohol?: string | null
          berat?: string | null
          bmi?: string | null
          catatan_perawat?: string | null
          created_at?: string
          frekuensi_nafas?: string | null
          id?: string
          jumlah_batang?: string | null
          keadaan_umum_mata_kanan?: string | null
          keadaan_umum_mata_kiri?: string | null
          mcu_case_id: string
          merokok_vape?: string | null
          nadi?: string | null
          nurse_id: string
          olahraga?: string | null
          riwayat_kecelakaan?: string | null
          riwayat_operasi?: string | null
          riwayat_pengobatan?: string | null
          riwayat_penyakit_dahulu?: string | null
          riwayat_penyakit_keluarga?: string | null
          riwayat_penyakit_sekarang?: string | null
          riwayat_rawat_inap?: string | null
          status_gizi?: string | null
          suhu_badan?: string | null
          tekanan_darah?: string | null
          test_buta_warna?: string | null
          tinggi?: string | null
          updated_at?: string
          visus_mata_kanan?: string | null
          visus_mata_kiri?: string | null
        }
        Update: {
          alkohol?: string | null
          berat?: string | null
          bmi?: string | null
          catatan_perawat?: string | null
          created_at?: string
          frekuensi_nafas?: string | null
          id?: string
          jumlah_batang?: string | null
          keadaan_umum_mata_kanan?: string | null
          keadaan_umum_mata_kiri?: string | null
          mcu_case_id?: string
          merokok_vape?: string | null
          nadi?: string | null
          nurse_id?: string
          olahraga?: string | null
          riwayat_kecelakaan?: string | null
          riwayat_operasi?: string | null
          riwayat_pengobatan?: string | null
          riwayat_penyakit_dahulu?: string | null
          riwayat_penyakit_keluarga?: string | null
          riwayat_penyakit_sekarang?: string | null
          riwayat_rawat_inap?: string | null
          status_gizi?: string | null
          suhu_badan?: string | null
          tekanan_darah?: string | null
          test_buta_warna?: string | null
          tinggi?: string | null
          updated_at?: string
          visus_mata_kanan?: string | null
          visus_mata_kiri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nursing_assessments_mcu_case_id_fkey"
            columns: ["mcu_case_id"]
            isOneToOne: true
            referencedRelation: "mcu_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          alamat: string | null
          created_at: string
          id: string
          jenis_kelamin: string | null
          nama: string
          no_rm: string
          no_telepon: string | null
          perusahaan: string | null
          tanggal_lahir: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin?: string | null
          nama: string
          no_rm: string
          no_telepon?: string | null
          perusahaan?: string | null
          tanggal_lahir?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          id?: string
          jenis_kelamin?: string | null
          nama?: string
          no_rm?: string
          no_telepon?: string | null
          perusahaan?: string | null
          tanggal_lahir?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_history: {
        Row: {
          file_name: string
          generated_at: string
          id: string
          mcu_record_id: string | null
          nama_karyawan: string
          npk: string | null
          user_id: string
        }
        Insert: {
          file_name: string
          generated_at?: string
          id?: string
          mcu_record_id?: string | null
          nama_karyawan: string
          npk?: string | null
          user_id: string
        }
        Update: {
          file_name?: string
          generated_at?: string
          id?: string
          mcu_record_id?: string | null
          nama_karyawan?: string
          npk?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pdf_history_mcu_record_id_fkey"
            columns: ["mcu_record_id"]
            isOneToOne: false
            referencedRelation: "mcu_records"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      upload_batches: {
        Row: {
          file_name: string
          id: string
          total_records: number
          uploaded_at: string
          user_id: string
        }
        Insert: {
          file_name: string
          id?: string
          total_records?: number
          uploaded_at?: string
          user_id: string
        }
        Update: {
          file_name?: string
          id?: string
          total_records?: number
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_mcu_case_number: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "dokter" | "perawat"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "dokter", "perawat"],
    },
  },
} as const
