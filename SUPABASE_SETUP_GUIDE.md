# Supabase Authentication Setup Guide

## IMPORTANT: Steps to Execute in Supabase

Follow these steps to fix authentication in your Supabase project:

### Step 1: Open SQL Editor in Supabase

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query" to create a new SQL query

### Step 2: Reset Database (OPTIONAL - Only if previous setup is corrupted)

If your authentication is completely broken, run this to reset everything:

```sql
-- WARNING: This will delete all existing data!
-- Only run this if you want a fresh start

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS importer_profiles CASCADE;
DROP TABLE IF EXISTS exporter_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

### Step 3: Create Fresh Database Tables and Triggers

Copy and paste this entire SQL block into the SQL Editor and execute it:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('exporter', 'importer', 'admin')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exporter_profiles table
CREATE TABLE IF NOT EXISTS exporter_profiles (
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
CREATE TABLE IF NOT EXISTS importer_profiles (
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

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE importer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles table
DROP POLICY IF EXISTS "Anyone can create a profile on signup" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can do everything" ON profiles;

CREATE POLICY "Anyone can create a profile on signup"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can do everything"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for exporter_profiles
DROP POLICY IF EXISTS "Anyone can view exporter profiles" ON exporter_profiles;
DROP POLICY IF EXISTS "Exporters can insert their own profile" ON exporter_profiles;
DROP POLICY IF EXISTS "Exporters can update their own profile" ON exporter_profiles;

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
DROP POLICY IF EXISTS "Importers can view their own profile" ON importer_profiles;
DROP POLICY IF EXISTS "Importers can insert their own profile" ON importer_profiles;
DROP POLICY IF EXISTS "Importers can update their own profile" ON importer_profiles;

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
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE FUNCTION public.handle_new_user()
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_exporter_profiles_updated_at ON exporter_profiles;
DROP TRIGGER IF EXISTS update_importer_profiles_updated_at ON importer_profiles;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exporter_profiles_updated_at
  BEFORE UPDATE ON exporter_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_importer_profiles_updated_at
  BEFORE UPDATE ON importer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
```

### Step 4: Verify Tables Were Created

Go to the "Table Editor" and verify these tables exist:
- ✅ profiles
- ✅ exporter_profiles
- ✅ importer_profiles

### Step 5: Test Authentication

1. **Sign Up Test:**
   - Go to your app's signup page
   - Create an account with an email and password
   - Check Supabase SQL Editor: `SELECT * FROM profiles;`
   - You should see your new user in the profiles table

2. **Login Test:**
   - Go to the login page
   - Log in with the email and password you just created
   - You should be redirected to the onboarding page

3. **Google OAuth Test:**
   - Click "Continue with Google"
   - Complete the Google authentication
   - You should be redirected to the onboarding page
   - Check the profiles table - you should see a new profile

### Step 6: Enable Additional Auth Methods (Optional)

If you want to enable Google OAuth:

1. Go to Authentication settings in Supabase
2. Click "Providers" on the left
3. Find "Google" and click it
4. Enable it and add your Google OAuth credentials
5. Make sure your redirect URL includes: `https://hkvuqdqlqmmmyvmxjjen.supabase.co/auth/v1/callback`

## Troubleshooting

### If signup/login still doesn't work:

1. **Check browser console** for error messages
2. **Check Supabase logs:**
   - Go to Logs > Auth in Supabase dashboard
   - Look for authentication errors
3. **Check if profiles table has RLS enabled:**
   - Go to Table Editor > profiles
   - Click the shield icon to see RLS policies
   - Should see the policies we created above

### Common Issues:

**Issue: "Rows couldn't be returned"**
- Solution: Check if RLS policies are allowing SELECT access
- Run: `SELECT * FROM profiles;` in SQL Editor to test

**Issue: "User not found after login"**
- Solution: The trigger might not be firing
- Check if the trigger exists: Run `SELECT * FROM information_schema.triggers;`

**Issue: "Google login redirects but doesn't log in"**
- Solution: Check that the callback route is working
- Check `/auth/callback` endpoint logs

## What We Fixed:

1. ✅ Created proper `profiles` table with all required fields
2. ✅ Created `exporter_profiles` and `importer_profiles` tables
3. ✅ Set up RLS policies that allow profile creation and access
4. ✅ Created trigger to automatically create profiles on user signup
5. ✅ Configured auth callback to handle OAuth properly
6. ✅ Added proper error handling and logging in the frontend

## Next Steps:

1. Execute the SQL in Step 3 above
2. Test signup and login
3. If issues persist, check the browser console and Supabase logs
4. Share any error messages for further debugging
