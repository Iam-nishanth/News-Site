import React from 'react';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { getAvalilableCategories } from '@/utils/actions/adminActions';
import EditorWrapper from '@/components/EditorWrapper';

export default async function EditorPage() {
    const categories = await getAvalilableCategories();

    return (
        <MaxWidthWrapper className="relative py-5 max-w-screen-2xl">
            <EditorWrapper categories={categories || []} />
        </MaxWidthWrapper>
    );
}
