import { SVGProps } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends SVGProps<SVGSVGElement> {
    className?: string; // Allow custom styling/sizing
}

const Logo = ({ className, ...props }: LogoProps) => {
    return (
        <svg
            viewBox="0 0 280 50"
            width={280}
            height={50}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("w-auto", className)}
            {...props}
        >
            <style>
                {`
                    .logo-font { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; }
                    .subtitle-font { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500; letter-spacing: 0.1em; }
                `}
            </style>

            {/* TRADE - Darker Green */}
            <text x="0" y="32" className="logo-font" fontSize="32" fill="#064E3B">TRADE</text>

            {/* Dollar Coin 'O' */}
            <circle cx="128" cy="22" r="14" fill="#6EE7B7" /> {/* Circle background */}
            <path d="M128 12V14M128 30V32" stroke="white" strokeWidth="2" strokeLinecap="round" /> {/* Vertical line extension */}
            <text x="128" y="30" fontFamily="sans-serif" fontWeight="bold" fontSize="22" fill="white" textAnchor="middle">$</text>

            {/* MONY - Lighter Green */}
            <text x="150" y="32" className="logo-font" fontSize="32" fill="#6EE7B7">MONY</text>

            {/* Global Trade Directory - Subtitle */}
            <text x="140" y="48" className="subtitle-font" fontSize="10" fill="#065F46" textAnchor="middle">GLOBAL TRADE DIRECTORY</text>
        </svg>
    );
};

export default Logo;
