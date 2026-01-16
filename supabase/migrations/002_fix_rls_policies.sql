-- Fix RLS policies for profiles table to allow profile creation and querying

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "System can create profiles for new users" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Allow the system to insert profiles (for new user signup)
CREATE POLICY "System can create profiles for new users"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow admins to view all profiles (if needed)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'authenticated' 
    AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
