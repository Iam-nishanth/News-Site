'use client';
import { useContext, useState, useEffect, useRef, useMemo } from 'react';
import YooptaEditor, { createYooptaEditor, Elements, Blocks, useYooptaEditor, YooptaPlugin } from '@yoopta/editor';

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
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loadingButton';
import './styles.css';
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
import { useTheme } from 'next-themes';
import TextEditor from '@/components/TextEditor';

const code = Code.getPlugin;

const modCodePlugin = new YooptaPlugin(code);
const plugins = [Paragraph, Accordion, HeadingOne, HeadingTwo, HeadingThree, Blockquote, Callout, NumberedList, BulletedList, TodoList, modCodePlugin, Link, Embed, Image, Video, File];

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

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

interface Props {
    categories: string[];
}

export default function EditorSection({ categories }: Props) {
    const [HTML, setHTML] = useState<string>('');
    const [preview, setPreview] = useState<boolean>(false);
    const [previewId, setPreviewId] = useState<string>('');
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter();
    const selectionRef = useRef(null);
    const { theme } = useTheme();

    const editor = useMemo(() => createYooptaEditor(), []);

    const FormSchema = z.object({
        title: z.string().min(1, 'Username is required').max(100),
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
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit = async (data: FormType) => {
        const formData = {
            ...data,
            content: HTML,
            featuredImg: uploadedFileUrl,
            tags: data.tags.map((tag) => tag.text)
        };

        try {
            const SaveDraft = await createDraft(formData);
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
        } catch (error) {}
    };

    const offlineCategories = ['Sports', 'Business', 'Lifestyle', 'Politics', 'Technology'];

    const handleOk = () => {
        if (previewId !== '') router.push(`/preview/${previewId}`);
        else router.push('/preview');
    };

    const editorTheme = {
        light: {
            background: 'hsl(var(--background))',
            text: 'hsl(var(--foreground))',
            border: 'hsl(var(--border))',
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--secondary))',
            accent: 'hsl(var(--accent))',
            muted: 'hsl(var(--muted))',
            popover: 'hsl(var(--popover))',
            card: 'hsl(var(--card))'
        },
        dark: {
            background: 'hsl(var(--background))',
            text: 'hsl(var(--foreground))',
            border: 'hsl(var(--border))',
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--secondary))',
            accent: 'hsl(var(--accent))',
            muted: 'hsl(var(--muted))',
            popover: 'hsl(var(--popover))',
            card: 'hsl(var(--card))'
        }
    };

    const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

    const themeColors = editorTheme[currentTheme as keyof typeof editorTheme];

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
                                        {categories.length > 0
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
                    <div className="flex justify-center h-full w-full border-2 border-input rounded-md" ref={selectionRef}>
                        <TextEditor />
                    </div>
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
