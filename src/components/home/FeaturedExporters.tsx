'use client';

import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function FeaturedExporters() {
    const [exporters, setExporters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedExporters = async () => {
            try {
                // Fetch latest 4 exporters as "featured" for now
                // Optimize: Select only necessary columns
                const { data, error } = await supabase
                    .from('exporter_profiles')
                    .select('id, company_name, city, country, product_images, description, verified')
                    .eq('verified', true) // Only show verified as featured
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;
                setExporters(data || []);
            } catch (error) {
                console.error('Error fetching featured exporters:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedExporters();
    }, []);

    // Even if empty, we render the section to avoid layout shifts or missing "View All" link
    // But we can show a message "No featured exporters" if empty

    return (
        <section className="section bg-secondary-50">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                        Featured Exporters
                    </h2>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                        Connect with verified suppliers trusted by businesses worldwide
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-96 bg-secondary-200 animate-pulse rounded-xl"></div>
                        ))}
                    </div>
                ) : exporters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {exporters.map((exporter, index) => (
                            <motion.div
                                key={exporter.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card hover className="h-full">
                                    <div className="p-6 h-full flex flex-col">
                                        {/* Icon/Image */}
                                        <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden bg-secondary-100 flex items-center justify-center text-4xl">
                                            {exporter.product_images?.[0] ? (
                                                <Image
                                                    src={exporter.product_images[0]}
                                                    alt={exporter.company_name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                />
                                            ) : (
                                                '🏭'
                                            )}
                                        </div>

                                        {/* Verified Badge */}
                                        <Badge variant="success" size="sm" className="mb-3 self-start">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </Badge>

                                        {/* Company Name */}
                                        <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                                            {exporter.company_name}
                                        </h3>

                                        {/* Category - Not available in current schema directly without join, using City/Country instead or generic label */}
                                        <p className="text-sm text-primary-600 font-medium mb-2">
                                            {exporter.city}, {exporter.country}
                                        </p>

                                        {/* Description */}
                                        <p className="text-sm text-secondary-600 mb-4 line-clamp-2 flex-grow">
                                            {exporter.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4 text-sm text-secondary-500 mt-auto">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {exporter.city}
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <Link
                                            href={`/exporters/${exporter.id}`}
                                            className="mt-4 w-full btn-outline text-sm py-2 text-center"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-secondary-500 py-12 bg-white rounded-lg border border-secondary-200">
                        <p>No featured exporters at the moment.</p>
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/exporters"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        View All Exporters
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
