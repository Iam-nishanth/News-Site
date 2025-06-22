import SignInForm from '@/components/Forms/SigninForm';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
interface SignInProps {
    searchParams: Promise<{
        callbackUrl?: string;
        error?: string;
    }>;
}

const SigninPage = async ({ searchParams }: SignInProps) => {
    const session = await getServerSession(authOptions);
    const params = await searchParams;
    const callbackUrl = params?.callbackUrl ?? null;
    const error = params?.error ?? '';

    if (session && session.user && session.user.emailVerified) {
        redirect(callbackUrl ? callbackUrl : '/dashboard');
    }

    return (
        <MaxWidthWrapper className="flex justify-center items-center h-full">
            <div className="w-full hidden sm:flex lg:flex-1 sticky top-0 h-auto lg:h-[73vh] justify-center items-center flex-col">
                <h1 className="text-3xl font-semibold underline decoration-cyan-500 underline-offset-4 -mb-6 font-Gentium">Sign-in to your account</h1>
                <div className="relative w-full min-h-[500px]">
                    <Image src="/images/sign-in.png" alt="Authentication" layout="fill" objectFit="contain" />
                </div>
            </div>
            <div className="w-full max-w-[500px] pt-5 px-2 sm:px-0 sm:pt-0 ">
                <h1 className="block sm:hidden text-2xl font-semibold underline decoration-cyan-500 underline-offset-4 mb-4 text-center font-Gentium">Sign in to your account</h1>
                <SignInForm callbackURL={callbackUrl} callbackError={error} />
            </div>
        </MaxWidthWrapper>
    );
};

export default SigninPage;
