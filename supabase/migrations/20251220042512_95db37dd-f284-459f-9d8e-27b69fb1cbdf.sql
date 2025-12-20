-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create trigger for new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create mcu_records table for storing MCU data
CREATE TABLE public.mcu_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama_karyawan TEXT NOT NULL,
  patid TEXT,
  seksi TEXT,
  departemen TEXT,
  npk TEXT,
  jenis_kelamin TEXT,
  tanggal_lahir TEXT,
  usia TEXT,
  tanggal_mcu TEXT,
  riwayat_penyakit_sekarang TEXT,
  riwayat_penyakit_dahulu TEXT,
  riwayat_penyakit_keluarga TEXT,
  riwayat_pengobatan TEXT,
  riwayat_rawat_inap TEXT,
  riwayat_operasi TEXT,
  riwayat_kecelakaan TEXT,
  merokok_vape TEXT,
  jumlah_batang TEXT,
  alkohol TEXT,
  olahraga TEXT,
  tekanan_darah TEXT,
  nadi TEXT,
  suhu_badan TEXT,
  frekuensi_nafas TEXT,
  tinggi TEXT,
  berat TEXT,
  bmi TEXT,
  status_gizi TEXT,
  visus_mata_kanan TEXT,
  keadaan_umum_kanan TEXT,
  visus_mata_kiri TEXT,
  keadaan_umum_kiri TEXT,
  test_buta_warna TEXT,
  kesimpulan TEXT,
  saran TEXT,
  kriteria_status TEXT,
  status_resume TEXT,
  batch_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on mcu_records
ALTER TABLE public.mcu_records ENABLE ROW LEVEL SECURITY;

-- MCU records policies
CREATE POLICY "Users can view their own mcu records" ON public.mcu_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mcu records" ON public.mcu_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mcu records" ON public.mcu_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create pdf_history table for tracking generated PDFs
CREATE TABLE public.pdf_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mcu_record_id UUID REFERENCES public.mcu_records(id) ON DELETE CASCADE,
  nama_karyawan TEXT NOT NULL,
  npk TEXT,
  file_name TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pdf_history
ALTER TABLE public.pdf_history ENABLE ROW LEVEL SECURITY;

-- PDF history policies
CREATE POLICY "Users can view their own pdf history" ON public.pdf_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pdf history" ON public.pdf_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pdf history" ON public.pdf_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create upload_batches table to track Excel uploads
CREATE TABLE public.upload_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  total_records INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on upload_batches
ALTER TABLE public.upload_batches ENABLE ROW LEVEL SECURITY;

-- Upload batches policies
CREATE POLICY "Users can view their own batches" ON public.upload_batches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own batches" ON public.upload_batches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own batches" ON public.upload_batches
  FOR DELETE USING (auth.uid() = user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();