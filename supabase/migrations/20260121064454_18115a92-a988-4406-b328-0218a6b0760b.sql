-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'dokter', 'perawat');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- RLS policies for user_roles (only admin can manage)
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete roles"
ON public.user_roles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create MCU cases table (main workflow table)
CREATE TABLE public.mcu_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT NOT NULL UNIQUE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending_assessment' CHECK (status IN ('pending_assessment', 'pending_documents', 'pending_conclusion', 'completed', 'cancelled')),
    created_by UUID NOT NULL,
    assigned_nurse UUID,
    assigned_doctor UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nursing assessments table
CREATE TABLE public.nursing_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcu_case_id UUID REFERENCES public.mcu_cases(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nurse_id UUID NOT NULL,
    -- Vital signs
    tekanan_darah TEXT,
    nadi TEXT,
    suhu_badan TEXT,
    frekuensi_nafas TEXT,
    tinggi TEXT,
    berat TEXT,
    bmi TEXT,
    status_gizi TEXT,
    -- Vision
    visus_mata_kanan TEXT,
    visus_mata_kiri TEXT,
    keadaan_umum_mata_kanan TEXT,
    keadaan_umum_mata_kiri TEXT,
    test_buta_warna TEXT,
    -- Medical history
    riwayat_penyakit_sekarang TEXT,
    riwayat_penyakit_dahulu TEXT,
    riwayat_penyakit_keluarga TEXT,
    riwayat_pengobatan TEXT,
    riwayat_rawat_inap TEXT,
    riwayat_operasi TEXT,
    riwayat_kecelakaan TEXT,
    -- Lifestyle
    merokok_vape TEXT,
    jumlah_batang TEXT,
    alkohol TEXT,
    olahraga TEXT,
    -- Additional notes
    catatan_perawat TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create MCU documents table (for 3 photos + lab results)
CREATE TABLE public.mcu_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcu_case_id UUID REFERENCES public.mcu_cases(id) ON DELETE CASCADE NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('photo_1', 'photo_2', 'photo_3', 'lab_result')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create doctor conclusions table
CREATE TABLE public.doctor_conclusions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcu_case_id UUID REFERENCES public.mcu_cases(id) ON DELETE CASCADE NOT NULL UNIQUE,
    doctor_id UUID NOT NULL,
    diagnosis TEXT,
    kesimpulan TEXT,
    saran TEXT,
    kriteria_status TEXT CHECK (kriteria_status IN ('FIT TO WORK', 'FIT TO WORK WITH NOTE', 'UNFIT TO WORK')),
    status_resume TEXT,
    doctor_name TEXT,
    doctor_sip TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create generated PDFs table
CREATE TABLE public.mcu_generated_pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mcu_case_id UUID REFERENCES public.mcu_cases(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT,
    generated_by UUID NOT NULL,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.mcu_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nursing_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcu_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_conclusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mcu_generated_pdfs ENABLE ROW LEVEL SECURITY;

-- RLS policies for mcu_cases (all authenticated users with roles can access)
CREATE POLICY "Users with role can view mcu_cases"
ON public.mcu_cases FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Users with role can insert mcu_cases"
ON public.mcu_cases FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Users with role can update mcu_cases"
ON public.mcu_cases FOR UPDATE
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Admin can delete mcu_cases"
ON public.mcu_cases FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for nursing_assessments
CREATE POLICY "Users with role can view nursing_assessments"
ON public.nursing_assessments FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Nurses and admin can insert nursing_assessments"
ON public.nursing_assessments FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Nurses and admin can update nursing_assessments"
ON public.nursing_assessments FOR UPDATE
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Admin can delete nursing_assessments"
ON public.nursing_assessments FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for mcu_documents
CREATE POLICY "Users with role can view mcu_documents"
ON public.mcu_documents FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Nurses and admin can insert mcu_documents"
ON public.mcu_documents FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Admin can delete mcu_documents"
ON public.mcu_documents FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for doctor_conclusions
CREATE POLICY "Users with role can view doctor_conclusions"
ON public.doctor_conclusions FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Doctors and admin can insert doctor_conclusions"
ON public.doctor_conclusions FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter')
);

CREATE POLICY "Doctors and admin can update doctor_conclusions"
ON public.doctor_conclusions FOR UPDATE
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter')
);

CREATE POLICY "Admin can delete doctor_conclusions"
ON public.doctor_conclusions FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for mcu_generated_pdfs
CREATE POLICY "Users with role can view mcu_generated_pdfs"
ON public.mcu_generated_pdfs FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
);

CREATE POLICY "Doctors and admin can insert mcu_generated_pdfs"
ON public.mcu_generated_pdfs FOR INSERT
WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter')
);

CREATE POLICY "Admin can delete mcu_generated_pdfs"
ON public.mcu_generated_pdfs FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for mcu_cases
CREATE TRIGGER update_mcu_cases_updated_at
BEFORE UPDATE ON public.mcu_cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for nursing_assessments
CREATE TRIGGER update_nursing_assessments_updated_at
BEFORE UPDATE ON public.nursing_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update trigger for doctor_conclusions
CREATE TRIGGER update_doctor_conclusions_updated_at
BEFORE UPDATE ON public.doctor_conclusions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for MCU documents
INSERT INTO storage.buckets (id, name, public) VALUES ('mcu-documents', 'mcu-documents', false);

-- Storage policies for mcu-documents bucket
CREATE POLICY "Users with role can view mcu documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'mcu-documents' AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'dokter') OR
    public.has_role(auth.uid(), 'perawat')
));

CREATE POLICY "Users with role can upload mcu documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'mcu-documents' AND (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'perawat')
));

CREATE POLICY "Admin can delete mcu documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'mcu-documents' AND public.has_role(auth.uid(), 'admin'));

-- Function to generate MCU case number
CREATE OR REPLACE FUNCTION public.generate_mcu_case_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    today_count INTEGER;
    case_number TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO today_count
    FROM public.mcu_cases
    WHERE DATE(created_at) = CURRENT_DATE;
    
    case_number := 'MCU-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || LPAD(today_count::TEXT, 4, '0');
    RETURN case_number;
END;
$$;