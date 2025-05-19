'use server';

import prisma from '../connect';

export const getDashboardStats = async () => {
    try {
        const [totalArticles, totalCategories, totalComments, totalUsers] = await Promise.all([prisma.news.count(), prisma.category.count(), prisma.comment.count(), prisma.user.count()]);

        return {
            totalArticles,
            totalCategories,
            totalComments,
            totalUsers
        };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
    }
};

export const getRecentArticles = async (limit = 5) => {
    try {
        const articles = await prisma.news.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                cat: {
                    select: {
                        title: true
                    }
                },
                comments: true
            }
        });
        return articles;
    } catch (error) {
        console.error('Error fetching recent articles:', error);
        return null;
    }
};

export const getTopCategories = async (limit = 5) => {
    try {
        const categories = await prisma.category.findMany({
            take: limit,
            include: {
                _count: {
                    select: {
                        news: true
                    }
                }
            },
            orderBy: {
                news: {
                    _count: 'desc'
                }
            }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching top categories:', error);
        return null;
    }
};

export const getRecentComments = async (limit = 5) => {
    try {
        const comments = await prisma.comment.findMany({
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                post: {
                    select: {
                        title: true,
                        slug: true,
                        categorySlug: true
                    }
                }
            }
        });
        return comments;
    } catch (error) {
        console.error('Error fetching recent comments:', error);
        return null;
    }
};
