import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

interface Props {
    to: string;
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<Props> = ({ to, children, className }) => {
    return (
        <Link
            href={to}
            className={cn(
                'text-white text-sm font-semibold uppercase bg-button px-5 py-2 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 ease-in-out hover:bg-button_hover',
                className
            )}
        >
            {children}
        </Link>
    );
};

export default Button;
