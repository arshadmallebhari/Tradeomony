import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = await createClient();
    const { data: post } = await (supabase.from('blogs') as any)
        .select('title, excerpt')
        .eq('slug', params.slug)
        .single();

    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} | Tradeomony Insights`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { data: post } = await (supabase.from('blogs') as any)
        .select('*')
        .eq('slug', params.slug)
        .eq('published', true)
        .single();

    if (!post) {
        notFound();
    }

    return (
        <article className="bg-white min-h-screen pb-24">
            {/* Post Header */}
            <header className="pt-16 pb-12 border-b border-secondary-100 bg-secondary-50">
                <div className="container-custom max-w-4xl">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-primary-600 font-medium mb-8 hover:gap-1 transition-all"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Insights
                    </Link>

                    <Badge variant="primary" className="mb-6">{post.category}</Badge>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
                            T
                        </div>
                        <div>
                            <div className="font-bold text-secondary-900">Tradeomony Editorial</div>
                            <div className="text-sm text-secondary-500">
                                {new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                <span className="mx-2">•</span>
                                8 min read
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Post Content */}
            <div className="container-custom max-w-4xl py-12">
                {post.cover_image && (
                    <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-primary max-w-none">
                    {/* Since content is just text for now, we split by paragraphs */}
                    {post.content.split('\n').map((paragraph: string, i: number) => (
                        <p key={i} className="text-secondary-700 text-lg leading-relaxed mb-6">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Tags or Shared CTA */}
                <div className="mt-16 pt-12 border-t border-secondary-100 text-center">
                    <h3 className="text-2xl font-bold text-secondary-900 mb-6">Want to stay updated?</h3>
                    <p className="text-secondary-600 mb-8">Join 10,000+ global traders receiving our weekly international trade report.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="input max-w-sm"
                        />
                        <button className="btn-primary">Subscribe</button>
                    </div>
                </div>
            </div>
        </article>
    );
}
