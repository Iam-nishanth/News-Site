import dynamic from 'next/dynamic';
import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import { getAvalilableCategories } from '@/utils/actions/adminActions';
import EditorSection from '@/views/EditorSection/Editor';

export default async function EditorPage() {
    const categories = await getAvalilableCategories();
    const mappedCategories =
        categories?.map((cat) => ({
            ...cat,
            img: typeof cat.img === 'string' ? cat.img : undefined
        })) || [];

    return (
        <MaxWidthWrapper className="relative py-5 px-[50px] max-w-none">
            <EditorSection categories={mappedCategories} />
        </MaxWidthWrapper>
    );
}
