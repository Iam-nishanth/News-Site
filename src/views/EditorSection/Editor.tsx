'use client';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loadingButton';
import { uploadFileToFirebase } from '@/lib/editor';
import { cn } from '@/lib/utils';
import ImageUpload from '@/components/ui/image-upload';
import { Tag, TagInput } from '@/components/ui/tags/tag-input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createDraft } from '@/utils/actions/draftActions';
import YooptaEditor, { createYooptaEditor, Elements, Blocks, useYooptaEditor, YooptaPlugin, YooptaContentValue } from '@yoopta/editor';
import { Separator } from '@/components/ui/separator';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
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
import { html } from '@yoopta/exports';

interface Props {
    categories: string[];
}
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const plugins = [
    Paragraph,
    Accordion,
    HeadingOne,
    HeadingTwo,
    HeadingThree,
    Blockquote,
    Callout,
    NumberedList,
    BulletedList,
    Link,
    Image.extend({
        options: {
            async onUpload(file) {
                const imageUrl = await uploadFileToFirebase(file);

                return {
                    src: imageUrl,
                    alt: 'firebase - ' + file.name
                };
            }
        }
    })
];

// Define initial content outside the component
const initialContent = {
    'title-0000-0000-00000-0000000000000': {
        id: 'title-0000-0000-00000-0000000000000',
        type: 'HeadingOne',
        meta: {
            order: 0,
            depth: 0
        },
        value: [
            {
                id: 'heading-one-0000-0000-0000000000000',
                type: 'heading-one',
                children: [
                    {
                        text: 'Write about your article here'
                    }
                ]
            }
        ]
    },
    'title-0000-0000-00000-0000000000001': {
        id: 'title-0000-0000-00000-0000000000001',
        type: 'Paragraph',
        meta: {
            order: 1,
            depth: 0
        },
        value: [
            {
                id: 'paragraph-0000-0000-0000000000001',
                type: 'paragraph',
                children: [
                    {
                        text: 'Write a compelling article here'
                    }
                ]
            }
        ]
    },
    'title-0000-0000-00000-0000000000002': {
        id: 'title-0000-0000-00000-0000000000002',
        type: 'Paragraph',
        meta: {
            order: 2,
            depth: 0
        },
        value: [
            {
                id: 'paragraph-0000-0000-0000000000002',
                type: 'paragraph',
                children: [
                    {
                        text: "Don't forget to remove this text though, :)"
                    }
                ]
            }
        ]
    }
};

export default function Editor({ categories }: Props) {
    const { theme: activeTheme } = useTheme();
    const selectionRef = useRef(null);
    const [content, setContent] = useState<YooptaContentValue>(initialContent);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [previewId, setPreviewId] = useState<string>('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter();
    const [headingColor, setHeadingColor] = useState('#ffffff');

    // Define TOOLS inside the component using the render functions
    const TOOLS = useMemo(
        () => ({
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
        }),
        []
    );

    // Create the editor instance
    const editor = useMemo(() => {
        return createYooptaEditor();
    }, []);

    // Initialize editor with content
    useEffect(() => {
        if (editor) {
            editor.setEditorValue(initialContent);
        }
    }, [editor]);

    // Listen for editor content changes
    useEffect(() => {
        if (editor) {
            const handleEditorChange = () => {
                try {
                    const editorContent = editor.getEditorValue();
                    setContent(editorContent);
                    const htmlContent = html.serialize(editor, editorContent);
                    setPreviewContent(htmlContent);
                } catch (error) {
                    console.error('Error updating preview:', error);
                }
            };

            // Initial content update
            handleEditorChange();

            // Subscribe to changes
            editor.on('change', handleEditorChange);
            return () => {
                editor.off('change', handleEditorChange);
            };
        }
    }, [editor]);

    const uploadFileWrapper = async (file: File) => {
        return await uploadFileToFirebase(file);
    };

    console.log('HTML Content: ', html.serialize(editor, content));
    console.log('Yoopta Content: ', content);

    const FormSchema = z.object({
        title: z.string().min(1, 'Title is required').max(100),
        headingColor: z.string().default('#ffffff').optional(),
        categorySlug: z.string().min(1, 'Category is required'),
        imgCaption: z.string().min(1, 'Image caption is required').max(200),
        tags: z.array(
            z.object({
                id: z.string(),
                text: z.string()
            })
        )
    });

    type FormType = z.infer<typeof FormSchema>;
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors, isSubmitting },
        watch
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    });

    // Convert to HTML when saving
    const onSubmit = async (data: FormType) => {
        // Ensure we have the latest content
        const currentContent = editor.getEditorValue();
        if (!currentContent || Object.keys(currentContent).length === 0) {
            toast.error('Please add some content to the editor');
            return;
        }

        const formData = {
            ...data,
            title: `${data.title} ${data.headingColor}`,
            content: JSON.stringify(currentContent),
            htmlContent: html.serialize(editor, currentContent),
            featuredImg: uploadedFileUrl,
            tags: data.tags.map((tag) => tag.text)
        };

        console.log('Current Content:', currentContent);
        console.log('Final Data:', formData);

        try {
            const SaveDraft = await createDraft({
                ...formData,
                content: JSON.stringify(currentContent),
                htmlContent: html.serialize(editor, currentContent)
            });
            if (typeof SaveDraft === 'string') {
                if (SaveDraft === 'Insufficient details') {
                    toast.error('Insufficient details', { position: 'top-right' });
                } else if (SaveDraft === 'Server Error') {
                    toast.error('Something went wrong', { position: 'top-right' });
                }
            } else if (SaveDraft?.message === 'Successful') {
                toast.success('Saved Draft', { position: 'top-right' });
                setPreview(true);
            }
        } catch (error) {
            toast.error('Failed to save draft', { position: 'top-right' });
        }
    };

    const offlineCategories = ['Sports', 'Business', 'Lifestyle', 'Politics', 'Technology'];

    const handleOk = () => {
        if (previewId !== '') router.push(`/preview/${previewId}`);
        else router.push('/preview');
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div ref={selectionRef} className="flex-1">
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
                            Title <span className="text-red-600">*</span>
                        </Label>
                        <div className="flex items-center gap-4">
                            <Input {...register('title')} placeholder="Enter you title" className="flex-1" />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="color"
                                    value={headingColor}
                                    onChange={(e) => {
                                        setHeadingColor(e.target.value);
                                        setValue('headingColor', e.target.value);
                                    }}
                                    className="w-12 h-12 p-1 rounded-md border border-input cursor-pointer"
                                />
                            </div>
                        </div>
                        {errors?.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.categorySlug && 'text-red-600')}>
                            Category <span className="text-red-600">*</span>
                        </Label>
                        <Controller
                            name="categorySlug"
                            control={control}
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            {categories?.length > 0
                                                ? categories.map((item, index) => (
                                                      <SelectItem key={index} value={item}>
                                                          {item}
                                                      </SelectItem>
                                                  ))
                                                : offlineCategories.map((item, index) => (
                                                      <SelectItem key={index} value={item}>
                                                          {item}
                                                      </SelectItem>
                                                  ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.categorySlug && <p className="text-red-500">{errors.categorySlug.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.tags && 'text-red-600')}>
                            Tags <span className="text-red-600">*</span>
                        </Label>
                        <TagInput
                            {...register('tags')}
                            placeholder="Enter a topic"
                            tags={tags}
                            className="sm:min-w-[450px]"
                            size="sm"
                            shape="pill"
                            borderStyle="none"
                            setTags={(newTags) => {
                                setTags(newTags);
                                setValue('tags', newTags as [Tag, ...Tag[]]);
                            }}
                        />
                        {errors?.tags && <p className="text-red-500">{errors.tags.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="pl-2 text-base font-medium">
                            Featured Image <span className="text-red-600">*</span>
                        </Label>
                        <ImageUpload onFileUpload={setUploadedFileUrl} />
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.imgCaption && 'text-red-600')}>
                            Image Caption <span className="text-red-600">*</span>
                        </Label>
                        <Input {...register('imgCaption')} placeholder="Enter you title" />
                        {errors?.imgCaption && <p className="text-red-500">{errors.imgCaption.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium')}>News Content</Label>
                        <div className="w-full px-12 border-2 border-input rounded-md">
                            <YooptaEditor
                                className="w-full"
                                style={{
                                    width: '100% !important',
                                    padding: '0'
                                }}
                                editor={editor}
                                plugins={plugins}
                                tools={TOOLS}
                                marks={MARKS}
                                selectionBoxRoot={selectionRef}
                                value={content}
                                onChange={(newContent) => {
                                    setContent(newContent);
                                    try {
                                        const htmlContent = html.serialize(editor, newContent);
                                        setPreviewContent(htmlContent);
                                    } catch (error) {
                                        console.error('Error updating preview:', error);
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <button type="button" className=" sr-only w-full bg-primary text-white py-2 rounded-md">
                        Save
                    </button>
                </form>
            </div>

            <Separator orientation="vertical" className="hidden lg:block" />

            <div className="flex-1 lg:max-w-[700px]">
                <div className="sticky top-0">
                    <div className="p-4 border rounded-lg shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg w-fit text-nowrap font-semibold mb-4">Live Preview</h3>
                            <div className="w-full flex justify-end gap-5">
                                <LoadingButton
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isSubmitting}
                                    disabled={isSubmitting || preview}
                                    type="submit"
                                    variant="default"
                                    className="uppercase font-semibold tracking-wider w-44"
                                >
                                    {isSubmitting ? 'Please wait' : 'Save'}
                                </LoadingButton>
                            </div>
                        </div>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <div
                                className="preview-content text-center"
                                style={{
                                    color: headingColor,
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '1rem'
                                }}
                            >
                                {watch('title')}
                            </div>
                            {uploadedFileUrl && (
                                <div className="mb-4 flex flex-col items-center gap-0">
                                    <img src={uploadedFileUrl} alt={watch('imgCaption')} className="w-full rounded-sm object-contain h-[400px] m-0" />
                                    <p className="text-sm text-muted-foreground text-center">{watch('imgCaption')}</p>
                                </div>
                            )}
                            <div className="preview-content [&_iframe]:w-full [&_iframe]:aspect-video" dangerouslySetInnerHTML={{ __html: previewContent || '' }} />
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {tags.map((tag) => (
                                        <span key={tag.id} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                            {tag.text}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
