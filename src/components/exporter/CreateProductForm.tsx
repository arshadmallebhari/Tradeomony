'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ImageUpload from '@/components/ui/ImageUpload';
import AIWriter from '@/components/ai/AIWriter';

export default function CreateProductForm() {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        price: '',
        moq: '',
        moqUnit: 'pieces',
        location: '',
        certifications: '',
    });

    const [productImages, setProductImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImagesChange = (files: File[]) => {
        setProductImages(files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Upload images to Supabase Storage
        // TODO: Create product record in database

        console.log('Form Data:', formData);
        console.log('Product Images:', productImages);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Product created successfully!');
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                    Create Product Listing
                </h1>
                <p className="text-secondary-600">
                    Add your product details and images to start receiving inquiries
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                        Basic Information
                    </h2>

                    <div className="space-y-6">
                        <Input
                            label="Product Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., Premium Cotton Fabric"
                            required
                        />

                        <div>
                            <label className="form-label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="select"
                                required
                            >
                                <option value="">Select a category</option>
                                <option value="textiles">Textiles & Apparel</option>
                                <option value="electronics">Electronics</option>
                                <option value="agriculture">Agriculture</option>
                                <option value="chemicals">Chemicals</option>
                                <option value="machinery">Machinery</option>
                                <option value="automotive">Automotive</option>
                                <option value="food">Food & Beverages</option>
                                <option value="handicrafts">Handicrafts</option>
                            </select>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="form-label mb-0">Description</label>
                                <AIWriter
                                    onGenerate={(text) => setFormData(prev => ({ ...prev, description: text }))}
                                    productName={formData.title}
                                    category={formData.category}
                                    currentDescription={formData.description}
                                />
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea"
                                placeholder="Describe your product, its features, and specifications..."
                                required
                            />
                            <p className="form-helper">Minimum 50 characters</p>
                        </div>
                    </div>
                </Card>

                {/* Pricing & Quantity */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                        Pricing & Quantity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Price per Unit (INR)"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="1000"
                            required
                        />

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
                                    className="select w-32"
                                >
                                    <option value="pieces">Pieces</option>
                                    <option value="kg">Kg</option>
                                    <option value="tons">Tons</option>
                                    <option value="liters">Liters</option>
                                    <option value="meters">Meters</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Product Images */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-2">
                        Product Images
                    </h2>
                    <p className="text-sm text-secondary-600 mb-6">
                        Upload high-quality images of your product. First image will be used as the main image.
                    </p>

                    <ImageUpload
                        maxImages={5}
                        maxSizeMB={5}
                        onImagesChange={handleImagesChange}
                    />
                </Card>

                {/* Additional Details */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-secondary-900 mb-6">
                        Additional Details
                    </h2>

                    <div className="space-y-6">
                        <Input
                            label="Manufacturing Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Mumbai, Maharashtra"
                            required
                        />

                        <Input
                            label="Certifications (Optional)"
                            name="certifications"
                            value={formData.certifications}
                            onChange={handleInputChange}
                            placeholder="e.g., ISO 9001, CE, FDA"
                            helperText="Separate multiple certifications with commas"
                        />
                    </div>
                </Card>

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="ghost" size="lg">
                        Save as Draft
                    </Button>
                    <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
                        Publish Product
                    </Button>
                </div>
            </form>
        </div>
    );
}
