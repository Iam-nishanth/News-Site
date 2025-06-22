import React from 'react';
import { getDraft } from '@/utils/actions/draftActions';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { notFound, redirect } from 'next/navigation';
import ModifyPost from '@/views/ModifyPost';

interface Props {
    params: { id: string };
}

async function getData(id: string) {
    try {
        const draftPost = await getDraft(id);
        return draftPost;
    } catch (error) {
        console.error('Error fetching draft:', error);
        return null;
    }
}

const ModifyPostPage = async ({ params }: Props) => {
    const data = await getData(params.id);

    return <MaxWidthWrapper className="relative py-5 px-[50px] max-w-none">{data && <ModifyPost post={data} />}</MaxWidthWrapper>;
};

export default ModifyPostPage;
