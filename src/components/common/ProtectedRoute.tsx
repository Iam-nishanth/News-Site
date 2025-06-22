'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/loader';
import { toast } from 'sonner';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading

        if (status === 'unauthenticated') {
            toast.error('Access denied', {
                description: 'Please sign in to access this page',
                position: 'top-right'
            });
            router.push('/auth/sign-in');
            return;
        }

        if (session?.user && !session.user.emailVerified) {
            toast.error('Email not verified', {
                description: 'Please verify your email to access this page',
                position: 'top-right'
            });
            router.push('/auth/sign-in');
            return;
        }
    }, [session, status, router]);

    // Show loading while checking authentication
    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    // Don't render children until verified
    if (status === 'unauthenticated' || !session?.user?.emailVerified) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
