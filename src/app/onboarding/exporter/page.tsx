'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';

interface ExporterFormData {
    companyName: string;
    country: string;
    city: string;
    products: string[];
    moq: string;
    moqUnit: string;
    certifications: string[];
    description: string;
    phone: string;
    website: string;
}

export default function ExporterOnboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [productImages, setProductImages] = useState<File[]>([]);
    const [formData, setFormData] = useState<ExporterFormData>({
        companyName: '',
        country: 'India',
        city: '',
        products: [],
        moq: '',
        moqUnit: 'pieces',
        certifications: [],
        description: '',
        phone: '',
        website: '',
    });

    const totalSteps = 3;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleArrayInput = (field: 'products' | 'certifications', value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value.split(',').map((item) => item.trim()).filter(Boolean),
        }));
    };

    const uploadImages = async (userId: string): Promise<string[]> => {
        const imageUrls: string[] = [];

        for (const file of productImages) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}-${Math.random()}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            imageUrls.push(publicUrl);
        }

        return imageUrls;
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Upload images
            const imageUrls = await uploadImages(user.id);

            // Create exporter profile
            const { error: profileError } = await (supabase
                .from('exporter_profiles') as any)
                .insert({
                    user_id: user.id,
                    company_name: formData.companyName,
                    country: formData.country,
                    city: formData.city,
                    products: formData.products,
                    moq: parseInt(formData.moq),
                    moq_unit: formData.moqUnit,
                    certifications: formData.certifications,
                    product_images: imageUrls,
                    description: formData.description,
                    phone: formData.phone,
                    website: formData.website,
                });

            if (profileError) throw profileError;

            // Update profile onboarding status
            const { error: updateError } = await (supabase
                .from('profiles') as any)
                .update({ onboarding_completed: true })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Redirect to dashboard
            router.push('/dashboard/exporter');
        } catch (error: any) {
            console.error('Error:', error);
            alert(error.message || 'Failed to complete onboarding');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                        Complete Your Exporter Profile
                    </h1>
                    <p className="text-secondary-600">
                        Step {currentStep} of {totalSteps}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step <= currentStep
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-secondary-200 text-secondary-500'
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all duration-300 ${step < currentStep ? 'bg-primary-600' : 'bg-secondary-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-secondary-600">
                        <span>Company Info</span>
                        <span>Products</span>
                        <span>Images</span>
                    </div>
                </div>

                {/* Form Steps */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="p-8">
                            {/* Step 1: Company Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                                        Company Information
                                    </h2>

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
                                        <label className="form-label">Company Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="textarea"
                                            placeholder="Tell buyers about your company, expertise, and what makes you unique..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Products & MOQ */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                                        Products & Specifications
                                    </h2>

                                    <div>
                                        <label className="form-label">Products You Export</label>
                                        <Input
                                            name="products"
                                            value={formData.products.join(', ')}
                                            onChange={(e) => handleArrayInput('products', e.target.value)}
                                            placeholder="Cotton Fabric, Silk Sarees, Textiles"
                                            helperText="Separate multiple products with commas"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label">Minimum Order Quantity (MOQ)</label>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                name="moq"
                                                value={formData.moq}
                                                onChange={handleInputChange}
                                                className="input flex-1"
                                                placeholder="100"
                                                required
                                            />
                                            <select
                                                name="moqUnit"
                                                value={formData.moqUnit}
                                                onChange={handleInputChange}
                                                className="select w-40"
                                            >
                                                <option value="pieces">Pieces</option>
                                                <option value="kg">Kilograms</option>
                                                <option value="tons">Tons</option>
                                                <option value="liters">Liters</option>
                                                <option value="meters">Meters</option>
                                                <option value="boxes">Boxes</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Certifications (Optional)</label>
                                        <Input
                                            name="certifications"
                                            value={formData.certifications.join(', ')}
                                            onChange={(e) => handleArrayInput('certifications', e.target.value)}
                                            placeholder="ISO 9001, CE, FDA, GOTS"
                                            helperText="Separate multiple certifications with commas"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Product Images */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                                        Product Images
                                    </h2>
                                    <p className="text-secondary-600 mb-6">
                                        Upload high-quality images of your products. These will be displayed on your profile.
                                    </p>

                                    <ImageUpload
                                        maxImages={5}
                                        maxSizeMB={5}
                                        onImagesChange={setProductImages}
                                    />
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-secondary-200">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Previous
                                </Button>

                                {currentStep < totalSteps ? (
                                    <Button type="button" variant="primary" onClick={nextStep}>
                                        Next Step
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleSubmit}
                                        isLoading={isLoading}
                                    >
                                        Complete Profile
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
