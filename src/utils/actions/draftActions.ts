'use server';
import { DraftPost } from '@prisma/client';
import prisma from '../connect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth';
import { deleteFirebaseFile } from '@/lib/editor';
import crypto from 'crypto';

export async function generateSlug(name: string): Promise<string> {
    let slug = name.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^a-z0-9\-]/g, '');
    return slug;
}

type DraftPostData = Omit<DraftPost, 'id' | 'slug' | 'userEmail' | 'createdAt' | 'updatedAt'> & {
    headingColor?: string;
    htmlContent?: string;
};

type DraftResponse = (post: DraftPostData) => Promise<'Insufficient details' | 'User not Exist' | 'Server Error' | 'Successful' | { message: string; id: string }>;

type ModifyDraftData = Omit<DraftPost, 'createdAt' | 'updatedAt' | 'userEmail' | 'slug'> & {
    headingColor?: string;
    htmlContent?: string;
};

type ModifyResponse = (post: ModifyDraftData) => Promise<'Insufficient Details' | 'User not Exist' | 'Server Error' | 'Success'>;

type PublishDraft = (post: Omit<DraftPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<'Insufficient details' | 'User not Exist' | 'Server Error' | 'Successful'>;
type DeleteDraft = (id: string) => Promise<'Insufficient details' | 'Server Error' | 'Successful'>;

export const createDraft: DraftResponse = async (post) => {
    const session = await getServerSession(authOptions);
    try {
        if (!post) return 'Insufficient details';
        if (!session?.user) return 'User not Exist';

        const response = await prisma.draftPost.create({
            data: {
                title: post.title,
                categorySlug: post.categorySlug.toLowerCase(),
                imgCaption: post.imgCaption,
                tags: post.tags,
                content: post.content,
                featuredImg: post.featuredImg,
                headingColor: post.headingColor || '#C70000',
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

        console.log('Updating draft with data:', {
            ...post
        });

        // Check if the draft exists first
        const existingDraft = await prisma.draftPost.findUnique({
            where: { id: post.id }
        });

        if (!existingDraft) {
            console.log('Draft not found');
            return 'Server Error';
        }

        // Use only the fields that are confirmed to exist in the schema
        const response = await prisma.draftPost.update({
            where: { id: post.id },
            data: {
                title: post.title,
                categorySlug: typeof post.categorySlug === 'string' ? post.categorySlug.toLowerCase() : post.categorySlug,
                imgCaption: post.imgCaption,
                tags: post.tags,
                content: post.content,
                featuredImg: post.featuredImg,
                headingColor: post.headingColor || '#000000'
                // Do not update userEmail as it should remain the same
            }
        });

        console.log('Response in modifyDraft', response);
        if (response) return 'Success';
    } catch (error) {
        console.error('Error in modifyDraft', error);
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
    console.log('id', id);
    if (!id) return;

    try {
        // // Check if ID is a valid MongoDB ObjectId (24 hex characters)
        // const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        // if (!isValidObjectId) {
        //     console.error(`Invalid ObjectID format: ${id}`);
        //     return null;
        // }

        const draft = await prisma.draftPost.findUnique({
            where: { id: id }
        });

        return draft;
    } catch (error) {
        console.error('Error fetching draft:', error);
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
                headingColor: post.headingColor || null,
                slug: post.slug,
                userEmail: post.userEmail,
                homeGridId: ''
            }
        });

        if (response) {
            const deleteDraft = await prisma.draftPost.delete({
                where: {
                    slug: post.slug
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
