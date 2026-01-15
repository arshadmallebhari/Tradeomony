'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function OnboardingRouter() {
    const router = useRouter();

    useEffect(() => {
        const checkUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await (supabase
                .from('profiles') as any)
                .select('role, onboarding_completed')
                .eq('id', user.id)
                .single();

            if (profile?.onboarding_completed) {
                // Already completed, redirect to dashboard
                if (profile.role === 'exporter') {
                    router.push('/dashboard/exporter');
                } else {
                    router.push('/dashboard/importer');
                }
            } else if (profile?.role === 'exporter') {
                router.push('/onboarding/exporter');
            } else {
                router.push('/onboarding/importer');
            }
        };

        checkUserRole();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="spinner"></div>
        </div>
    );
}
