'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, ColumnFiltersState, getFilteredRowModel, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Filter, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/ui/image-upload';
import { createCategory, deleteCategory, updateCategory } from '@/utils/actions/categoryActions';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingButton } from '@/components/ui/loadingButton';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase and contain only letters, numbers, and hyphens'),
    image: z.string().optional()
});

interface Category {
    id: string;
    title: string;
    slug: string;
    img: string | null;
    createdAt: string;
    _count: {
        news?: number;
    };
}

interface DataTableProps {
    data: Category[];
    onRefresh: () => void;
}

export function CategoryDataTable({ data, onRefresh }: DataTableProps) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedFilterField, setSelectedFilterField] = useState<string>('title');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            slug: '',
            image: ''
        }
    });

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: 'img',
            header: 'Image',
            cell: ({ row }) => {
                const img = row.getValue('img') as string | null;
                return img ? <Image src={img} alt="Category" width={50} height={50} className="rounded-md" /> : '-NA-';
            }
        },
        {
            accessorKey: 'title',
            header: 'Title'
        },
        {
            accessorKey: 'slug',
            header: 'Slug'
        },
        {
            accessorKey: 'newsCount',
            header: 'News Count',
            cell: ({ row }) => {
                const newsCount = row.original?._count?.news;
                return newsCount ? newsCount.toString() : 'None';
            }
        },
        {
            accessorKey: 'createdAt',
            header: 'Created At',
            cell: ({ row }) => {
                const createdAt = row.getValue('createdAt');
                return createdAt ? new Date(createdAt as string).toLocaleDateString() : 'N/A';
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const category = row.original;
                return (
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setCategoryToDelete(category);
                                setIsDeleteDialogOpen(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('slug', values.slug);
        if (uploadedFileUrl) {
            formData.append('image', uploadedFileUrl);
        }

        try {
            if (editingCategory) {
                formData.append('id', editingCategory.id);
                const result = await updateCategory(formData);
                if (result.success) {
                    toast.success('Category updated successfully');
                } else {
                    throw new Error(result.error);
                }
            } else {
                const result = await createCategory(formData);
                if (result.success) {
                    toast.success('Category created successfully');
                } else {
                    throw new Error(result.error);
                }
            }
            setIsDialogOpen(false);
            resetForm();
            onRefresh();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;

        try {
            const result = await deleteCategory(categoryToDelete.id);
            if (result.success) {
                toast.success('Category deleted successfully');
                onRefresh();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        } finally {
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        }
    };

    const resetForm = () => {
        form.reset();
        setUploadedFileUrl(null);
        setEditingCategory(null);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        form.reset({
            title: category.title,
            slug: category.slug,
            image: category.img || ''
        });
        setUploadedFileUrl(category.img);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <div className="w-full flex justify-between items-center gap-3">
                <div className="flex items-center py-4 gap-3">
                    <Select onValueChange={(value) => setSelectedFilterField(value)}>
                        <SelectTrigger className="w-auto h-12" showChevron={false}>
                            <Filter className="w-4 h-4" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Fields</SelectLabel>
                                <SelectItem value="title">Title</SelectItem>
                                <SelectItem value="slug">Slug</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder={`Filter ${selectedFilterField}`}
                        value={(table.getColumn(selectedFilterField)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn(selectedFilterField)?.setFilterValue(event.target.value)}
                        className="max-w-[250px]"
                    />
                </div>

                <div className="flex items-center">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12" variant="outline" size="icon" onClick={() => resetForm()}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Slug</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="e.g., my-category" />
                                                </FormControl>
                                                <p className="text-sm text-muted-foreground">This must be unique and will be used in URLs</p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <ImageUpload onFileUpload={setUploadedFileUrl} />
                                        </FormControl>
                                        {uploadedFileUrl && (
                                            <div className="mt-2">
                                                <Image src={uploadedFileUrl} alt="Category preview" width={100} height={100} className="rounded-md" />
                                            </div>
                                        )}
                                    </FormItem>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
                                            {editingCategory ? 'Update' : 'Create'}
                                        </LoadingButton>
                                    </div>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="rounded-md border-input border-2">
                <Table className="border-none">
                    <TableHeader className="border-none">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="border-none border-b">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="border-none">
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this category? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
