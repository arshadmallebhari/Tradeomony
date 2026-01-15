'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
    hover?: boolean;
    glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, glass = false, children, ...props }, ref) => {
        const baseStyles = 'rounded-xl border transition-all duration-300';
        const glassStyles = glass
            ? 'bg-white/80 backdrop-blur-lg border-white/20'
            : 'bg-white border-secondary-100 shadow-soft';
        const hoverStyles = hover ? 'hover:shadow-soft-lg hover:-translate-y-1 cursor-pointer' : '';

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(baseStyles, glassStyles, hoverStyles, className)}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
