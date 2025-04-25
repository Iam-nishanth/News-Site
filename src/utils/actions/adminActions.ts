'use server';

import { getServerSession } from 'next-auth';
import prisma from '../connect';
import { authOptions } from '../auth';
import { withAuth } from 'next-auth/middleware';
import { ROLE, User } from '@prisma/client';
import { verifyUser } from './authActions';
import { userAgent } from 'next/server';

type ServerActionArgs = [User, ...any[]];

export async function GetRole() {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) return undefined;
    else if (user?.role == 'ADMIN') return 'ADMIN';
    else if (user?.role == 'SUPERADMIN') return 'SUPERADMIN';
    else return undefined;
}

export const getUsers = async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) return;

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') return;

    try {
        const users = await prisma.user.findMany();
        return users;
    } catch (error) {
        return null;
    }
};

export const getNews = async () => {
    const { user } = await verifyUser();
    if (!user) throw new Error('There is no User');

    try {
        const news = await prisma.news.findMany();
        return news;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getAvalilableCategories = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user) return;
    const user = session.user;

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') return;

    try {
        const categories = await prisma.category.findMany({
            select: { title: true }
        });
        const categoryTitles = categories.map((category) => category.title);
        return categoryTitles;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const markHomeGridNews = async (newsIds: string[]) => {
    const { user } = await verifyUser();
    if (!user) throw new Error('There is no User');
    if (user.role == 'USER') throw new Error("You're not allowed to make this operation");

    try {
        if (!newsIds || newsIds.length == 0) throw new Error('Incomplete Data');
        // Map over newsIds to create an array of objects for createMany
        const data = newsIds.map((id) => ({
            id: id // Assuming 'id' is the field you want to set for each record
            // Add other fields here as needed
        }));

        const response = await prisma.homeGrid.createMany({
            data: data
        });
        // Handle the response as needed

        console.log(response);
    } catch (error) {
        // Handle the error
        console.error(error);
    }
};

export const deleteMultipleNews = async (newsIds: string[]) => {};

export const deleteNews = async (id: string) => {
    const { user } = await verifyUser();
    if (!user) throw new Error('There is no User');
    if (user.role === 'USER') throw new Error(' UnAuthorized');
    if (!id) throw new Error('No Id Provided');

    try {
        const news = await prisma.news.findUnique({ where: { id } });

        const response = await prisma.news.delete({
            where: {
                id
            },
            include: {
                comments: true
            }
        });

        return { status: 'success', response: response };
    } catch (error) {
        console.log(error);
        return { status: 'failed', error: error };
    }
};

export const changeRole = async (id: string, role: string) => {
    const { user } = await verifyUser();
    if (!user) throw new Error('There is no User');
    if (user.role === 'USER' || user.role == 'EDITOR') throw new Error(' UnAuthorized');
    if (!id) throw new Error('No Id Provided');

    try {
        const existingUser = await prisma.user.findUnique({ where: { id } });

        if (!existingUser) throw new Error("User with ID doesn't exist");

        const changeUserRole = await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                role: ROLE[role as keyof typeof ROLE]
            }
        });

        if (!changeUserRole) return { status: 'failed' };
        return { status: 'success' };
    } catch (error) {
        return { status: 'failed' };
    }
};

export const deleteUser = async (userId: string) => {
    const { user } = await verifyUser();
    if (!user) throw new Error('There is no User');
    if (user.role === 'USER' || user.role == 'EDITOR') throw new Error(' UnAuthorized');
    if (!userId) throw new Error('No Id Provided');

    try {
        const removeUser = await prisma.user.delete({ where: { id: userId } });

        if (!removeUser) return { status: 'failed' };

        return { status: 'success' };
    } catch (error) {
        return { status: 'failed' };
    }
};
