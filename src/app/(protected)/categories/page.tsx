'use client';

import { useEffect, useState } from 'react';
import { CategoryDataTable } from './data-table';
import { getCategories } from '@/utils/actions/categoryActions';
import { toast } from 'sonner';
import Loader from '@/components/loader';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import AdminWrapper from '@/components/admin-components/AdminWrapper';

interface Category {
    id: string;
    title: string;
    slug: string;
    img: string | null;
    createdAt: string;
    _count: {
        news?: number;
    };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            const transformedData = data.map((cat) => ({
                ...cat,
                createdAt: cat.createdAt?.toISOString() || ''
            }));
            setCategories(transformedData);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Loader />
            </div>
        );
    }

    return (
        <AdminWrapper>
            <CategoryDataTable data={categories} onRefresh={loadCategories} />
        </AdminWrapper>
    );
}
