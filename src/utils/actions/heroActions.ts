'use server';

import prisma from '../connect';

export const getHeroSection = async () => {
    try {
        const heroSection = await prisma.heroSection.findMany({
            include: {
                news: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        categorySlug: true,
                        featuredImg: true,
                        cat: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                position: 'asc'
            }
        });
        return heroSection;
    } catch (error) {
        console.error('Error fetching hero section:', error);
        return null;
    }
};

export const getAvailableArticles = async () => {
    try {
        // Get articles that are not in the hero section
        const articles = await prisma.news.findMany({
            where: {
                HeroSection: null
            },
            select: {
                id: true,
                title: true,
                slug: true,
                categorySlug: true,
                featuredImg: true,
                cat: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return articles;
    } catch (error) {
        console.error('Error fetching available articles:', error);
        return null;
    }
};

export const updateHeroSectionOrder = async (updates: { newsSlug: string; position: number }[]) => {
    try {
        // Use transaction to ensure all updates succeed or none do
        await prisma.$transaction(
            updates.map(({ newsSlug, position }) =>
                prisma.heroSection.upsert({
                    where: { position },
                    create: { newsSlug, position },
                    update: { newsSlug }
                })
            )
        );
        return { success: true };
    } catch (error) {
        console.error('Error updating hero section order:', error);
        return { success: false, error };
    }
};

export const removeFromHeroSection = async (position: number) => {
    try {
        await prisma.heroSection.delete({
            where: { position }
        });
        return { success: true };
    } catch (error) {
        console.error('Error removing from hero section:', error);
        return { success: false, error };
    }
};
