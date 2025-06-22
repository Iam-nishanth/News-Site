'use server';
import { User } from '@prisma/client';
import prisma from '../connect';
import { hash } from 'bcrypt-ts';
import { compileActivationTemplate, compilePasswordTemplate, sendMail } from './mail';
import { signJWT, verifyJWT } from './jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';

const salt = 10;

export async function registerUser(user: Omit<User, 'id' | 'emailVerified' | 'image' | 'createdAt' | 'updatedAt' | 'role'>) {
    const response = await prisma.user.create({
        data: {
            ...user,
            password: await hash(user.password!, salt)
        }
    });

    const jwtUserId = signJWT({
        id: response.id
    });

    const activationURL = `${process.env.NEXTAUTH_URL}/auth/activation/${jwtUserId}`;
    const body = compileActivationTemplate(user.name, activationURL);
    await sendMail({
        to: user.email,
        subject: 'Activate Your Account ✅',
        body: await body
    });
    return response;
}

type ActivateUserHandle = (jwtUserId: string) => Promise<'userNotExist' | 'alreadyActivated' | 'success'>;

export const activateUser: ActivateUserHandle = async (jwtUserId) => {
    const payload = verifyJWT(jwtUserId);
    const userId = payload?.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) return 'userNotExist';
    if (user.emailVerified) return 'alreadyActivated';
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            emailVerified: true
        }
    });
    return 'success';
};

// export async function VerifyGoogleAccount(id: string, name: string, email: string) {
//     const jwtUserId = signJWT({
//         id: id
//     })

//     const activationURL = `${process.env.NEXTAUTH_URL}/auth/activate-oauth/${jwtUserId}`
//     const body = compileActivationTemplate(name, activationURL)
//     const send = await sendMail({
//         to: email,
//         subject: "Activate Your Account",
//         body
//     })
//     return send
// }

// export const activateOAuthUser: ActivateUserHandle = async (jwtUserId) => {
//     const payload = verifyJWT(jwtUserId);
//     if (!payload?.id) return "userNotExist"
//     const userId = payload.id
//     const user = await prisma.user.findFirst({
//         where: {
//             accounts: {
//                 some: {
//                     providerAccountId: userId,
//                 },
//             },
//         },
//     });

//     if (!user) return "userNotExist"
//     if (user.emailVerified) return "alreadyActivated"
//     const result = await prisma.user.update({
//         where: {
//             id: user.id
//         },
//         data: {
//             emailVerified: new Date()
//         }
//     })
//     return "success"
// }

export async function forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) return { error: true, message: 'User does not exist' };

    //  Send Email with Password Reset Link
    const jwtUserId = signJWT({
        id: user.id
    });
    const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${jwtUserId}`;
    const body = compilePasswordTemplate(user.name, resetPassUrl);
    const sendResult = await sendMail({
        to: user.email,
        subject: 'Reset Password ✅',
        body: await body
    });
    return sendResult;
}

type ResetPasswordHandle = (jwtUserId: string, password: string) => Promise<'userNotExitst' | 'success'>;

export const resetPasswordAction: ResetPasswordHandle = async (jwtUserId, password) => {
    const payload = verifyJWT(jwtUserId);
    if (!payload) return 'userNotExitst';

    const userId = payload.id;

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) return 'userNotExitst';

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: await hash(password, salt)
        }
    });

    if (result) return 'success';
    else throw new Error('Something went wrong');
};

export const verifyUser = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return { session, user };
};
