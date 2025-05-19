import dynamic from 'next/dynamic';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { getAvalilableCategories } from '@/utils/actions/adminActions';
import EditorSection from '@/views/EditorSection/Editor';

export default async function EditorPage() {
    const categories = await getAvalilableCategories();

    return (
        <MaxWidthWrapper className="relative py-5 px-[50px] max-w-none">
            <EditorSection categories={categories ? categories : []} />
        </MaxWidthWrapper>
    );
}
