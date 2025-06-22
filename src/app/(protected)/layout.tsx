import DashBoardHeader from '@/components/Header/DashboardHeader';
import { authOptions } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import React from 'react';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    return (
        <ProtectedRoute>
            <DashBoardHeader user={session?.user} />
            {children}
        </ProtectedRoute>
    );
}
