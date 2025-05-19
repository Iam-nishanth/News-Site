'use server';
import { DraftPost } from '@prisma/client';
import prisma from '../connect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { deleteFirebaseFile } from '@/lib/editor';

export const generateSlug = async (name: string): Promise<string> => {
    let slug = name.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^a-z0-9\-]/g, '');
    return slug;
};

type DraftResponse = (
    post: Omit<DraftPost, 'id' | 'slug' | 'userEmail' | 'createdAt' | 'updatedAt'>
) => Promise<'Insufficient details' | 'User not Exist' | 'Server Error' | 'Successful' | { message: string; id: string }>;
type PublishDraft = (post: Omit<DraftPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<'Insufficient details' | 'User not Exist' | 'Server Error' | 'Successful'>;
type DeleteDraft = (id: string) => Promise<'Insufficient details' | 'Server Error' | 'Successful'>;
type ModifyResponse = (post: Omit<DraftPost, 'createdAt' | 'updatedAt' | 'userEmail' | 'slug'>) => Promise<'Insufficient Details' | 'User not Exist' | 'Server Error' | 'Success'>;

export const createDraft: DraftResponse = async (post) => {
    const session = await getServerSession(authOptions);
    try {
        if (!post) return 'Insufficient details';
        if (!session?.user) return 'User not Exist';

        const response = await prisma.draftPost.create({
            data: {
                title: post.title,
                categorySlug: post.categorySlug,
                imgCaption: post.imgCaption,
                tags: post.tags,
                content: post.content,
                featuredImg: post.featuredImg,
                slug: await generateSlug(post.title),
                userEmail: session.user.email
            }
        });
        if (response) return { message: 'Successful', id: response.id };
    } catch (error) {
        return 'Server Error';
    }
    return 'Server Error';
};

export const modifyDraft: ModifyResponse = async (post) => {
    const session = await getServerSession(authOptions);
    try {
        if (!post) return 'Insufficient Details';
        if (!session?.user) return 'User not Exist';

        const response = await prisma.draftPost.update({
            where: { id: post.id },
            data: {
                title: post.title,
                categorySlug: post.categorySlug,
                imgCaption: post.imgCaption,
                tags: post.tags,
                content: post.content,
                featuredImg: post.featuredImg,
                userEmail: session.user.email
            }
        });
        if (response) return 'Success';
    } catch (error) {
        return 'Server Error';
    }
    return 'Server Error';
};

export const getDrafts = async () => {
    try {
        const drafts = await prisma.draftPost.findMany();
        return drafts;
    } catch (error) {
        return null;
    }
};

export const getDraft = async (id: string) => {
    if (!id) return;

    try {
        const draft = await prisma.draftPost.findUnique({
            where: { id: id }
        });

        return draft;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const PublishDraft: PublishDraft = async (post) => {
    try {
        if (!post) return 'Insufficient details';
        const existingUser = await prisma.user.findUnique({
            where: { email: post.userEmail }
        });

        if (!existingUser) return 'User not Exist';

        const response = await prisma.news.create({
            data: {
                title: post.title,
                categorySlug: post.categorySlug,
                imgCaption: post.imgCaption,
                tags: post.tags,
                content: post.content,
                featuredImg: post.featuredImg,
                slug: post.slug,
                userEmail: existingUser.email,
                homeGridId: ''
            }
        });

        if (response) {
            const deleteDraft = await prisma.draftPost.delete({
                where: {
                    slug: response.slug
                }
            });

            if (response && deleteDraft) return 'Successful';
        }
    } catch (error) {
        console.log(error);
        return 'Server Error';
    }
    return 'Server Error';
};

export const DeleteDraft: DeleteDraft = async (id) => {
    if (!id) return 'Insufficient details';

    try {
        const draft = await prisma.draftPost.findUnique({
            where: { id: id }
        });

        if (!draft) return 'Insufficient details';
        if (draft.featuredImg) {
            const deleteImg = await deleteFirebaseFile(draft?.featuredImg);
        }
        const deleteDraft = await prisma.draftPost.delete({
            where: {
                id: id
            }
        });
        if (deleteDraft) return 'Successful';
    } catch (error) {
        return 'Server Error';
    }
    return 'Server Error';
};
