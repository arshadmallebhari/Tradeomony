import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const metadata = {
    title: 'Global Marketplace | Tradeomony',
    description: 'Explore verified exporters and products from around the world.',
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: { category?: string; query?: string };
}) {
    const supabase = await createClient();

    // Fetch all products/exporter_profiles as our current "listing"
    // In a real app, products would be a separate table, but for now we list the exporter's product summary
    // Limit to 20 for initial load performance
    // Also selecting only needed columns to reduce payload
    let query = (supabase
        .from('exporter_profiles')
        .select(`
            id,
            company_name,
            city,
            country,
            products,
            verified,
            moq,
            moq_unit,
            profiles:user_id (status)
        `)
        .limit(20) as any);

    if (searchParams.category) {
        // Simple filter based on products array containing the string
        // Note: This is a placeholder logic for categories
        query = query.contains('products', [searchParams.category]);
    }

    const { data: exporters } = await query;

    return (
        <div className="bg-secondary-50 min-h-screen pb-24">
            <div className="container-custom py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                            Global <span className="text-primary-600">Marketplace</span>
                        </h1>
                        <p className="text-secondary-600">
                            Discover {exporters?.length || 0} verified trade partners.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Placeholder for Filters */}
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-secondary-200 text-sm">
                            <span className="text-secondary-500 font-medium">Sort By:</span>
                            <select className="bg-transparent outline-none font-bold text-secondary-900">
                                <option>Most Recent</option>
                                <option>Verified First</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {exporters?.map((exporter: any) => (
                        <Link key={exporter.id} href={`/exporter/${exporter.id}`}>
                            <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300">
                                {/* Exporter Header */}
                                <div className="p-6 border-b border-secondary-50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center text-2xl font-bold text-secondary-400">
                                            {exporter.company_name[0]}
                                        </div>
                                        {exporter.verified && (
                                            <Badge variant="success" className="bg-success-100/50 text-success-700 backdrop-blur-sm">
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                        {exporter.company_name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-secondary-500 text-sm mt-1">
                                        <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        {exporter.city}, {exporter.country}
                                    </div>
                                </div>

                                {/* Product Summary */}
                                <div className="p-6 flex-1">
                                    <div className="text-xs font-bold text-secondary-400 uppercase tracking-wider mb-3">
                                        Primary Products
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {exporter.products.slice(0, 3).map((product: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-secondary-100 rounded-full text-xs font-medium text-secondary-700"
                                            >
                                                {product}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between text-sm py-4 border-t border-secondary-50">
                                        <span className="text-secondary-500 font-medium">Min Order:</span>
                                        <span className="font-bold text-secondary-900">{exporter.moq} {exporter.moq_unit}</span>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <button className="btn-primary w-full group-hover:bg-primary-700 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {(!exporters || exporters.length === 0) && (
                    <div className="text-center py-32">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-soft mb-8">
                            <svg className="w-12 h-12 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-secondary-900 mb-2">No results found</h2>
                        <p className="text-secondary-600 mb-8">Try adjusting your filters or search terms.</p>
                        <Link href="/products" className="btn-secondary">
                            Clear all filters
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
