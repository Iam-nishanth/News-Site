/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loadingButton';
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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { modifyDraft } from '@/utils/actions/draftActions';
import { DraftPost } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import YooptaEditor, { createYooptaEditor, useYooptaEditor, YooptaPlugin, YooptaContentValue } from '@yoopta/editor';
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
import { html } from '@yoopta/exports';
import { Separator } from '@/components/ui/separator';

const code = Code.getPlugin;
code.elements.code.props!.theme = 'GithubLight';

const modCodePlugin = new YooptaPlugin(code);
const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];
const plugins = [Paragraph, Accordion, HeadingOne, HeadingTwo, HeadingThree, Blockquote, Callout, NumberedList, BulletedList, TodoList, modCodePlugin, Link, Embed, ImagePlugin, Video, File];

// Memoize the editor configuration
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

// Helper function to convert HTML to Yoopta editor content
const convertHtmlToYooptaContent = (htmlContent: string): YooptaContentValue => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Process each node in the HTML
    const processNode = (node: Node, order: number = 0): any => {
        const id = `node-${order}-${Math.random().toString(36).substr(2, 9)}`;

        if (node.nodeType === Node.TEXT_NODE) {
            return {
                text: node.textContent || ''
            };
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const tagName = element.tagName.toLowerCase();

            let type = 'Paragraph';
            if (tagName === 'h1') type = 'HeadingOne';
            else if (tagName === 'h2') type = 'HeadingTwo';
            else if (tagName === 'h3') type = 'HeadingThree';
            else if (tagName === 'blockquote') type = 'Blockquote';
            else if (tagName === 'ul') type = 'BulletedList';
            else if (tagName === 'ol') type = 'NumberedList';
            else if (tagName === 'code') type = 'Code';
            else if (tagName === 'img') {
                return {
                    id,
                    type: 'Image',
                    meta: { order },
                    value: [
                        {
                            id: `image-${order}`,
                            type: 'image',
                            children: [{ text: '' }],
                            props: {
                                src: element.getAttribute('src') || '',
                                alt: element.getAttribute('alt') || '',
                                nodeType: 'void'
                            }
                        }
                    ]
                };
            }

            // Special handling for headings
            if (type.startsWith('Heading')) {
                const headingType = type.toLowerCase();
                return {
                    id,
                    type,
                    meta: { order },
                    value: [
                        {
                            id: `${headingType}-${order}`,
                            type: headingType,
                            children: [
                                {
                                    text: element.textContent || ''
                                }
                            ],
                            props: {
                                nodeType: 'block',
                                className: headingType
                            }
                        }
                    ]
                };
            }

            // Handle lists
            if (type === 'BulletedList' || type === 'NumberedList') {
                const listItems = Array.from(element.children).map((item, index) => ({
                    id: `list-item-${order}-${index}`,
                    type: 'list-item',
                    children: [
                        {
                            text: item.textContent || ''
                        }
                    ],
                    props: {
                        nodeType: 'block'
                    }
                }));

                return {
                    id,
                    type,
                    meta: { order },
                    value: listItems
                };
            }

            // For other elements, process children normally
            const children = Array.from(node.childNodes).map((child, index) => processNode(child, order + index));

            return {
                id,
                type,
                meta: { order },
                value: [
                    {
                        id: `${type.toLowerCase()}-${order}`,
                        type: type.toLowerCase(),
                        children: children,
                        props: {
                            nodeType: 'block'
                        }
                    }
                ]
            };
        }

        return null;
    };

    // Process all top-level nodes
    const nodes = Array.from(tempDiv.childNodes);
    const content: YooptaContentValue = {};

    nodes.forEach((node, index) => {
        const processedNode = processNode(node, index);
        if (processedNode) {
            content[processedNode.id] = processedNode;
        }
    });

    return content;
};

const ModifyPost = React.memo(({ post }: { post: DraftPost }) => {
    const { theme: activeTheme } = useTheme();
    const selectionRef = useRef(null);
    const [preview, setPreview] = useState<boolean>(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [headingColor, setHeadingColor] = useState<string>(post.headingColor || '#C70000');
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter();

    const FormSchema = z.object({
        title: z.string().min(1, 'Username is required').max(100),
        categorySlug: z.string().min(1, 'Category is required').max(100),
        imgCaption: z.string().min(1, 'Image caption is required').max(200),
        headingColor: z.string().min(1, 'Heading color is required').max(100),
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
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    });

    // Memoize the editor instance
    const editor = useMemo(() => {
        const yooptaEditor = createYooptaEditor();
        return yooptaEditor;
    }, []);

    // Memoize content state
    const [content, setContent] = useState<YooptaContentValue>({});
    const [manuallyUpdated, setManuallyUpdated] = useState(false);

    // Initialize form and editor content
    useEffect(() => {
        if (post) {
            setValue('title', post.title);
            setValue('categorySlug', post.categorySlug ?? '');
            setValue('imgCaption', post.imgCaption ?? '');
            setValue('headingColor', post.headingColor || '#000000');
            setUploadedFileUrl(post.featuredImg);

            const initialTags = post.tags.map((tag, index) => ({ id: index.toString(), text: tag }));
            setValue('tags', initialTags);
            setTags(initialTags);

            if (post.content) {
                try {
                    // Parse the JSON content from the database
                    const parsedContent = JSON.parse(post.content);
                    setContent(parsedContent);
                    editor.setEditorValue(parsedContent);

                    // Generate initial preview content
                    try {
                        const htmlString = html.serialize(editor, parsedContent);
                        if (htmlString) {
                            setPreviewContent(htmlString);
                        }
                    } catch (serializeError) {
                        console.error('Initial serialization error:', serializeError);
                    }
                } catch (error) {
                    console.error('Error parsing content:', error);
                    // Fallback to empty content if parsing fails
                    const emptyContent = {
                        'title-0000-0000-00000-0000000000000': {
                            id: 'title-0000-0000-00000-0000000000000',
                            type: 'Paragraph',
                            meta: {
                                order: 0,
                                depth: 0
                            },
                            value: [
                                {
                                    id: 'paragraph-0000-0000-0000000000000',
                                    type: 'paragraph',
                                    children: [{ text: '' }],
                                    props: {
                                        nodeType: 'block'
                                    }
                                }
                            ]
                        }
                    };
                    setContent(emptyContent);
                    editor.setEditorValue(emptyContent);
                }
            }
        }
    }, [post, editor, setValue]);

    // Add paste event listener to the editor
    useEffect(() => {
        let mounted = true;

        setTimeout(() => {
            if (!mounted) return;

            const editorElement = document.querySelector('.yoopta-editor');
            if (editorElement) {
                const pasteHandler = () => {
                    // Use setTimeout to allow the paste to complete
                    setTimeout(() => {
                        try {
                            const newContent = editor.getEditorValue();
                            if (newContent && Object.keys(newContent).length > 0) {
                                setContent(newContent);
                                setManuallyUpdated(true);

                                // Update preview content
                                try {
                                    const htmlString = html.serialize(editor, newContent);
                                    if (htmlString) {
                                        setPreviewContent(htmlString);
                                    }
                                } catch (serializeError) {
                                    console.error('Paste serialization error:', serializeError);
                                }

                                console.log('Content updated after paste');
                            }
                        } catch (error) {
                            console.error('Error handling paste:', error);
                        }
                    }, 300); // Increased timeout for better paste handling
                };

                editorElement.addEventListener('paste', pasteHandler);

                // Store the handler for cleanup
                if (mounted) {
                    (editorElement as any)._pasteHandler = pasteHandler;
                }
            }
        }, 500);

        return () => {
            mounted = false;
            // Remove the paste event listener
            const editorElement = document.querySelector('.yoopta-editor');
            if (editorElement && (editorElement as any)._pasteHandler) {
                editorElement.removeEventListener('paste', (editorElement as any)._pasteHandler);
                (editorElement as any)._pasteHandler = null;
            }
        };
    }, [editor]);

    // Memoize editor change handler
    const handleEditorChange = useCallback(() => {
        try {
            const editorContent = editor.getEditorValue();
            if (editorContent && Object.keys(editorContent).length > 0) {
                setContent(editorContent);
                setManuallyUpdated(true);

                // Update preview content
                try {
                    const htmlString = html.serialize(editor, editorContent);
                    if (htmlString) {
                        setPreviewContent(htmlString);
                    }
                } catch (serializeError) {
                    console.error('Serialization error in handleEditorChange:', serializeError);
                }
            }
        } catch (error) {
            console.error('Error in handleEditorChange:', error);
        }
    }, [editor]);

    // Set up editor change listener
    useEffect(() => {
        if (editor) {
            editor.on('change', handleEditorChange);
            return () => {
                editor.off('change', handleEditorChange);
            };
        }
    }, [editor, handleEditorChange]);

    // Memoize form submission handler
    const onSubmit = useCallback(
        async (data: FormType) => {
            // Get the latest content directly from editor
            let currentContent;
            try {
                // Get current content from editor
                currentContent = editor.getEditorValue();

                // Check if we've manually updated the content or if the content is empty
                if ((!currentContent || Object.keys(currentContent).length === 0) && manuallyUpdated) {
                    // Use our React state content if the editor returns empty but we know it's been updated
                    currentContent = content;
                    console.log('Using state content instead of editor content');
                }

                // Final check to ensure we have content
                if (!currentContent || Object.keys(currentContent).length === 0) {
                    toast.error('Please add some content to the editor');
                    return;
                }
            } catch (error) {
                console.error('Error getting editor content:', error);
                // Use state as fallback if editor access fails
                if (manuallyUpdated) {
                    currentContent = content;
                }

                if (!currentContent || Object.keys(currentContent).length === 0) {
                    toast.error('Please add some content to the editor');
                    return;
                }
            }

            const htmlContent = html.serialize(editor, currentContent);

            // Ensure all fields match exactly with the Prisma schema
            const formData = {
                id: post.id,
                title: data.title,
                categorySlug: data.categorySlug,
                imgCaption: data.imgCaption,
                tags: data.tags.map((tag) => tag.text),
                content: JSON.stringify(currentContent),
                featuredImg: uploadedFileUrl || '',
                headingColor: headingColor || '#C70000'
            };

            try {
                const SaveDraft = await modifyDraft(formData);
                if (SaveDraft === 'Insufficient Details') {
                    toast.error('Insufficient details', { position: 'top-right' });
                } else if (SaveDraft === 'Server Error' || SaveDraft === 'User not Exist') {
                    toast.error('Something went wrong', { position: 'top-right' });
                } else {
                    toast.success('Saved Draft', { position: 'top-right' });
                    setPreview(true);
                }
                handleOk();
            } catch (error) {
                console.error('Draft save error:', error);
                toast.error('Failed to save draft', { position: 'top-right' });
            }
        },
        [editor, post.id, uploadedFileUrl, headingColor, content, manuallyUpdated]
    );

    // Memoize navigation handler
    const handleOk = useCallback(() => {
        router.push('/preview');
    }, [router]);

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
                                        const newColor = e.target.value;
                                        setHeadingColor(newColor);
                                        setValue('headingColor', newColor);
                                    }}
                                    className="w-12 h-12 p-1 rounded-md border border-input cursor-pointer"
                                />
                            </div>
                        </div>
                        {errors?.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
                            Category <span className="text-red-600">*</span>
                        </Label>
                        <Input {...register('categorySlug')} placeholder="Enter you title" />
                        {errors?.categorySlug && <p className="text-red-500">{errors.categorySlug.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
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
                        {uploadedFileUrl && (
                            <div className="flex gap-4 items-center">
                                <Image src={uploadedFileUrl as string} alt={post.imgCaption ? post.imgCaption : 'Post Image'} width={100} height={60} />
                                <Button type="button" size="icon" variant="ghost" onClick={() => setUploadedFileUrl(null)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
                            Image Caption <span className="text-red-600">*</span>
                        </Label>
                        <Input {...register('imgCaption')} placeholder="Enter you title" />
                        {errors?.imgCaption && <p className="text-red-500">{errors.imgCaption.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
                            News Content <span className="text-red-600">*</span>
                        </Label>
                        <div className="w-full px-12 border-2 border-input rounded-md">
                            <YooptaEditor
                                className="w-full yoopta-editor"
                                style={{
                                    width: '100% !important'
                                }}
                                editor={editor}
                                plugins={plugins}
                                tools={TOOLS}
                                marks={MARKS}
                                selectionBoxRoot={selectionRef}
                                value={content}
                                onChange={(newContent) => {
                                    if (newContent && Object.keys(newContent).length > 0) {
                                        try {
                                            // Update React state with the editor content
                                            setContent(newContent);
                                            setManuallyUpdated(true);

                                            // Update preview content
                                            try {
                                                const htmlString = html.serialize(editor, newContent);
                                                if (htmlString) {
                                                    setPreviewContent(htmlString);
                                                }
                                            } catch (serializeError) {
                                                console.error('Serialization error:', serializeError);
                                            }

                                            console.log('Content updated in onChange handler');
                                        } catch (error) {
                                            console.error('Error updating content:', error);
                                        }
                                    }
                                }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="space-y-2 w-full flex justify-end">
                        <LoadingButton
                            type="button"
                            className="px-4 py-2 font-semibold tracking-wider rounded-md"
                            onClick={() => {
                                try {
                                    if (!editor) {
                                        toast.error('Editor not ready');
                                        return;
                                    }

                                    const currentContent = editor.getEditorValue();
                                    if (!currentContent) {
                                        toast.error('No content to preview');
                                        return;
                                    }

                                    const htmlString = html.serialize(editor, currentContent);
                                    setPreviewContent(htmlString);
                                    toast.success('Preview refreshed');
                                } catch (error) {
                                    console.error('Preview error:', error);
                                    toast.error('Failed to refresh preview');
                                }
                            }}
                        >
                            Refresh Preview
                        </LoadingButton>
                    </div>
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
                                    loading={isSubmitting}
                                    disabled={isSubmitting}
                                    type="submit"
                                    variant="default"
                                    className="uppercase font-semibold tracking-wider w-44"
                                    onClick={handleSubmit(onSubmit)}
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
                            <div
                                className="preview-content [&_iframe]:w-full [&_iframe]:aspect-video p-4 rounded-md"
                                dangerouslySetInnerHTML={{ __html: previewContent || '<p>Preview will appear here</p>' }}
                                style={{ minHeight: '300px' }}
                            />
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
});

ModifyPost.displayName = 'ModifyPost';

export default ModifyPost;
