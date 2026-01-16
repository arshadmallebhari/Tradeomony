-- Delete all related data when a user is deleted from auth.users
-- This ensures referential integrity and cascading deletes

-- Function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deleted()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from importer_profiles first (references profiles)
  DELETE FROM public.importer_profiles WHERE user_id = OLD.id;
  
  -- Delete from exporter_profiles (references profiles)
  DELETE FROM public.exporter_profiles WHERE user_id = OLD.id;
  
  -- Delete from profiles (references auth.users)
  DELETE FROM public.profiles WHERE id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;

-- Create trigger that fires BEFORE user is deleted
CREATE TRIGGER on_auth_user_deleted
  BEFORE DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deleted();

-- Alternative: If BEFORE DELETE doesn't work, use AFTER DELETE
-- DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
-- CREATE TRIGGER on_auth_user_deleted
--   AFTER DELETE ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_user_deleted();
