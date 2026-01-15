'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function ExporterDashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900">Exporter Dashboard</h1>
                <div className="flex gap-4">
                    <Link href="/dashboard/exporter/products/new">
                        <Button variant="primary">Add New Product</Button>
                    </Link>
                    <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Total Products</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">12</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">48</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Profile Views</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">1,204</p>
                </Card>
            </div>

            <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
            <Card className="p-6">
                <p className="text-secondary-600 text-center py-8">No inquiries yet.</p>
            </Card>
        </div>
    );
}
