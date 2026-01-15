'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function ImporterDashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900">Importer Dashboard</h1>
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Saved Products</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">5</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Sent Inquiries</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">8</p>
                </Card>
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-secondary-900">Active Chats</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">3</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Recent Inquiries</h2>
                    <Card className="p-6">
                        <p className="text-secondary-600 text-center py-8">No active inquiries.</p>
                    </Card>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                    <Link href="/products" className="block">
                        <Card hover className="p-6 text-center border-dashed border-2 border-secondary-200">
                            <span className="text-primary-600 font-medium">Browse Categories</span>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
