-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('exporter', 'importer', 'admin');
CREATE TYPE profile_status AS ENUM ('pending', 'active', 'suspended');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  status profile_status DEFAULT 'pending',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exporter profiles
CREATE TABLE exporter_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  products TEXT[] NOT NULL,
  moq INTEGER NOT NULL,
  moq_unit TEXT NOT NULL DEFAULT 'pieces',
  certifications TEXT[],
  product_images TEXT[], -- Array of Supabase Storage URLs
  description TEXT,
  phone TEXT,
  website TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Importer profiles
CREATE TABLE importer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  interested_categories TEXT[],
  phone TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE importer_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "System can create profiles for new users"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Exporter profiles policies
CREATE POLICY "Anyone can view active exporter profiles"
  ON exporter_profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "Exporters can insert their own profile"
  ON exporter_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Exporters can update their own profile"
  ON exporter_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Importer profiles policies
CREATE POLICY "Importers can view their own profile"
  ON importer_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Importers can insert their own profile"
  ON importer_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Importers can update their own profile"
  ON importer_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'importer')::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
  BEFORE UPDATE ON exporter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_importer_profiles_updated_at
  BEFORE UPDATE ON importer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
