'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Trusted by 1000+ Businesses
                        </div>

                        <h1 className="text-5xl md:text-6xl font-display font-bold text-secondary-900 leading-tight mb-6">
                            Connect with <span className="text-primary-600">Verified</span> Exporters & Importers
                        </h1>

                        <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                            India&apos;s premier B2B marketplace for international trade. Find quality products, verified suppliers, and grow your business globally.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/signup?role=importer">
                                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Find Products
                                </Button>
                            </Link>
                            <Link href="/signup?role=exporter">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Start Selling
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-secondary-200">
                            <div>
                                <div className="text-3xl font-bold text-primary-600">5000+</div>
                                <div className="text-sm text-secondary-600 mt-1">Products</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600">1000+</div>
                                <div className="text-sm text-secondary-600 mt-1">Verified Sellers</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary-600">50+</div>
                                <div className="text-sm text-secondary-600 mt-1">Categories</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Content - Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative image-interactive group">
                            {/* Main Hero Image */}
                            <div className="image-interactive-inner relative z-10 w-full">
                                <Image
                                    src="/hero-global-trade.png"
                                    alt="Global Trade Logic"
                                    width={800}
                                    height={600}
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                                    className="w-full h-auto drop-shadow-2xl rounded-xl transition-transform duration-500"
                                />
                            </div>

                            {/* Floating Cards - Re-integrated with new design */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-md rounded-xl shadow-soft-lg p-4 z-20 border border-white/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                        <Image
                                            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80"
                                            alt="Global Logistics"
                                            fill
                                            sizes="40px"
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/40 to-transparent"></div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-secondary-500 font-medium">Verified</div>
                                        <div className="font-bold text-sm text-secondary-900">Trusted Sellers</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-md rounded-xl shadow-soft-lg p-4 z-20 border border-white/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs text-secondary-500 font-medium">24/7 Support</div>
                                        <div className="font-bold text-sm text-secondary-900">Live Connect</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
