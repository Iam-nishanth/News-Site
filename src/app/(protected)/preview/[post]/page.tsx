import React, { Suspense } from 'react';
import './styles.css';
import { getDraft } from '@/utils/actions/draftActions';
import DraftPreview from '@/components/admin-components/DraftPreview';
import AdminWrapper from '@/components/admin-components/AdminWrapper';
import { notFound } from 'next/navigation';

interface Props {
    params: { post: string };
}

async function getData(id: string) {
    try {
        const draftPost = await getDraft(id);

        if (!draftPost) {
            console.error(`Draft not found with ID: ${id}`);
        }

        return draftPost;
    } catch (error) {
        console.error('Error fetching draft:', error);
        return null;
    }
}

const Previewpage = async ({ params }: Props) => {
    if (!params) {
        return notFound();
    }

    const postId = params.post;

    if (!postId) {
        return notFound();
    }

    const data = await getData(postId);

    if (!data) {
        return (
            <AdminWrapper className="max-w-screen-lg">
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold mb-4">Draft Not Found</h2>
                    <p className="mb-4">The draft you're looking for doesn't exist or has been deleted.</p>
                    <a href="/preview" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                        Return to Drafts
                    </a>
                </div>
            </AdminWrapper>
        );
    }

    const Post = [data].filter(Boolean);

    return (
        <AdminWrapper className="max-w-screen-lg">
            <Suspense fallback={<div>Loading...</div>}>
                <DraftPreview Post={Post} />
            </Suspense>
        </AdminWrapper>
    );
};

export default Previewpage;
