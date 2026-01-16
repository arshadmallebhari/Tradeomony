# Email Configuration Guide for Signup

## Issue: Email Confirmation Not Being Sent

If users can sign up but don't receive email confirmation emails, it's because Supabase has "Confirm email" enabled but no SMTP provider is configured.

## Solutions

### Option 1: Disable Email Confirmation (DEV ONLY - Quickest)

Go to **Supabase Dashboard → Authentication → Providers**

1. Click on the **Email** provider
2. Find the setting "Confirm email"
3. **Toggle it OFF** to allow immediate login without email verification
4. Save changes

**Result**: Users can sign up and log in immediately without waiting for email confirmation.

### Option 2: Enable Email Confirmation with SMTP (PRODUCTION)

For production, you should send real confirmation emails. Configure SMTP in Supabase:

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Scroll to **Email Settings**
3. In the "SMTP Admin Settings" section, toggle ON "Use custom SMTP"
4. Configure your SMTP settings:
   - Host: Your email provider's SMTP host (e.g., `smtp.gmail.com`)
   - Port: Usually 587 (TLS) or 465 (SSL)
   - Username: Your email account
   - Password: Your app password or SMTP password
   - Sender Email: The "from" address for emails (e.g., `noreply@tradeomony.com`)
5. Save changes

6. Test by sending a test email through the Supabase dashboard

## Expected Behavior After Configuration

### With Email Confirmation Disabled:
1. User signs up with email/password
2. Profile is created immediately
3. User can log in immediately
4. Redirects to onboarding

### With Email Confirmation Enabled:
1. User signs up with email/password
2. Confirmation email sent to user's email
3. User clicks link in email
4. Redirects to `/auth/callback` → `/onboarding`
5. Profile is created if not already created

## Signup Flow Fixes Implemented

The following fixes have been made to handle both scenarios:

1. **Profile Creation Guarantee**: Even if the database trigger fails, the signup page manually creates the profile
2. **Email Session Check**: Code checks if `authData.session` exists to detect email confirmation requirement
3. **Proper Redirects**: 
   - If email confirmation required: redirect to `/login` with message
   - If confirmed or disabled: redirect to `/onboarding`
4. **Error Handling**: Comprehensive error logging to debug issues

## Current Status

- ✅ Email/password signup implemented
- ✅ Profile creation with fallback
- ✅ Role selection during signup
- ✅ OAuth (Google) integration ready
- ⚠️ Email confirmation: **MUST CONFIGURE** in Supabase

## Next Steps

1. Decide on email confirmation preference:
   - Development: Disable confirmation for faster testing
   - Production: Enable SMTP for real confirmation emails

2. Update the setting in Supabase dashboard

3. Test signup flow:
   - Try signing up with new email
   - Verify profile is created
   - Verify appropriate redirect happens

4. If issues persist, check Supabase logs:
   - Auth → Users section to see signup records
   - Database → profiles table to verify profile creation
