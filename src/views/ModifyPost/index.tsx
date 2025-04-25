/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import { useTheme } from 'next-themes';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loadingButton';
import '../EditorSection/styles.css';
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

export default function ModifyPost({ post }: { post: DraftPost }) {
    const { theme: activeTheme } = useTheme();

    const [preview, setPreview] = useState<boolean>(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter();

    useEffect(() => {
        setValue('title', post.title);
        setValue('categorySlug', post.categorySlug);
        setValue('imgCaption', post.imgCaption ?? '');
        setUploadedFileUrl(post.featuredImg);
    }, []);

    const initialHTML = post.content;

    const editor = useCreateBlockNote();

    const htmlInputChanged = useCallback(
        async (e: ChangeEvent<HTMLTextAreaElement>) => {
            // Whenever the current HTML content changes, converts it to an array of
            // Block objects and replaces the editor's content with them.
            const blocks = await editor.tryParseHTMLToBlocks(e.target.value);
            editor.replaceBlocks(editor.document, blocks);
        },
        [editor]
    );

    // For initialization; on mount, convert the initial HTML to blocks and replace the default editor's content
    useEffect(() => {
        async function loadInitialHTML() {
            const blocks = await editor.tryParseHTMLToBlocks(initialHTML);
            editor.replaceBlocks(editor.document, blocks);
        }
        loadInitialHTML();
    }, [editor]);

    const FormSchema = z.object({
        title: z.string().min(1, 'Username is required').max(100),
        categorySlug: z.string().min(1, 'Category is required').max(100),
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
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit = async (data: FormType) => {
        const editorHTML = await editor.blocksToHTMLLossy(editor.document);
        const formData = {
            ...data,
            id: post.id,
            content: editorHTML,
            featuredImg: uploadedFileUrl,
            tags: data.tags.map((tag) => tag.text)
        };
        console.log('Final Data: ', formData);

        try {
            const SaveDraft = await modifyDraft(formData);
            if (SaveDraft == 'Insufficient Details') {
                toast.error('Insufficient details', { position: 'top-right' });
            } else if (SaveDraft == 'Server Error') {
                toast.error('Something went wrong', { position: 'top-right' });
            }
            toast.success('Saved Draft', { position: 'top-right' });
            setPreview(true);
        } catch (error) {}
    };

    const handleOk = () => {
        router.push('/preview');
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                <div className="space-y-2">
                    <Label className={cn('pl-2 text-base font-medium', errors?.title && 'text-red-600')}>
                        Title <span className="text-red-600">*</span>
                    </Label>
                    <Input {...register('title')} placeholder="Enter you title" />
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
                    <BlockNoteView
                        editor={editor}
                        theme={
                            activeTheme === 'dark'
                                ? 'dark'
                                : activeTheme === 'light'
                                ? 'light'
                                : activeTheme === 'system'
                                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                                    ? 'dark'
                                    : 'light'
                                : 'light'
                        }
                    />
                </div>

                <div className="w-full flex justify-end gap-5">
                    <LoadingButton loading={isSubmitting} disabled={isSubmitting || preview} type="submit" variant="default" className="uppercase font-semibold tracking-wider w-44">
                        {isSubmitting ? 'Please wait' : 'Save'}
                    </LoadingButton>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <LoadingButton variant="outline" disabled={!preview} className="uppercase font-semibold tracking-wider w-36">
                                Preview
                            </LoadingButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure this is saved?</AlertDialogTitle>
                                <AlertDialogDescription>On clicking continue you will be redirected drafts page. Make sure you the post is saved.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleOk}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </form>
        </div>
    );
}
