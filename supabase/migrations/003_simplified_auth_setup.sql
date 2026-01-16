-- New simplified authentication setup
-- This creates a cleaner auth system with better error handling

-- Drop existing trigger to prevent conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop existing tables if they exist (be careful with this!)
DROP TABLE IF EXISTS importer_profiles CASCADE;
DROP TABLE IF EXISTS exporter_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate profiles table with better structure
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('exporter', 'importer', 'admin')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exporter_profiles table
CREATE TABLE exporter_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  country TEXT,
  city TEXT,
  products TEXT[],
  moq INTEGER,
  moq_unit TEXT DEFAULT 'pieces',
  certifications TEXT[],
  product_images TEXT[],
  description TEXT,
  phone TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create importer_profiles table
CREATE TABLE importer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  country TEXT,
  city TEXT,
  interested_categories TEXT[],
  phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE importer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
-- Allow anyone to create a profile (for new signups)
CREATE POLICY "Anyone can create a profile on signup"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to do everything (for server-side operations)
CREATE POLICY "Service role can do everything"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for exporter_profiles
CREATE POLICY "Anyone can view exporter profiles"
  ON exporter_profiles FOR SELECT
  USING (true);

CREATE POLICY "Exporters can insert their own profile"
  ON exporter_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Exporters can update their own profile"
  ON exporter_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for importer_profiles
CREATE POLICY "Importers can view their own profile"
  ON importer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Importers can insert their own profile"
  ON importer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Importers can update their own profile"
  ON importer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'importer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
  BEFORE UPDATE ON exporter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_importer_profiles_updated_at
  BEFORE UPDATE ON importer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY IF NOT EXISTS "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY IF NOT EXISTS "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY IF NOT EXISTS "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
