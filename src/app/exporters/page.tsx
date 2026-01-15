'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function ExportersPage() {
    const [exporters, setExporters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExporters = async () => {
            try {
                // Fetch exporter profiles joined with profiles to filter by active status if needed
                // For now, simpler query on exporter_profiles
                const { data, error } = await supabase
                    .from('exporter_profiles')
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

        fetchExporters();
    }, []);

    if (loading) {
        return (
            <div className="container-custom py-12 text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-secondary-200 rounded mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="h-64 bg-secondary-100 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (exporters.length === 0) {
        return (
            <div className="container-custom py-12 text-center">
                <h1 className="text-3xl font-display font-bold text-secondary-900 mb-4">All Exporters</h1>
                <div className="bg-secondary-50 rounded-xl p-12">
                    <p className="text-xl text-secondary-600">No exporters found at the moment.</p>
                    <p className="text-secondary-500 mt-2">Check back later or register as an exporter!</p>
                    <Link href="/auth/signup?role=exporter" className="btn-primary mt-6 inline-block">
                        Join as Exporter
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container-custom py-12">
            <h1 className="text-3xl font-display font-bold text-secondary-900 mb-8">All Exporters</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {exporters.map((exporter, index) => (
                    <div key={exporter.id}>
                        <Card hover className="h-full">
                            <div className="p-6 h-full flex flex-col">
                                {/* Icon/Image - using placeholder if no image */}
                                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center text-4xl mb-4 self-start">
                                    {/* Try to show first product image or generic icon */}
                                    {exporter.product_images?.[0] ? (
                                        <img src={exporter.product_images[0]} alt={exporter.company_name} className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        '🏭'
                                    )}
                                </div>

                                {/* Verified Badge */}
                                {exporter.verified && (
                                    <Badge variant="success" size="sm" className="mb-3 self-start">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </Badge>
                                )}

                                {/* Company Name */}
                                <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                                    {exporter.company_name}
                                </h3>

                                {/* Location */}
                                <p className="text-sm text-primary-600 font-medium mb-2">
                                    {exporter.city}, {exporter.country}
                                </p>

                                {/* Description */}
                                <p className="text-sm text-secondary-600 mb-4 line-clamp-2 flex-grow">
                                    {exporter.description || 'No description provided.'}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 mb-4 text-sm text-secondary-500 mt-auto">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">MOQ:</span> {exporter.moq} {exporter.moq_unit}
                                    </div>
                                </div>

                                {/* CTA */}
                                <Link
                                    // Use exporter.id or exporter.user_id depending on how the dynamic route is set up. 
                                    // Usually it's by ID.
                                    href={`/exporters/${exporter.id}`}
                                    className="mt-4 w-full btn-outline text-sm py-2 text-center"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
