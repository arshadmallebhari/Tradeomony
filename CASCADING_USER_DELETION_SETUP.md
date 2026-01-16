# How to Set Up Cascading User Deletion

When you delete a user from Supabase Auth, all their data will be automatically deleted from:
- ✅ `profiles` table
- ✅ `exporter_profiles` table  
- ✅ `importer_profiles` table

## Steps to Apply This

### Option 1: Automatic (Recommended for Future Projects)
The migration file is already created: `supabase/migrations/005_cascade_user_deletion.sql`

When you deploy to production with Supabase CLI, it will run automatically.

### Option 2: Manual Setup (Do This Now)

1. **Open Supabase Dashboard** → Your Project
2. **Click "SQL Editor"** in left sidebar
3. **Click "New Query"**
4. **Copy and paste this SQL:**

```sql
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
```

5. **Click "Run"**
6. **Done!** ✅

## How It Works

When you delete a user from Supabase Auth:

```
Delete User → Trigger Fires → Delete from importer_profiles 
           → Delete from exporter_profiles 
           → Delete from profiles 
           → User deleted
```

All happens automatically in seconds!

## Test It

1. Go to Supabase Dashboard
2. **Authentication** → **Users**
3. Find a test user
4. Click the **3 dots menu** → **Delete user**
5. Check:
   - `profiles` table - row should be gone ✅
   - `exporter_profiles` or `importer_profiles` - row should be gone ✅
   - All other data automatically cleaned up ✅

## Why This Matters

- **Data Integrity**: No orphaned records left behind
- **Clean Database**: No manual cleanup needed
- **Security**: Old user data completely removed
- **Automatic**: Happens instantly when user is deleted
