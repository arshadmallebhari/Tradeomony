'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function AdminDashboard() {
    const [, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        users: 0,
        exporters: 0,
        pending: 0,
        products: 0 // Replaced "Reported Items" with Products count for now
    });
    const [pendingProfiles, setPendingProfiles] = useState<Database['public']['Tables']['exporter_profiles']['Row'][]>([]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));

        const fetchDashboardData = async () => {
            // Parallel fetch for stats
            const [
                { count: userCount },
                { count: exporterCount },
                { count: pendingCount },
                { count: productCount },
                { data: pendingData }
            ] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('exporter_profiles').select('*', { count: 'exact', head: true }).eq('verified', true),
                supabase.from('exporter_profiles').select('*', { count: 'exact', head: true }).eq('verified', false),
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('exporter_profiles').select('*').eq('verified', false).limit(5).returns<Database['public']['Tables']['exporter_profiles']['Row'][]>()
            ]);

            setStats({
                users: userCount || 0,
                exporters: exporterCount || 0,
                pending: pendingCount || 0,
                products: productCount || 0
            });

            setPendingProfiles(pendingData || []);
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900">Admin Dashboard</h1>
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <Link href="/admin/users" className="block group">
                    <Card className="p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg group-hover:border-primary-200 border border-transparent">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-1">Total Users</h3>
                                <p className="text-3xl font-display font-bold text-secondary-900">{stats.users}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </Link>

                {/* Verified Exporters */}
                <Link href="/admin/exporters" className="block group">
                    <Card className="p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg group-hover:border-success-200 border border-transparent">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-1">Verified Exporters</h3>
                                <p className="text-3xl font-display font-bold text-secondary-900">{stats.exporters}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center text-success-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </Link>

                {/* Pending Verifications */}
                <Link href="/admin/verification" className="block group">
                    <Card className="p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg group-hover:border-accent-200 border border-transparent">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-1">Pending Requests</h3>
                                <p className="text-3xl font-display font-bold text-secondary-900">{stats.pending}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </Link>

                {/* Active Products */}
                <Link href="/admin/products" className="block group">
                    <Card className="p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg group-hover:border-blue-200 border border-transparent">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-secondary-500 mb-1">Active Products</h3>
                                <p className="text-3xl font-display font-bold text-secondary-900">{stats.products}</p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            <h2 className="text-xl font-semibold mb-4">Pending Verifications</h2>
            <Card className="p-0 overflow-hidden">
                {pendingProfiles.length > 0 ? (
                    <table className="w-full text-left bg-white">
                        <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Country</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {pendingProfiles.map((profile) => (
                                <tr key={profile.id}>
                                    <td className="px-6 py-4 font-medium text-secondary-900">{profile.company_name}</td>
                                    <td className="px-6 py-4">{profile.country}</td>
                                    <td className="px-6 py-4"><span className="badge-warning">Pending</span></td>
                                    <td className="px-6 py-4">
                                        <Link href={`/exporters/${profile.id}`}>
                                            <Button size="sm" variant="outline">Review</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-secondary-500">
                        <p>No pending verifications found.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
