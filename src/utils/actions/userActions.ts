'use server';
import prisma from '../connect';
import { ContactValidationSchema } from '@/components/ContactForm';
import { compileContactForm, compileContactFormAutoReply, sendMail } from './mail';

export const getPostsByCategory = async (category: string) => {
    try {
        const posts = await prisma.news.findMany({
            where: {
                categorySlug: category
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return posts;
    } catch (error) {}
};

export const getPostById = async (id: string) => {
    try {
        if (!id) return;
        const post = await prisma.news.findUnique({
            where: {
                id: id
            },
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                user: { select: { name: true } }
            }
        });
        return post;
    } catch (error) {
        return null;
    }
};

export const getPostsByTag = async (tag: string) => {
    try {
        if (!tag) return;
        const posts = await prisma.news.findMany({
            where: {
                tags: {
                    has: tag
                }
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });

        return posts;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const searchPosts = async (query: string) => {
    try {
        if (typeof query !== 'string') {
            throw new Error('Invalid request');
        }

        const posts = await prisma.news.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        content: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        return posts;
    } catch (error) {}
};

export const getSimilarPosts = async (tags: string[]) => {
    try {
        if (!tags || tags.length === 0) return;

        const posts = await prisma.news.findMany({
            where: {
                AND: tags.map((tag) => ({
                    tags: {
                        has: tag
                    }
                }))
            },
            select: {
                id: true,
                title: true,
                categorySlug: true,
                createdAt: true
            },
            take: 9
        });

        return posts;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const submitContactForm = async (data: ContactValidationSchema) => {
    const { name, email, subject, message } = data;
    if (!name || !email || !subject) {
        throw new Error('Not enough data');
    }

    try {
        const userMailBody = compileContactFormAutoReply(name);
        const adminMailBody = compileContactForm(name, email, subject, message);

        await sendMail({
            to: email,
            subject: 'Contact Form Submission 🌐',
            body: await userMailBody
        });
        await sendMail({
            to: 'admin@sudheervarma.com',
            subject: `New Contact Form Submission by ${name}`,
            body: await adminMailBody
        });

        return { status: 'success' };
    } catch (error) {
        console.log(error);
        return { status: 'failed' };
    }
};
