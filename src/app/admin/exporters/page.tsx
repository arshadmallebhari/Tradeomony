'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminExportersPage() {
    const [exporters, setExporters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExporters();
    }, []);

    const fetchExporters = async () => {
        try {
            const { data, error } = await (supabase
                .from('exporter_profiles') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExporters(data || []);
        } catch (error) {
            console.error('Error fetching exporters:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading exporters...</div>;

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/dashboard" className="text-secondary-500 hover:text-secondary-900">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-secondary-900">Exporters</h1>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Products</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {exporters.map((exporter) => (
                                <tr key={exporter.id} className="hover:bg-secondary-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-secondary-900">{exporter.company_name}</div>
                                        <div className="text-xs text-secondary-500 font-mono">{exporter.user_id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary-600">
                                        {exporter.city}, {exporter.country}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-secondary-600 max-w-xs truncate">
                                            {exporter.products?.join(', ') || 'None'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {exporter.verified ? (
                                            <Badge variant="success">Verified</Badge>
                                        ) : (
                                            <Badge variant="warning">Pending</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/exporter/${exporter.id}`}>
                                            <Button size="sm" variant="outline">View Profile</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {exporters.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-secondary-500">
                                        No exporters found.
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
