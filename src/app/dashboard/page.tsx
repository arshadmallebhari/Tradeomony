import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user profile to get role
    const { data } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', user.id)
        .single();

    const profile = data as { role: string; onboarding_completed: boolean } | null;

    if (!profile?.onboarding_completed) {
        redirect('/onboarding');
    } else if (profile?.role === 'exporter') {
        redirect('/dashboard/exporter');
    } else if (profile?.role === 'importer') {
        redirect('/dashboard/importer');
    } else if (profile?.role === 'admin') {
        redirect('/admin/dashboard');
    } else {
        // Fallback
        redirect('/');
    }
}
