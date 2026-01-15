'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
    size?: 'sm' | 'md';
}

export default function Badge({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}: BadgeProps) {
    const baseStyles = 'inline-flex items-center gap-1 rounded-full font-medium';

    const variants = {
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-success-100 text-success-700',
        warning: 'bg-accent-100 text-accent-700',
        danger: 'bg-danger-100 text-danger-700',
        secondary: 'bg-secondary-100 text-secondary-700',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </span>
    );
}
