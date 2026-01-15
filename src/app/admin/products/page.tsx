'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // Using 'as any' just in case types aren't fully synced yet
            const { data, error } = await (supabase
                .from('products') as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading products...</div>;

    return (
        <div className="container-custom py-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/dashboard" className="text-secondary-500 hover:text-secondary-900">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-display font-bold text-secondary-900">Products</h1>
            </div>

            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-secondary-50 text-secondary-600 font-medium text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4">Product Name</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Price / Unit</th>
                                <th className="px-6 py-4">Inventory</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-secondary-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-secondary-900">{product.name}</div>
                                        {product.category && (
                                            <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-0.5 rounded">
                                                {product.category}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-secondary-600 max-w-xs truncate">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        {product.currency} {product.price} / {product.unit}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-secondary-600">
                                        {product.inventory_count || 0}
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-secondary-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
