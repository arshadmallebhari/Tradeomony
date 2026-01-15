'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
    {
        number: '01',
        title: 'Create Your Account',
        description: 'Sign up as an exporter or importer in minutes. Complete your business profile with company details and certifications.',
        image: '/step-create-account.png',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Browse or List Products',
        description: 'Importers can search thousands of products. Exporters can showcase their catalog with detailed descriptions and images.',
        image: '/step-browse-products.png',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Connect & Trade',
        description: 'Send inquiries, negotiate directly with suppliers, and close deals securely through our trusted platform.',
        image: '/step-connect-trade.png',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section className="section bg-secondary-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-20"
                >
                    <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm mb-3 block">Process</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
                        Start trading globally in three simple steps with our secure and transparent platform.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) - Animated */}
                    <svg className="hidden lg:block absolute top-[160px] left-0 w-full h-20 -z-10 text-primary-200" preserveAspectRatio="none">
                        <path d="M100,10 C250,10 250,10 400,10 S550,10 700,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
                    </svg>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="relative group"
                        >
                            <div className="relative z-10">
                                {/* Image Container with Interactive Effect */}
                                <div className="image-interactive mb-8 rounded-2xl bg-white shadow-soft-lg p-3 ring-1 ring-secondary-100">
                                    <div className="image-interactive-inner rounded-xl overflow-hidden bg-secondary-50 aspect-[4/3] relative">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-primary-600/10 backdrop-blur-[2px]"></div>

                                        {/* Floating Badge */}
                                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center shadow-sm text-primary-600">
                                            {step.icon}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="text-center px-4">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold mb-4 ring-4 ring-white">
                                        {step.number}
                                    </div>
                                    <h3 className="font-display font-bold text-2xl text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-secondary-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <a href="/signup?role=importer" className="btn-primary">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Start as Importer
                        </a>
                        <a href="/signup?role=exporter" className="btn-outline">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Start as Exporter
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
