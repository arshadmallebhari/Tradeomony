'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function ImporterFavoritesPage() {
    // Placeholder for now as the favorites feature is not fully implemented in schema
    const [favorites] = useState<any[]>([]);

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/importer" className="text-secondary-500 hover:text-secondary-900">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-secondary-900">Saved Products</h1>
            </div>

            <Card className="p-12 text-center">
                <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-secondary-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-secondary-900 mb-2">No saved products yet</h2>
                    <p className="text-secondary-600 mb-8 max-w-md">
                        Items you save will appear here for quick access. Start exploring the marketplace to find products you like.
                    </p>
                    <Link href="/products">
                        <Button>Explore Products</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
