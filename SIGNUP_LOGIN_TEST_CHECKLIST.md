# Signup & Login Flow - Test Checklist

## BEFORE YOU TEST - IMPORTANT SETUP

You MUST configure email in Supabase first. Choose ONE option:

### Option 1: Disable Email Confirmation (For Testing/Development)
1. Go to Supabase Dashboard → Project Settings → Authentication → Providers
2. Click on **Email** provider
3. Find "Confirm email" toggle
4. Toggle **OFF**
5. Save changes
6. Wait 30 seconds for changes to apply

### Option 2: Keep Email Confirmation Enabled (For Production)
If you want real confirmation emails:
1. Configure SMTP in Supabase
2. See EMAIL_CONFIGURATION_GUIDE.md for detailed steps
3. Test email sending

## TEST CASE 1: Signup with Email/Password (Email Confirmation OFF)

### Steps:
1. Open http://localhost:3000/signup (or your deployed URL)
2. Click "I'm an Exporter" (or Importer)
3. Enter:
   - Email: `testuser@example.com`
   - Password: `TestPassword123`
   - Confirm Password: `TestPassword123`
4. Click "Sign Up with Email"

### Expected Results:
- ✅ No errors shown
- ✅ Redirected to `/onboarding`
- ✅ See role selector with "Exporter" or "Importer"
- ✅ In Supabase: profiles table has new row with email and status='pending'

### If Failed:
- ❌ Error message shown → Read error, check logs
- ❌ Redirected to /login → Email confirmation is enabled, check step 1
- ❌ Profile not in database → Check browser console for errors
- ❌ Can't proceed with onboarding → Try refreshing page

---

## TEST CASE 2: Onboarding After Signup

### Steps (after passing Test Case 1):
1. Already at `/onboarding`
2. You should see role selector
3. Click your role (Exporter or Importer)
4. Fill in the form with test data
5. Click "Complete Setup"

### Expected Results:
- ✅ Profile form submitted without errors
- ✅ Redirected to appropriate dashboard:
  - Exporter → `/dashboard/exporter`
  - Importer → `/dashboard/importer`
- ✅ In Supabase: exporter_profiles or importer_profiles table has new row

---

## TEST CASE 3: Login with Valid Email/Password

### Steps:
1. Log out if already logged in (or open in private window)
2. Go to `/login`
3. Enter:
   - Email: Same email as signup (e.g., `testuser@example.com`)
   - Password: `TestPassword123`
4. Click "Sign In with Email"

### Expected Results:
- ✅ No "Invalid credentials" error
- ✅ Redirected to appropriate dashboard or onboarding
- ✅ User is authenticated

### If Failed:
- ❌ "Invalid credentials" error → Either email/password wrong OR profile deleted
- ❌ Stays on login page → Check console for errors
- ❌ Redirects to onboarding but profile is already complete → Restart browser, clear cookies

---

## TEST CASE 4: Login with Invalid Password

### Steps:
1. Open private window (or log out)
2. Go to `/login`
3. Enter:
   - Email: `testuser@example.com`
   - Password: `WrongPassword`
4. Click "Sign In with Email"

### Expected Results:
- ✅ Shows error: "Invalid credentials"
- ✅ Stays on login page
- ✅ User not authenticated

---

## TEST CASE 5: Signup with Missing Profile (Fallback Test)

### Steps:
1. Go to Supabase SQL Editor
2. Find your test user's profile (from Test Case 1)
3. Delete it from profiles table
4. Go to `/login`
5. Try to log in with the same email/password

### Expected Results:
- ✅ Shows error: "Invalid credentials"
- ✅ Cannot log in (profile validation prevents access)

---

## TEST CASE 6: Email Confirmation Flow (If Enabled)

### Prerequisites:
- Email confirmation is enabled in Supabase
- SMTP is properly configured

### Steps:
1. Open `/signup`
2. Select role
3. Enter new email (e.g., `newuser@example.com`)
4. Click "Sign Up with Email"

### Expected Results:
- ✅ See message: "Account created! Please check your email..."
- ✅ Redirected to `/login`
- ✅ User receives confirmation email with link
4. Click link in email

### Expected Results After Clicking Link:
- ✅ Redirected to `/onboarding`
- ✅ Can see and complete onboarding form
- ✅ Profile exists in database with status='pending'

---

## Debugging Guide

### Problem: "Email confirmation not being sent"
1. Check if you disabled "Confirm email" (it should be OFF for no confirmation)
2. Check if SMTP is configured (for real emails)
3. Check Supabase Email Logs
4. Check spam folder for confirmation email

### Problem: "Can't sign up - keeps failing"
1. Check browser console (F12) for error messages
2. Check Supabase Auth logs for signup events
3. Try different email address
4. Clear browser cookies

### Problem: "Profile not created"
1. Check Supabase profiles table - should have row with your user ID
2. If missing: Check browser console for error
3. Try signup again - fallback logic should create it
4. Check Supabase database logs

### Problem: "Can't log in after signup"
1. Try logging in with correct email/password
2. If "Invalid credentials": profile was deleted or doesn't exist
3. If stays on login page: check console for errors
4. Try signing up again

### Problem: "Always redirects to login"
1. Profile might be deleted
2. User account might be suspended
3. Session might be expired
4. Try signing in again

---

## Quick Reset (If Everything Breaks)

If you need to start fresh:

1. Open Supabase SQL Editor
2. Run:
   ```sql
   -- Delete test user and profile
   DELETE FROM profiles WHERE email = 'testuser@example.com';
   ```
3. Go to Supabase Auth → Users
4. Find and delete the test user
5. Try signup flow again

---

## Success Indicators

You'll know the flow is working when:
- ✅ Can sign up with email/password
- ✅ Profile appears in database immediately
- ✅ Can complete onboarding form
- ✅ Can log in and see dashboard
- ✅ Logged-in users can't see login/signup pages
- ✅ Invalid credentials show error
- ✅ Can switch roles in onboarding

