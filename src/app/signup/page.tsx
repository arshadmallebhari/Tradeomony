'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import Card from '@/components/ui/Card';

type UserRole = 'exporter' | 'importer';

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<'role' | 'credentials'>('role');
    const [role, setRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                    // User is logged in, redirect to dashboard
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data: profileData } = await (supabase as any)
                        .from('profiles')
                        .select('role, onboarding_completed')
                        .eq('id', user.id)
                        .maybeSingle();

                    const profile = profileData as { role: string; onboarding_completed: boolean } | null;

                    if (profile?.role === 'admin') {
                        router.push('/admin/dashboard');
                    } else if (!profile?.onboarding_completed) {
                        router.push('/onboarding');
                    } else if (profile?.role === 'exporter') {
                        router.push('/dashboard/exporter');
                    } else {
                        router.push('/dashboard/importer');
                    }
                }
            } catch (err) {
                console.error('Auth check error:', err);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleRoleSelect = (selectedRole: UserRole) => {
        setRole(selectedRole);
        setStep('credentials');
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            console.log('Starting email signup with role:', role);
            
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: role,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Signup error:', error);
                throw error;
            }

            console.log('Signup successful:', data.user?.id);
            
            // Wait for trigger to create profile
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to onboarding
            router.push('/onboarding');
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (!role) return;

        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?role=${role}`,
                },
            });

            if (error) throw error;
        } catch (error: any) {
            setError(error.message || 'Failed to sign up with Google');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            {isCheckingAuth ? (
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="mt-4 text-secondary-600">Loading...</p>
                </div>
            ) : (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">

                        <Logo className="h-12 w-auto" />
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-secondary-600">
                        {step === 'role' ? 'Choose your role to get started' : 'Enter your credentials'}
                    </p>
                </div>

                {/* Role Selection */}
                {step === 'role' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                hover
                                className="p-8 cursor-pointer h-full"
                                onClick={() => handleRoleSelect('exporter')}
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-3">
                                        I&apos;m an Exporter
                                    </h3>
                                    <p className="text-secondary-600 mb-6">
                                        Showcase your products to global buyers and grow your export business
                                    </p>
                                    <ul className="text-left space-y-2 text-sm text-secondary-700">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            List unlimited products
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Receive buyer inquiries
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Get verified badge
                                        </li>
                                    </ul>
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                hover
                                className="p-8 cursor-pointer h-full"
                                onClick={() => handleRoleSelect('importer')}
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold text-secondary-900 mb-3">
                                        I&apos;m an Importer
                                    </h3>
                                    <p className="text-secondary-600 mb-6">
                                        Find verified suppliers and source quality products from India
                                    </p>
                                    <ul className="text-left space-y-2 text-sm text-secondary-700">
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Browse thousands of products
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Contact verified exporters
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Save favorite products
                                        </li>
                                    </ul>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                )}

                {/* Credentials Form */}
                {step === 'credentials' && (
                    <Card className="p-8 max-w-md mx-auto">
                        <button
                            onClick={() => setStep('role')}
                            className="flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-6"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Change role
                        </button>

                        <div className="mb-6 p-3 bg-primary-50 rounded-lg">
                            <p className="text-sm text-primary-800">
                                Creating account as: <strong className="capitalize">{role}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleEmailSignup} className="space-y-6">
                            {error && (
                                <div className="alert-danger">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            )}

                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                            />

                            <Input
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                helperText="At least 6 characters"
                                required
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />

                            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                                Create Account
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-secondary-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-secondary-500">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>

                        <p className="mt-6 text-center text-sm text-secondary-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </Card>
                )}
            </motion.div>
            )}
        </div>
    );
}
