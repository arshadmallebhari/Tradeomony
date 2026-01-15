'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import AIAssistantPanel from '@/components/ai/AIAssistantPanel';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const articles = [
    {
        category: 'For Exporters',
        title: 'How to Obtain an Import Export Code (IEC)',
        description: 'Step-by-step guide to applying for your mandatory 10-digit IEC code from the DGFT website.',
        readTime: '5 min read',
        icon: '📄'
    },
    {
        category: 'Documentation',
        title: 'Essential Export Documents Checklist',
        description: 'Commercial Invoice, Packing List, Shipping Bill - make sure you have everything ready.',
        readTime: '8 min read',
        icon: '✅'
    },
    {
        category: 'For Importers',
        title: 'Understanding Indian Customs Duty',
        description: 'Learn how calculate basic customs duty (BCD), IGST, and social welfare surcharge.',
        readTime: '6 min read',
        icon: '💰'
    },
    {
        category: 'Logistics',
        title: 'Choosing the Right Incoterm',
        description: 'FOB, CIF, EXW? We explain what they mean and how they affect your liability.',
        readTime: '7 min read',
        icon: '🚢'
    }
];

export default function GuidancePage() {
    return (
        <>
            <div className="bg-secondary-50 min-h-screen pb-20">
                {/* Banner */}
                <section className="bg-gradient-to-br from-primary-900 to-secondary-900 text-white py-20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                    <div className="container-custom relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold mb-6"
                        >
                            Export-Import Guidance Center
                        </motion.h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                            Master the complexities of international trade with our expert guides, tools, and AI assistant.
                        </p>
                        <div className="inline-flex gap-4">
                            <Link href="/guidance/exporter-101">
                                <Button variant="primary" className="bg-white text-primary-700 hover:bg-primary-50 border-none">
                                    Start Exporter 101
                                </Button>
                            </Link>
                            <Button variant="outline" className="text-white border-white hover:bg-white/10">
                                Browse Documents
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Knowledge Base */}
                <section className="container-custom -mt-10 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card hover className="p-6 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold tracking-wider text-primary-600 uppercase bg-primary-50 px-2 py-1 rounded">
                                            {article.category}
                                        </span>
                                        <span className="text-2xl">{article.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-secondary-600 mb-4 flex-1">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm pt-4 border-t border-secondary-100">
                                        <span className="text-secondary-500 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {article.readTime}
                                        </span>
                                        <span className="text-primary-600 font-medium group-hover:underline cursor-pointer">
                                            Read Article →
                                        </span>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Tools Section */}
                <section className="container-custom mt-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Trade Tools</h2>
                        <p className="text-secondary-600">Simplifying your daily operations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card hover className="p-6 text-center border-t-4 border-primary-500">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🧮</div>
                            <h3 className="font-bold text-lg mb-2">Duty Calculator</h3>
                            <p className="text-sm text-secondary-600">Estimate customs duty and landing costs</p>
                        </Card>
                        <Card hover className="p-6 text-center border-t-4 border-accent-500">
                            <div className="w-16 h-16 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔍</div>
                            <h3 className="font-bold text-lg mb-2">HS Code Finder</h3>
                            <p className="text-sm text-secondary-600">Find the right classification code</p>
                        </Card>
                        <Card hover className="p-6 text-center border-t-4 border-success-500">
                            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📋</div>
                            <h3 className="font-bold text-lg mb-2">Document Generator</h3>
                            <p className="text-sm text-secondary-600">Create proforma invoices instantly</p>
                        </Card>
                    </div>
                </section>
            </div>

            <AIAssistantPanel />
        </>
    );
}
