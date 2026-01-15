'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface ImageUploadProps {
    maxImages?: number;
    maxSizeMB?: number;
    onImagesChange?: (files: File[]) => void;
    existingImages?: string[];
}

export default function ImageUpload({
    maxImages = 5,
    maxSizeMB = 5,
    onImagesChange,
    existingImages = [],
}: ImageUploadProps) {
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(existingImages);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload only image files');
            return false;
        }

        // Check file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSizeMB) {
            setError(`Image size must be less than ${maxSizeMB}MB`);
            return false;
        }

        return true;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        const totalImages = images.length + previews.length + fileArray.length;

        if (totalImages > maxImages) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        fileArray.forEach((file) => {
            if (validateFile(file)) {
                validFiles.push(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result as string);
                    if (newPreviews.length === validFiles.length) {
                        setPreviews((prev) => [...prev, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            }
        });

        if (validFiles.length > 0) {
            const updatedImages = [...images, ...validFiles];
            setImages(updatedImages);
            onImagesChange?.(updatedImages);
            setError('');
        }
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeImage = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        const newImages = images.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        setImages(newImages);
        onImagesChange?.(newImages);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    {/* Upload Icon */}
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>

                    {/* Text */}
                    <div>
                        <p className="text-secondary-900 font-medium mb-1">
                            {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-sm text-secondary-500">
                            PNG, JPG, WEBP up to {maxSizeMB}MB (Max {maxImages} images)
                        </p>
                    </div>

                    {/* Upload Count */}
                    {previews.length > 0 && (
                        <div className="text-sm text-primary-600 font-medium">
                            {previews.length} / {maxImages} images uploaded
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-danger-50 border border-danger-200 rounded-lg flex items-center gap-2 text-danger-700"
                >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{error}</span>
                </motion.div>
            )}

            {/* Image Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence>
                        {previews.map((preview, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group aspect-square"
                            >
                                {/* Image */}
                                <img
                                    src={preview}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border-2 border-secondary-200"
                                />

                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-danger-600 text-white rounded-full 
                           flex items-center justify-center opacity-0 group-hover:opacity-100 
                           transition-opacity duration-200 hover:bg-danger-700 shadow-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Image Number Badge */}
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Helper Text */}
            {previews.length === 0 && (
                <p className="text-sm text-secondary-500 text-center">
                    Upload high-quality images of your products to attract more buyers
                </p>
            )}
        </div>
    );
}
