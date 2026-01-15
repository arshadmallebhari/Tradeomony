'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useState } from 'react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-secondary-200 shadow-sm">
            <nav className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <span className="font-display font-bold text-xl text-secondary-900">Tradeomony</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/products" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium">
                            Browse Products
                        </Link>
                        <Link href="/categories" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium">
                            Categories
                        </Link>
                        <Link href="/blog" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium">
                            Insights
                        </Link>
                        <Link href="/about" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium">
                            About
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="primary" size="sm">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 text-secondary-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden py-4 border-t border-secondary-200"
                    >
                        <div className="flex flex-col gap-4">
                            <Link href="/products" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium py-2">
                                Browse Products
                            </Link>
                            <Link href="/categories" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium py-2">
                                Categories
                            </Link>
                            <Link href="/blog" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium py-2">
                                Insights
                            </Link>
                            <Link href="/about" className="text-secondary-700 hover:text-primary-600 transition-colors font-medium py-2">
                                About
                            </Link>
                            <div className="flex flex-col gap-2 pt-4 border-t border-secondary-200">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="w-full">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm" className="w-full">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </nav>
        </header>
    );
}
