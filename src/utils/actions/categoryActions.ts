'use server';

import prisma from '../connect';
import { revalidatePath } from 'next/cache';
import { uploadFileToFirebase } from '@/lib/editor';

export async function createCategory(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const imageFile = formData.get('image') as string;

        if (!title || !slug) {
            throw new Error('Title and slug are required');
        }

        // Check if category with same slug exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        });

        if (existingCategory) {
            return { success: false, error: 'A category with this slug already exists' };
        }

        await prisma.category.create({
            data: {
                title,
                slug,
                img: imageFile
            }
        });

        revalidatePath('/categories');
        return { success: true };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Failed to create category' };
    }
}

export async function updateCategory(formData: FormData) {
    try {
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const imageFile = formData.get('image') as string;

        if (!id || !title || !slug) {
            throw new Error('ID, title and slug are required');
        }

        // Check if another category with same slug exists
        const existingCategory = await prisma.category.findFirst({
            where: {
                slug,
                NOT: {
                    id
                }
            }
        });

        if (existingCategory) {
            return { success: false, error: 'A category with this slug already exists' };
        }

        await prisma.category.update({
            where: { id },
            data: {
                title,
                slug,
                img: imageFile
            }
        });

        revalidatePath('/categories');
        return { success: true };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Failed to update category' };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id }
        });

        revalidatePath('/categories');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                title: 'asc'
            },
            include: {
                _count: {
                    select: {
                        news: true
                    }
                }
            }
        });
        return categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
