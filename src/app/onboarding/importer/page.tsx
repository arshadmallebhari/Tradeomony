'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ImporterFormData {
    companyName: string;
    country: string;
    city: string;
    interestedCategories: string[];
    phone: string;
    website: string;
}

export default function ImporterOnboarding() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ImporterFormData>({
        companyName: '',
        country: 'India',
        city: '',
        interestedCategories: [],
        phone: '',
        website: '',
    });

    const categories = [
        'Textiles & Apparel',
        'Electronics',
        'Agriculture',
        'Chemicals',
        'Machinery',
        'Automotive',
        'Food & Beverages',
        'Handicrafts',
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleCategory = (category: string) => {
        setFormData((prev) => ({
            ...prev,
            interestedCategories: prev.interestedCategories.includes(category)
                ? prev.interestedCategories.filter((c) => c !== category)
                : [...prev.interestedCategories, category],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Create importer profile with optional fields
            const profileData: any = {
                user_id: user.id,
                company_name: formData.companyName || null,
                country: formData.country || null,
                city: formData.city || null,
                interested_categories: formData.interestedCategories.length > 0 ? formData.interestedCategories : null,
                phone: formData.phone || null,
                website: formData.website || null,
            };

            const { error: profileError } = await (supabase
                .from('importer_profiles') as any)
                .insert(profileData);

            if (profileError) throw profileError;

            // Update profile onboarding status
            const { error: updateError } = await (supabase
                .from('profiles') as any)
                .update({ onboarding_completed: true })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Redirect to dashboard
            router.push('/dashboard/importer');
        } catch (error: any) {
            console.error('Error:', error);
            alert(error.message || 'Failed to complete onboarding');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                            Complete Your Importer Profile
                        </h1>
                        <p className="text-secondary-600">
                            Tell us about your business to get personalized product recommendations
                        </p>
                    </div>

                    <Card className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Your Company Ltd."
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="form-label">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="select"
                                        required
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="China">China</option>
                                        <option value="UAE">UAE</option>
                                    </select>
                                </div>

                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Mumbai"
                                    required
                                />
                            </div>

                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 98765 43210"
                            />

                            <Input
                                label="Website (Optional)"
                                name="website"
                                type="url"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://yourcompany.com"
                            />

                            <div>
                                <label className="form-label">Interested Categories</label>
                                <p className="text-sm text-secondary-500 mb-3">
                                    Select the product categories you're interested in importing
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.map((category: string) => (
                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() => toggleCategory(category)}
                                            className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${formData.interestedCategories.includes(category)
                                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                : 'border-secondary-200 hover:border-primary-300 text-secondary-700'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-secondary-200">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    isLoading={isLoading}
                                >
                                    Complete Profile
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
