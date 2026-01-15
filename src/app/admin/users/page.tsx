'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await (supabase
                .from('profiles') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading users...</div>;

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/dashboard" className="text-secondary-500 hover:text-secondary-900">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-secondary-900">All Users</h1>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">User ID</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Onboarding</th>
                                <th className="px-6 py-4">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-secondary-500">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'exporter' ? 'primary' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.onboarding_completed ? (
                                            <span className="text-success-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="text-secondary-400">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-secondary-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
