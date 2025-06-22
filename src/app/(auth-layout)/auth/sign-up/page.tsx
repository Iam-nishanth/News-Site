import SignUpForm from '@/components/Forms/SignupForm';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { authOptions } from '@/utils/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';

interface SignUpProps {
    searchParams: {
        callbackUrl?: string;
    };
}

export default async function SignupPage({ searchParams }: SignUpProps) {
    const session = await getServerSession(authOptions);
    if (session && session.user) {
        redirect(searchParams?.callbackUrl ? searchParams.callbackUrl : '/dashboard');
    }

    return (
        <MaxWidthWrapper className="flex flex-col justify-center items-center h-full">
            <div className="w-full flex justify-center items-center h-full">
                <div className="w-full hidden sm:flex lg:flex-1 sticky top-0 h-auto lg:h-screen justify-center items-center flex-col">
                    <h1 className="text-3xl font-semibold underline decoration-cyan-500 underline-offset-4 -mb-16">Create an Account</h1>
                    <div className="relative w-full min-h-[500px]">
                        <Image src="/images/sign-in.png" alt="Authentication" layout="fill" objectFit="contain" />
                    </div>
                </div>
                <div className="w-full max-w-[500px] py-8 px-2 sm:px-0 sm:py-0 ">
                    <h1 className="block sm:hidden text-2xl font-semibold underline decoration-cyan-500 underline-offset-4 mb-4 text-center">Create an Account</h1>
                    <SignUpForm />
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
