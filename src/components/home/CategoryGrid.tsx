'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Card from '@/components/ui/Card';

const categories = [
    { name: 'Textiles & Apparel', icon: '👔', count: '1200+', slug: 'textiles' },
    { name: 'Electronics', icon: '💻', count: '800+', slug: 'electronics' },
    { name: 'Agriculture', icon: '🌾', count: '950+', slug: 'agriculture' },
    { name: 'Chemicals', icon: '⚗️', count: '600+', slug: 'chemicals' },
    { name: 'Machinery', icon: '⚙️', count: '700+', slug: 'machinery' },
    { name: 'Automotive', icon: '🚗', count: '500+', slug: 'automotive' },
    { name: 'Food & Beverages', icon: '🍽️', count: '850+', slug: 'food' },
    { name: 'Handicrafts', icon: '🎨', count: '400+', slug: 'handicrafts' },
];

export default function CategoryGrid() {
    return (
        <section className="section bg-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-display font-bold text-secondary-900 mb-4">
                        Explore by Category
                    </h2>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                        Discover products across diverse industries and connect with verified suppliers
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link href={`/categories/${category.slug}`}>
                                <Card hover className="p-6 text-center group">
                                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg text-secondary-900 mb-2">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-secondary-600">{category.count} products</p>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        View All Categories
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
