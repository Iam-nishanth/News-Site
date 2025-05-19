import React, { Suspense } from 'react';
import './styles.css';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { getPostById, getSimilarPosts } from '@/utils/actions/userActions';
import NewsPreview from '@/components/NewsPreview';
import Spinner from '@/components/common/Spinner';

interface Props {
    params: { category: string; id: string };
}

async function getData(id: string) {
    try {
        const draftPost = await getPostById(id);
        return draftPost;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const Loader = () => (
    <div className=" fixed-height w-full justify-center items-center">
        <Spinner className="w-full flex justify-center items-center h-full" size="w-12 h-12" />{' '}
    </div>
);

const Previewpage = async ({ params }: Props) => {
    const data = await getData(params.id);
    const Post = data ? [data] : [];
    const similarData = await getSimilarPosts(data?.tags ?? []);

    return (
        <MaxWidthWrapper className="max-w-screen-lg">
            <Suspense fallback={<Loader />}>
                <NewsPreview
                    Post={Post.map((post) => ({
                        ...post,
                        categorySlug: post.categorySlug || '' // Convert null to empty string
                    }))}
                    similar={similarData
                        ?.filter((item) => item.id !== params.id)
                        ?.map((item) => ({
                            ...item,
                            categorySlug: item.categorySlug || '' // Convert null to empty string
                        }))}
                />
            </Suspense>
        </MaxWidthWrapper>
    );
};

export default Previewpage;
