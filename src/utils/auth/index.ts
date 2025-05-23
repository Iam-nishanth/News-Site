import prisma from '@/utils/connect';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import * as bcrypt from 'bcrypt-ts';
import { User } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/auth/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                username: {
                    label: 'User Name',
                    type: 'text',
                    placeholder: 'Your User Name'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.username
                    }
                });

                if (!user) throw new Error('User name or password is not correct');
                if (!credentials?.password) throw new Error('Please Provide Your Password');
                const isPassowrdCorrect = await bcrypt.compare(credentials.password, user.password!);

                if (!isPassowrdCorrect) throw new Error('User name or password is not correct');

                // Only require email verification if you want to enforce it
                // if (!user.emailVerified) throw new Error('Please verify your email first!');

                const { password, ...userWithoutPass } = user;
                return userWithoutPass;
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user as User;

            return token;
        },

        async session({ token, session }) {
            session.user = token.user;
            return session;
        }
    }
};
