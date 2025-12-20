import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { MCUData } from '@/types/mcu';
import { useToast } from './use-toast';

interface MCURecord {
  id: string;
  nama_karyawan: string;
  patid: string | null;
  seksi: string | null;
  departemen: string | null;
  npk: string | null;
  jenis_kelamin: string | null;
  tanggal_lahir: string | null;
  usia: string | null;
  tanggal_mcu: string | null;
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
  tekanan_darah: string | null;
  nadi: string | null;
  suhu_badan: string | null;
  frekuensi_nafas: string | null;
  tinggi: string | null;
  berat: string | null;
  bmi: string | null;
  status_gizi: string | null;
  visus_mata_kanan: string | null;
  keadaan_umum_kanan: string | null;
  visus_mata_kiri: string | null;
  keadaan_umum_kiri: string | null;
  test_buta_warna: string | null;
  kesimpulan: string | null;
  saran: string | null;
  kriteria_status: string | null;
  status_resume: string | null;
  batch_id: string | null;
  created_at: string;
}

interface PDFHistory {
  id: string;
  nama_karyawan: string;
  npk: string | null;
  file_name: string;
  generated_at: string;
}

export const useMCUData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mcuRecords, setMcuRecords] = useState<MCURecord[]>([]);
  const [pdfHistory, setPdfHistory] = useState<PDFHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMCURecords = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('mcu_records')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching MCU records:', error);
    } else {
      setMcuRecords(data || []);
    }
  }, [user]);

  const fetchPDFHistory = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('pdf_history')
      .select('*')
      .order('generated_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching PDF history:', error);
    } else {
      setPdfHistory(data || []);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchMCURecords(), fetchPDFHistory()]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, fetchMCURecords, fetchPDFHistory]);

  const saveMCURecords = async (data: MCUData[], fileName: string): Promise<string | null> => {
    if (!user) return null;

    // Create batch record
    const { data: batch, error: batchError } = await supabase
      .from('upload_batches')
      .insert({
        user_id: user.id,
        file_name: fileName,
        total_records: data.length,
      })
      .select()
      .single();

    if (batchError) {
      console.error('Error creating batch:', batchError);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan batch data',
        variant: 'destructive',
      });
      return null;
    }

    // Insert MCU records
    const records = data.map((item) => ({
      user_id: user.id,
      batch_id: batch.id,
      nama_karyawan: item["Nama Karyawan"],
      patid: item["PATID"],
      seksi: item["SEKSI"],
      departemen: item["DEPARTEMEN"],
      npk: item["NPK"],
      jenis_kelamin: item["Jenis Kelamin"],
      tanggal_lahir: item["Tanggal lahir"],
      usia: item["Usia"],
      tanggal_mcu: item["Tanggal MCU"],
      riwayat_penyakit_sekarang: item["Riwayat Penyakit Sekarang"],
      riwayat_penyakit_dahulu: item["Riwayat Penyakit Dahulu"],
      riwayat_penyakit_keluarga: item["Riwayat Penyakit Keluarga"],
      riwayat_pengobatan: item["Riwayat Pengobatan"],
      riwayat_rawat_inap: item["Riwayat Rawat Inap"],
      riwayat_operasi: item["Riwayat Operasi"],
      riwayat_kecelakaan: item["Riwayat Kecelakaan"],
      merokok_vape: item["Merokok /Vape"],
      jumlah_batang: item["Jumlah Batang"],
      alkohol: item["Alkohol"],
      olahraga: item["Olahraga"],
      tekanan_darah: item["Tekanan Darah MmHg"],
      nadi: item["Nadi ()"],
      suhu_badan: item["Suhu Badan C"],
      frekuensi_nafas: item["Frekuensi nafas ()"],
      tinggi: item["Tinggi (cm)"],
      berat: item["Berat ()"],
      bmi: item["BMI"],
      status_gizi: item["Status Gizi"],
      visus_mata_kanan: item["Visus Mata Kanan"],
      keadaan_umum_kanan: item["Keadaan umum Kanan"],
      visus_mata_kiri: item["Visus Mata Kiri"],
      keadaan_umum_kiri: item["Keadaan Umum Kiri"],
      test_buta_warna: item["Test Buta Warna"],
      kesimpulan: item["Kesimpulan"],
      saran: item["Saran"],
      kriteria_status: item["Kriteria Status"],
      status_resume: item["Status_Resume"],
    }));

    const { error: insertError } = await supabase
      .from('mcu_records')
      .insert(records);

    if (insertError) {
      console.error('Error inserting MCU records:', insertError);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data MCU',
        variant: 'destructive',
      });
      return null;
    }

    await fetchMCURecords();
    return batch.id;
  };

  const savePDFHistory = async (mcuRecordId: string | null, namaKaryawan: string, npk: string, fileName: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('pdf_history')
      .insert({
        user_id: user.id,
        mcu_record_id: mcuRecordId,
        nama_karyawan: namaKaryawan,
        npk: npk,
        file_name: fileName,
      });

    if (error) {
      console.error('Error saving PDF history:', error);
    } else {
      await fetchPDFHistory();
    }
  };

  const deletePDFHistory = async (id: string) => {
    const { error } = await supabase
      .from('pdf_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting PDF history:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus riwayat',
        variant: 'destructive',
      });
    } else {
      await fetchPDFHistory();
      toast({
        title: 'Berhasil',
        description: 'Riwayat dihapus',
      });
    }
  };

  const convertRecordToMCUData = (record: MCURecord): MCUData => ({
    "Nama Karyawan": record.nama_karyawan,
    "PATID": record.patid || '',
    "SEKSI": record.seksi || '',
    "DEPARTEMEN": record.departemen || '',
    "NPK": record.npk || '',
    "Jenis Kelamin": record.jenis_kelamin || '',
    "Tanggal lahir": record.tanggal_lahir || '',
    "Usia": record.usia || '',
    "Tanggal MCU": record.tanggal_mcu || '',
    "Riwayat Penyakit Sekarang": record.riwayat_penyakit_sekarang || '',
    "Riwayat Penyakit Dahulu": record.riwayat_penyakit_dahulu || '',
    "Riwayat Penyakit Keluarga": record.riwayat_penyakit_keluarga || '',
    "Riwayat Pengobatan": record.riwayat_pengobatan || '',
    "Riwayat Rawat Inap": record.riwayat_rawat_inap || '',
    "Riwayat Operasi": record.riwayat_operasi || '',
    "Riwayat Kecelakaan": record.riwayat_kecelakaan || '',
    "Merokok /Vape": record.merokok_vape || '',
    "Jumlah Batang": record.jumlah_batang || '',
    "Alkohol": record.alkohol || '',
    "Olahraga": record.olahraga || '',
    "Tekanan Darah MmHg": record.tekanan_darah || '',
    "Nadi ()": record.nadi || '',
    "Suhu Badan C": record.suhu_badan || '',
    "Frekuensi nafas ()": record.frekuensi_nafas || '',
    "Tinggi (cm)": record.tinggi || '',
    "Berat ()": record.berat || '',
    "BMI": record.bmi || '',
    "Status Gizi": record.status_gizi || '',
    "Visus Mata Kanan": record.visus_mata_kanan || '',
    "Keadaan umum Kanan": record.keadaan_umum_kanan || '',
    "Visus Mata Kiri": record.visus_mata_kiri || '',
    "Keadaan Umum Kiri": record.keadaan_umum_kiri || '',
    "Test Buta Warna": record.test_buta_warna || '',
    "Kesimpulan": record.kesimpulan || '',
    "Saran": record.saran || '',
    "Kriteria Status": record.kriteria_status || '',
    "Status_Resume": record.status_resume || '',
  });

  return {
    mcuRecords,
    pdfHistory,
    loading,
    saveMCURecords,
    savePDFHistory,
    deletePDFHistory,
    convertRecordToMCUData,
    refresh: () => Promise.all([fetchMCURecords(), fetchPDFHistory()]),
  };
};
