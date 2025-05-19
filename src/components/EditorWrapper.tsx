'use client';

import dynamic from 'next/dynamic';
import { Category } from '@prisma/client';

const EditorSection = dynamic(() => import('@/views/EditorSection/Editor'), {
    ssr: false
});

interface EditorWrapperProps {
    categories: Category[];
}

const EditorWrapper = ({ categories }: EditorWrapperProps) => {
    const categorySlugs = categories.map((category) => category.slug);
    return <EditorSection categories={categorySlugs} />;
};

export default EditorWrapper;
