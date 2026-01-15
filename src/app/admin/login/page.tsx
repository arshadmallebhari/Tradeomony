'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Check if user is admin
            const { data: profile, error: profileError } = await (supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single() as any);

            if (profileError) {
                throw new Error('Failed to verify admin status');
            }

            if (profile?.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error('Unauthorized: Admin access only');
            }

            // Use hard redirect to ensure cookies are fresh
            window.location.href = '/admin/dashboard';
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-danger-600 to-danger-700 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-secondary-300">
                        Authorized personnel only
                    </p>
                </div>

                <Card className="p-8 bg-white/95 backdrop-blur-sm">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="alert-danger">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <Input
                            label="Admin Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@tradeomony.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />

                        <Button type="submit" variant="primary" className="w-full bg-danger-600 hover:bg-danger-700" isLoading={isLoading}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Sign In as Admin
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-secondary-600">
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            ← Back to regular login
                        </Link>
                    </p>
                </Card>

                <div className="mt-6 text-center">
                    <p className="text-xs text-secondary-400">
                        This area is restricted to authorized administrators only.
                        <br />
                        All access attempts are logged and monitored.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
