import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
    title: 'Trade Insights | Tradeomony',
    description: 'Latest news, trends, and expert guidance for global exporters and importers.',
};

export default async function BlogPage() {
    const supabase = await createClient();
    const { data: posts } = await (supabase.from('blogs') as any)
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="container-custom relative">
                    <div className="max-w-3xl">
                        <Badge variant="primary" className="mb-6">Project Guidance & News</Badge>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            Trade <span className="text-accent-400">Insights</span>
                        </h1>
                        <p className="text-xl text-primary-100 leading-relaxed">
                            Stay ahead of the curve with expert analysis on global supply chains, trade policies, and digital transformation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Feed */}
            <section className="py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts?.map((post: any) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                                <article className="flex flex-col h-full overflow-hidden rounded-2xl border border-secondary-100 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                    {/* Image Placeholder */}
                                    <div className="aspect-video bg-secondary-100 relative overflow-hidden">
                                        {post.cover_image ? (
                                            <img
                                                src={post.cover_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-700/10">
                                                <svg className="w-16 h-16 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <Badge variant="primary" className="shadow-lg backdrop-blur-md bg-white/90">
                                                {post.category}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-sm text-secondary-500 mb-4">
                                            <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="w-1 h-1 rounded-full bg-secondary-300"></span>
                                            <span>5 min read</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-secondary-600 mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center text-primary-600 font-bold group-hover:gap-2 transition-all">
                                            <span>Read Article</span>
                                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {(!posts || posts.length === 0) && (
                        <div className="text-center py-24 bg-secondary-50 rounded-3xl border-2 border-dashed border-secondary-200">
                            <h3 className="text-2xl font-bold text-secondary-900 mb-2">Coming Soon!</h3>
                            <p className="text-secondary-600">Our experts are currently drafting the next batch of insights.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
