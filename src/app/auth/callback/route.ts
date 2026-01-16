import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const roleParam = requestUrl.searchParams.get('role');
    const redirectUrl = new URL('/onboarding', requestUrl.origin);

    if (code) {
        const supabase = await createClient();
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        
        if (!error && data.user) {
            // Check if profile exists, create if needed for OAuth users
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', data.user.id)
                .single();

            if (!existingProfile) {
                // Determine role: use URL param if provided, fall back to metadata, default to 'importer'
                const userRole = (roleParam || data.user.user_metadata?.role || 'importer') as 'exporter' | 'importer' | 'admin';
                
                // Create profile for OAuth users
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email || '',
                        role: userRole,
                    });
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
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(redirectUrl);
}
