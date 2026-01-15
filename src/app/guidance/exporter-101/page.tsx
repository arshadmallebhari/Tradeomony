'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const steps = [
    {
        number: '01',
        title: 'Market Research',
        description: 'Identify product-market fit. Use tools like DGFT Trade Statistics to find countries with high demand for your products.',
        icon: '🔍',
        color: 'bg-blue-50 text-blue-600'
    },
    {
        number: '02',
        title: 'Business Setup',
        description: 'Register your business as a Proprietorship, Partnership, or Company. Apply for an Import Export Code (IEC) via DGFT.',
        icon: '🏢',
        color: 'bg-teal-50 text-teal-600'
    },
    {
        number: '03',
        title: 'Find Buyers',
        description: 'Create your digital presence. Use Tradeomony to showcase your products to verified international importers.',
        icon: '🤝',
        color: 'bg-purple-50 text-purple-600'
    },
    {
        number: '04',
        title: 'Documentation',
        description: 'Prepare essential documents: Commercial Invoice, Packing List, Shipping Bill, and Bill of Lading.',
        icon: '📄',
        color: 'bg-orange-50 text-orange-600'
    }
];

export default function Exporter101Page() {
    return (
        <div className="bg-secondary-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-900 to-secondary-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="container-custom relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide uppercase bg-white/10 backdrop-blur-sm border border-white/20 rounded-full"
                    >
                        Success Roadmap
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Exporter 101: Your Journey Starts Here
                    </motion.h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                        Everything you need to know to take your business from local to global. Follow our proven roadmap to international trade success.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="container-custom -mt-12 relative z-20 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="p-8 h-full flex flex-col items-start hover:shadow-xl transition-all duration-300">
                                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm`}>
                                    {step.icon}
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-bold text-primary-600 font-mono tracking-tighter">STEP {step.number}</span>
                                    <div className="h-px w-8 bg-primary-100"></div>
                                </div>
                                <h3 className="text-2xl font-bold text-secondary-900 mb-4">{step.title}</h3>
                                <p className="text-secondary-600 leading-relaxed mb-6 text-lg">
                                    {step.description}
                                </p>
                                <Button variant="ghost" size="sm" className="mt-auto group">
                                    Learn More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-12 text-center shadow-lg border border-secondary-100"
                >
                    <div className="max-w-xl mx-auto">
                        <h2 className="text-3xl font-bold text-secondary-900 mb-4">Ready to Go Global?</h2>
                        <p className="text-lg text-secondary-600 mb-8">
                            Setting up your profile is the first step towards reaching thousands of international importers.
                        </p>
                        <Link href="/onboarding/exporter">
                            <Button size="lg" className="w-full md:w-auto px-12 h-14 text-lg">
                                Begin Your Profile Setup
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
