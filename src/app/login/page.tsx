'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Database } from '@/types/database';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [hasRedirected, setHasRedirected] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                console.log('Checking authentication status...');
                const { data: { session } } = await supabase.auth.getSession();
                
                if (session?.user && !hasRedirected) {
                    console.log('User already logged in:', session.user.id);
                    setHasRedirected(true);
                    
                    // User is logged in, check their profile and redirect
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data: profileData, error: profileError } = await (supabase as any)
                        .from('profiles')
                        .select('role, onboarding_completed')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    console.log('Profile data:', profileData);

                    if (profileError) {
                        console.error('Profile fetch error:', profileError);
                    }

                    if (isMounted) {
                        const profile = profileData as { role: string; onboarding_completed: boolean } | null;

                        let redirectPath = '/dashboard/importer';
                        if (profile?.role === 'admin') {
                            console.log('Redirecting to admin dashboard');
                            redirectPath = '/admin/dashboard';
                        } else if (!profile?.onboarding_completed) {
                            console.log('Redirecting to onboarding');
                            redirectPath = '/onboarding';
                        } else if (profile?.role === 'exporter') {
                            console.log('Redirecting to exporter dashboard');
                            redirectPath = '/dashboard/exporter';
                        } else {
                            console.log('Redirecting to importer dashboard');
                        }
                        
                        console.log('User already authenticated, redirecting to:', redirectPath);
                        window.location.href = redirectPath;
                    }
                    return;
                }
                
                console.log('No session found, showing login form');
            } catch (err) {
                console.error('Auth check error:', err);
            } finally {
                if (isMounted) {
                    setIsCheckingAuth(false);
                }
            }
        };

        checkAuth();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [hasRedirected]);
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasRedirected) return; // Prevent multiple submissions
        
        setIsLoading(true);
        setError('');

        try {
            console.log('Starting email login...');
            
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                console.error('Auth error:', authError);
                throw authError;
            }

            if (!authData.user) {
                throw new Error('No user returned from authentication');
            }

            console.log('User authenticated:', authData.user.id);

            // Wait a moment for profile to be created by trigger
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Try to fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('role, onboarding_completed')
                .eq('id', authData.user.id)
                .maybeSingle();

            console.log('Profile data:', profileData, 'Error:', profileError);

            // If profile doesn't exist, this is invalid - reject login
            if (!profileData) {
                console.log('Profile not found for authenticated user - rejecting login');
                // Sign out the user
                await supabase.auth.signOut();
                throw new Error('Invalid credentials');
            }

            // Profile exists, determine redirect path
            const profile = profileData as { role: string; onboarding_completed: boolean } | null;
            let redirectPath = '/dashboard/importer'; // default

            if (profile?.role === 'admin') {
                console.log('Admin user - redirecting to admin dashboard');
                redirectPath = '/admin/dashboard';
            } else if (!profile?.onboarding_completed) {
                console.log('User not onboarded - redirecting to onboarding');
                redirectPath = '/onboarding';
            } else if (profile?.role === 'exporter') {
                console.log('Exporter user - redirecting to exporter dashboard');
                redirectPath = '/dashboard/exporter';
            } else {
                console.log('Importer user - redirecting to importer dashboard');
            }

            console.log('Login successful, redirecting to:', redirectPath);
            setHasRedirected(true);
            
            // Use window.location for hard redirect to ensure navigation happens
            window.location.href = redirectPath;
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login. Please try again.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                console.error('Google OAuth error:', error);
                throw error;
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Failed to login with Google');
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
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">

                        <Logo className="h-12 w-auto" />
                    </Link>
                    <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-secondary-600">
                        Sign in to your account to continue
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleEmailLogin} className="space-y-6">
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
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="checkbox" />
                                <span className="text-secondary-700">Remember me</span>
                            </label>
                            <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                            Sign In
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
                        onClick={handleGoogleLogin}
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
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </Card>

                {/* Admin Login Link */}
                <div className="mt-4 text-center">
                    <Link href="/admin/login" className="text-sm text-secondary-500 hover:text-secondary-700">
                        Admin Login →
                    </Link>
                </div>
            </motion.div>
            )}
        </div>
    );
}
