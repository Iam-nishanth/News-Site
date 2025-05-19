'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { DDMMYYYY } from '@/lib/date';
import Link from 'next/link';
import { deleteNews } from '@/utils/actions/adminActions';
import Image from 'next/image';
import { toast } from 'sonner';

export type ROW = {
    id: string;
    title: string;
    categorySlug: string | null;
    createdAt: Date;
    featuredImg: string | null;
};

export const columns: ColumnDef<ROW>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'featuredImg',
        header: '',
        cell: ({ row }) => {
            const Img = row.original.featuredImg;
            const title = row.original.title;

            if (Img) return <Image width={100} height={40} alt={title} src={Img} />;
            else return <span className="text-center w-full">No-Img</span>;
        }
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const categorySlug = row.original.categorySlug;
            const id = row.original.id;
            const title = row.original.title;
            return (
                <Link className="hover:text-blue-500 hover:underline underline-offset-1 transition-colors" href={`/${categorySlug}/${id}`}>
                    {title}
                </Link>
            );
        }
    },
    {
        accessorKey: 'categorySlug',
        header: 'Category',
        cell: ({ row }) => {
            const category = row.original.categorySlug;

            return (
                <Link className="hover:text-blue-500 hover:underline underline-offset-1 transition-colors" href={`/category/${category}`}>
                    {category?.toUpperCase()}
                </Link>
            );
        }
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = row.original.createdAt;
            const dateTime = DDMMYYYY(date);

            return <div>{dateTime}</div>;
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const news = row.original;

            const DeleteNews = async (id: string) => {
                let loadingToastId;
                try {
                    loadingToastId = toast.loading('Deleting news...');
                    const response = await deleteNews(id);
                    toast.dismiss(loadingToastId);

                    if (response.status !== 'success') {
                        toast.error('Something went wrong');
                    } else {
                        toast.success('Deleted News');
                        window.location.reload();
                    }
                } catch (error) {
                    toast.dismiss(loadingToastId);
                    console.log(error);
                    toast.error('An error occurred');
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(news.id)}>copy newsID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => DeleteNews(news.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
