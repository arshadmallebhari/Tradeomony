import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const roleParam = requestUrl.searchParams.get('role');
    const redirectUrl = new URL('/onboarding', requestUrl.origin);

    try {
        if (code) {
            const supabase = await createClient();
            const { error, data } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('Auth callback error:', error);
                // Still redirect even on error, let the client handle it
                return NextResponse.redirect(redirectUrl);
            }

            if (!data.user) {
                console.error('No user data in callback');
                return NextResponse.redirect(redirectUrl);
            }

            // Check if profile exists, create if needed for OAuth users
            const { data: existingProfile, error: selectError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            if (!existingProfile) {
                // Determine role: use URL param if provided, fall back to metadata, default to 'importer'
                const userRole = (roleParam || data.user.user_metadata?.role || 'importer') as 'exporter' | 'importer' | 'admin';
                
                // Create profile for OAuth users
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { error: insertError } = await (supabase as any)
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email || '',
                        role: userRole,
                    });

                if (insertError) {
                    console.error('Failed to create profile:', insertError);
                }
            } else if (roleParam) {
                // Update role if it was passed as URL parameter
                const userRole = roleParam as 'exporter' | 'importer' | 'admin';
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                    .from('profiles')
                    .update({ role: userRole })
                    .eq('id', data.user.id);
            }
        }
    } catch (error) {
        console.error('Unexpected error in auth callback:', error);
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(redirectUrl);
}
