'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function ImporterDashboard() {
    const [stats, setStats] = useState<{
        inquiries: number;
        saved: number;
        chats: number;
    }>({
        inquiries: 0,
        saved: 0,
        chats: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch inquiries count
                const { count: inquiriesCount, error: inquiriesError } = await supabase
                    .from('inquiries')
                    .select('*', { count: 'exact', head: true })
                    .eq('importer_id', user.id);

                if (!inquiriesError) {
                    setStats(prev => ({ ...prev, inquiries: inquiriesCount || 0 }));
                }

                // Placeholder for saved/chats as they don't have tables yet
                // setStats(prev => ({ ...prev, saved: 0, chats: 0 }));

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="container-custom py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900">Importer Dashboard</h1>
                <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/dashboard/importer/favorites">
                    <Card hover className="p-6 cursor-pointer h-full">
                        <h3 className="text-lg font-semibold text-secondary-900">Saved Products</h3>
                        <p className="text-3xl font-bold text-primary-600 mt-2">{stats.saved}</p>
                    </Card>
                </Link>
                <Link href="/dashboard/importer/inquiries">
                    <Card hover className="p-6 cursor-pointer h-full">
                        <h3 className="text-lg font-semibold text-secondary-900">Sent Inquiries</h3>
                        <p className="text-3xl font-bold text-primary-600 mt-2">{stats.inquiries}</p>
                    </Card>
                </Link>
                <div className="opacity-50 pointer-events-none">
                    <Card className="p-6 h-full">
                        <h3 className="text-lg font-semibold text-secondary-900">Active Chats</h3>
                        <p className="text-3xl font-bold text-secondary-400 mt-2">0</p>
                        <p className="text-xs text-secondary-500 mt-1">Coming Soon</p>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Inquiries</h2>
                        <Link href="/dashboard/importer/inquiries" className="text-primary-600 text-sm hover:underline">
                            View All
                        </Link>
                    </div>
                    <Card className="p-6">
                        {stats.inquiries === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-secondary-500 mb-4">No active inquiries.</p>
                                <Link href="/products">
                                    <Button size="sm" variant="outline">Browse Products</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-secondary-600">You have {stats.inquiries} sent inquiries.</p>
                                <Link href="/dashboard/importer/inquiries" className="text-primary-600 font-medium mt-2 inline-block">
                                    View Details →
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
                    <Link href="/products" className="block">
                        <Card hover className="p-6 text-center border-dashed border-2 border-secondary-200 h-full flex items-center justify-center">
                            <div>
                                <span className="text-4xl block mb-2">🔍</span>
                                <span className="text-primary-600 font-medium">Browse Categories</span>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
}
