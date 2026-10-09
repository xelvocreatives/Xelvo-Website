import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    from?: string;
    to?: string;
}

export const GradientText = ({
    children,
    className,
    from = '#E69700',
    to = '#FF6600'
}: GradientTextProps) => {
    return (
        <span
            className={cn("inline-block text-transparent bg-clip-text", className)}
            style={{
                backgroundImage: `linear-gradient(to right, ${from}, ${to})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {children}
        </span>
    );
};
