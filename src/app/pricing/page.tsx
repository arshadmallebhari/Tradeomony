'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { loadRazorpay, createOrder } from '@/lib/razorpay';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { motion } from 'framer-motion';

const plans = [
    {
        id: 'free',
        name: 'Basic Exporter',
        price: 0,
        features: [
            'List up to 5 products',
            'Basic company profile',
            'Receive up to 10 inquiries/month',
            'Standard support'
        ],
        recommended: false
    },
    {
        id: 'verified',
        name: 'Verified Exporter',
        price: 4999,
        features: [
            'Verified Badge ✅',
            'List unlimited products',
            'Unlimited inquiries',
            'Priority search ranking',
            'Dedicated account manager'
        ],
        recommended: true
    },
    {
        id: 'featured',
        name: 'Featured Listing',
        price: 9999,
        features: [
            'Everything in Verified',
            'Homepage Featured Spot',
            'Top of category results',
            'Product promotion emails',
            'Export analytics dashboard'
        ],
        recommended: false
    }
];

export default function PricingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleSubscribe = async (plan: typeof plans[0]) => {
        if (plan.price === 0) {
            router.push('/dashboard/exporter');
            return;
        }

        setIsLoading(plan.id);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Failed to load payment gateway');
                return;
            }

            const order = await createOrder(plan.price, plan.id);

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Replace with actual key
                amount: order.amount,
                currency: order.currency,
                name: 'Tradeomony',
                description: `Subscription for ${plan.name}`,
                image: '/logo.png', // Add a logo usage
                order_id: order.id,
                handler: async function (response: any) {
                    // Payment Success Handler
                    // In real app: Verify signature on backend

                    // Update user status
                    await (supabase
                        .from('exporter_profiles') as any)
                        .update({
                            verified: true,
                            // Store subscription details if needed
                        })
                        .eq('user_id', user.id);

                    alert(`Payment Successful! You are now a ${plan.name}`);
                    router.push('/dashboard/exporter');
                },
                prefill: {
                    name: '', // Get from user profile
                    email: user.email,
                    contact: '' // Get from user profile
                },
                theme: {
                    color: '#2563eb'
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-20 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                    Choose the plan that fits your export business. Upgrade anytime as you grow.
                </p>
            </div>

            <div className="container-custom max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan: any) => (
                        <motion.div
                            key={plan.id}
                            whileHover={{ y: -10 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <Card
                                key={plan.id}
                                className={`p-8 h-full flex flex-col relative ${plan.recommended ? 'border-2 border-primary-500 shadow-xl scale-105 z-10' : ''
                                    }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-bold text-secondary-900">₹{plan.price}</span>
                                    <span className="text-secondary-500 ml-2">/year</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-secondary-700">
                                            <svg className="w-5 h-5 text-success-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    variant={plan.recommended ? 'primary' : 'outline'}
                                    className="w-full"
                                    onClick={() => handleSubscribe(plan)}
                                    isLoading={isLoading === plan.id}
                                >
                                    {plan.price === 0 ? 'Get Started Free' : 'Subscribe Now'}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
