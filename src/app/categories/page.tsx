import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import { Database } from '@/types/database';

export const metadata: Metadata = {
    title: 'Product Categories | Tradeomony',
    description: 'Browse global trade products by category. Find everything from Textiles to Industrial Machinery.',
};

export default async function CategoriesPage() {
    const supabase = await createClient();
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')
        .returns<Database['public']['Tables']['categories']['Row'][]>();

    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-secondary-900 text-white py-16 md:py-24">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            Global Trade <span className="text-primary-400">Categories</span>
                        </h1>
                        <p className="text-xl text-secondary-300 leading-relaxed">
                            Discover high-quality products from verified manufacturers across major industry sectors.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories?.map((category) => (
                            <Link key={category.id} href={`/products?category=${category.slug}`}>
                                <Card className="group p-8 h-full hover:border-primary-500 transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                                            {/* Fallback Icon if not found */}
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                                                {category.name}
                                            </h3>
                                            <p className="text-secondary-600 leading-relaxed">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center text-primary-600 font-medium group-hover:gap-2 transition-all">
                                        <span>Browse All</span>
                                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-16 border-t border-secondary-200">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4">
                        Don&apos;t see what you&apos;re looking for?
                    </h2>
                    <p className="text-secondary-600 mb-8 max-w-2xl mx-auto">
                        Our sourcing experts can help you find the right supplier for your specific needs.
                    </p>
                    <Link
                        href="/contact"
                        className="btn-primary inline-flex"
                    >
                        Request a Quote
                    </Link>
                </div>
            </section>
        </div>
    );
}
