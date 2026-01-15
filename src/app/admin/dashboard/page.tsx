'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        users: 0,
        exporters: 0,
        pending: 0,
        products: 0 // Replaced "Reported Items" with Products count for now
    });
    const [pendingProfiles, setPendingProfiles] = useState<any[]>([]);

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
                supabase.from('exporter_profiles').select('*', { count: 'exact', head: true }).eq('verified', false), // Assuming false/null means pending or unverified
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('exporter_profiles').select('*').eq('verified', false).limit(5)
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
                <Link href="/admin/users" className="block transition-transform hover:-translate-y-1">
                    <Card className="p-6 border-l-4 border-primary-600 h-full cursor-pointer hover:shadow-md">
                        <h3 className="text-sm font-medium text-secondary-500">Total Users</h3>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.users}</p>
                    </Card>
                </Link>
                <Link href="/admin/exporters" className="block transition-transform hover:-translate-y-1">
                    <Card className="p-6 border-l-4 border-success-600 h-full cursor-pointer hover:shadow-md">
                        <h3 className="text-sm font-medium text-secondary-500">Verified Exporters</h3>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.exporters}</p>
                    </Card>
                </Link>
                <Link href="/admin/verification" className="block transition-transform hover:-translate-y-1">
                    <Card className="p-6 border-l-4 border-accent-600 h-full cursor-pointer hover:shadow-md">
                        <h3 className="text-sm font-medium text-secondary-500">Pending Verifications</h3>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.pending}</p>
                    </Card>
                </Link>
                <Link href="/admin/products" className="block transition-transform hover:-translate-y-1">
                    <Card className="p-6 border-l-4 border-danger-600 h-full cursor-pointer hover:shadow-md">
                        <h3 className="text-sm font-medium text-secondary-500">Active Products</h3>
                        <p className="text-2xl font-bold text-secondary-900 mt-1">{stats.products}</p>
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
