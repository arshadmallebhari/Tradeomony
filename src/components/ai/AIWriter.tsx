'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

interface AIWriterProps {
    onGenerate: (text: string) => void;
    productName?: string;
    category?: string;
    currentDescription?: string;
}

export default function AIWriter({
    onGenerate,
    productName = '',
    category = '',
    currentDescription = ''
}: AIWriterProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');

    const generateDescription = async () => {
        setIsGenerating(true);

        // Simulate AI generation delay
        setTimeout(() => {
            // Mock generated response based on inputs
            const generatedText = `Premium quality ${productName || 'product'} specifically designed for international markets. 
      
Key Features:
• ISO 9001 certified manufacturing process
• Durable and long-lasting construction
• Competitive pricing for bulk orders
• Available in customized packaging

Our ${category || 'products'} undergo rigorous quality checks to meet global export standards. Perfect for importers looking for reliability and excellence.`;

            onGenerate(generatedText);
            setIsGenerating(false);
            setShowPrompt(false);
        }, 1500);
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {!showPrompt && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrompt(true)}
                        className="text-primary-600 hover:bg-primary-50 gap-2 border border-primary-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Improve with AI
                    </Button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute z-10 top-12 left-0 w-80 bg-white rounded-xl shadow-xl border border-secondary-200 p-4"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-secondary-900 flex items-center gap-2">
                                <span className="text-xl">✨</span> AI Writer
                            </h4>
                            <button
                                onClick={() => setShowPrompt(false)}
                                className="text-secondary-400 hover:text-secondary-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <textarea
                            className="w-full text-sm p-3 rounded-lg border border-secondary-200 focus:border-primary-500 outline-none resize-none mb-3 bg-secondary-50"
                            rows={3}
                            placeholder="e.g., Make it professional and highlight durability..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                        />

                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            className="w-full bg-gradient-to-r from-primary-600 to-accent-600 border-none hover:shadow-glow transition-all"
                            onClick={generateDescription}
                            isLoading={isGenerating}
                        >
                            Generate Description
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
