'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Database } from '@/types/database';

type InquiryWithRelations = Database['public']['Tables']['inquiries']['Row'] & {
    product: Pick<Database['public']['Tables']['products']['Row'], 'title' | 'images' | 'price' | 'currency'> | null;
    exporter: Pick<Database['public']['Tables']['exporter_profiles']['Row'], 'company_name'> | null;
};

export default function ImporterInquiriesPage() {
    const [inquiries, setInquiries] = useState<InquiryWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInquiries = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('inquiries')
                    .select(`
                        *,
                        product:products (title, images, price, currency),
                        exporter:exporter_profiles (company_name)
                    `)
                    .eq('importer_id', user.id)
                    .order('created_at', { ascending: false })
                    .returns<InquiryWithRelations[]>();

                if (error) throw error;
                setInquiries(data || []);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInquiries();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading inquiries...</div>;

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/importer" className="text-secondary-500 hover:text-secondary-900">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-secondary-900">My Inquiries</h1>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {inquiries.map((inquiry) => (
                                <tr key={inquiry.id} className="hover:bg-secondary-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-secondary-900">
                                            {inquiry.product?.title || 'Unknown Product'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-secondary-600">
                                        {inquiry.exporter?.company_name || 'Unknown Supplier'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-secondary-500 max-w-xs truncate">
                                            {inquiry.message}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            inquiry.status === 'new' ? 'primary' :
                                                inquiry.status === 'in_progress' ? 'warning' :
                                                    'secondary'
                                        }>
                                            {inquiry.status.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary-500">
                                        {new Date(inquiry.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {inquiries.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-12 h-12 text-secondary-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <p className="text-lg font-medium text-secondary-900">No inquiries sent yet</p>
                                            <p className="text-secondary-500 mb-4">Start browsing products to contact suppliers.</p>
                                            <Link href="/products">
                                                <Button size="sm">Browse Products</Button>
                                            </Link>
                                        </div>
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
