'use client';
import { Button } from '@/components/ui/button';
import { DeleteDraft, PublishDraft } from '@/utils/actions/draftActions';
import { DraftPost } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import './styles.css';
import { html } from '@yoopta/exports';
import { createYooptaEditor } from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import ImagePlugin from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';
import ReadonlyEditor from '@/components/ReadonlyEditor';
import { Badge } from '@/components/ui/badge';

// Memoize plugins
const plugins = [Paragraph, Accordion, HeadingOne, HeadingTwo, HeadingThree, Blockquote, Callout, NumberedList, BulletedList, TodoList, Code, Link, Embed, ImagePlugin, Video, File];

// Memoize marks
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

// Memoize tools
const TOOLS = {
    ActionMenu: {
        render: DefaultActionMenuRender,
        tool: ActionMenuList
    },
    Toolbar: {
        render: DefaultToolbarRender,
        tool: Toolbar
    },
    LinkTool: {
        render: DefaultLinkToolRender,
        tool: LinkTool
    }
};

// Separate component for action buttons
const ActionButtons = React.memo(({ onPublish, onDelete, onEdit, id }: { onPublish: () => void; onDelete: () => void; onEdit: () => void; id: string }) => (
    <div className="w-full flex justify-end gap-4 py-4 px-5">
        <Button type="button" variant="default" onClick={onPublish} className="uppercase font-semibold tracking-wider">
            Publish
        </Button>
        <Button onClick={onEdit}>Edit</Button>
        <Button type="button" variant="destructive" onClick={onDelete} className="uppercase font-semibold tracking-wider">
            Delete
        </Button>
    </div>
));

const DraftPreview = React.memo(({ Post }: { Post: DraftPost[] }) => {
    const router = useRouter();

    const handlePublish = useCallback(async () => {
        try {
            const response = await PublishDraft(Post[0]);
            if (response === 'Insufficient details') {
                toast.error('Insufficient details');
            } else if (response === 'Server Error') {
                toast.error('Something went wrong');
            } else if (response === 'Successful') {
                toast.success('Published Draft');
                router.push('/preview');
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    }, [Post, router]);

    const handleDelete = useCallback(async () => {
        try {
            const response = await DeleteDraft(Post[0].id);
            if (response === 'Insufficient details') {
                toast.error('Insufficient details');
            } else if (response === 'Server Error') {
                toast.error('Something went wrong');
            } else if (response === 'Successful') {
                toast.success('Deleted Draft');
                router.push('/preview');
                router.refresh();
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    }, [Post, router]);

    const handleEdit = useCallback(
        (id: string) => {
            router.push(`/editor/modify/${id}`);
        },
        [router]
    );

    return Post?.map((item, index) => (
        <div key={index} className="w-full pb-10">
            <ActionButtons onPublish={handlePublish} onDelete={handleDelete} onEdit={() => handleEdit(item.id)} id={item.id} />
            <div className="w-full">
                <h1 className="text-center text-2xl font-semibold mb-2">{item.title}</h1>
                {item.featuredImg && (
                    <div className="">
                        <div className="relative w-full max-w-[800px] aspect-[4/3] mx-auto overflow-hidden rounded-md">
                            <Image src={item.featuredImg} alt={item.title} fill className="object-cover" />
                        </div>
                        <p className="text-center text-sm mt-1 text-gray-600 dark:text-gray-400">{item.imgCaption}</p>
                    </div>
                )}
                <div className="w-full max-w-[800px] mx-auto">
                    <ReadonlyEditor content={item.content} />
                    {item?.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item?.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ));
});

DraftPreview.displayName = 'DraftPreview';
ActionButtons.displayName = 'ActionButtons';

export default DraftPreview;
