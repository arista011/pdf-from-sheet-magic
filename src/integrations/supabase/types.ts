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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
