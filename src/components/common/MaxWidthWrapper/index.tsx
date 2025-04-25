import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

const MaxWidthWrapper = ({ className, children, asChild = false }: { className?: string; children: ReactNode; asChild?: boolean }) => {
    return <div className={cn(asChild ? '' : 'mx-auto w-full max-w-screen-xl px-2.5', className)}>{children}</div>;
};

export default MaxWidthWrapper;
