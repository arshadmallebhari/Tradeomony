'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

export default function OnboardingRouter() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [showRoleSelector, setShowRoleSelector] = useState(false);
    const [userRole, setUserRole] = useState<'exporter' | 'importer' | null>(null);

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
            } else {
                // Show role selector to allow user to choose/confirm their role
                setUserRole(profile?.role || 'importer');
                setShowRoleSelector(true);
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, [router]);

    const handleRoleChange = async (newRole: 'exporter' | 'importer') => {
        setIsLoading(true);
        
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                // Update the user's role if it changed
                if (newRole !== userRole) {
                    await (supabase
                        .from('profiles') as any)
                        .update({ role: newRole })
                        .eq('id', user.id);
                }
            }

            // Redirect to appropriate onboarding page
            if (newRole === 'exporter') {
                router.push('/onboarding/exporter');
            } else {
                router.push('/onboarding/importer');
            }
        } catch (error) {
            console.error('Error changing role:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-secondary-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (showRoleSelector) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                            Choose Your Role
                        </h1>
                        <p className="text-secondary-600">
                            Select whether you want to continue as an exporter or importer
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRoleChange('exporter')}
                            className="cursor-pointer"
                        >
                            <Card className="p-8 text-center border-2 border-transparent hover:border-primary-600 transition-colors">
                                <div className="text-5xl mb-4">📦</div>
                                <h2 className="text-2xl font-bold text-secondary-900 mb-3">
                                    Exporter
                                </h2>
                                <p className="text-secondary-600 mb-6">
                                    Showcase your products and connect with importers worldwide
                                </p>
                                <Button 
                                    variant="primary" 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    Continue as Exporter
                                </Button>
                            </Card>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRoleChange('importer')}
                            className="cursor-pointer"
                        >
                            <Card className="p-8 text-center border-2 border-transparent hover:border-primary-600 transition-colors">
                                <div className="text-5xl mb-4">🌍</div>
                                <h2 className="text-2xl font-bold text-secondary-900 mb-3">
                                    Importer
                                </h2>
                                <p className="text-secondary-600 mb-6">
                                    Find quality products from trusted exporters
                                </p>
                                <Button 
                                    variant="primary" 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    Continue as Importer
                                </Button>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="spinner"></div>
        </div>
    );
}
