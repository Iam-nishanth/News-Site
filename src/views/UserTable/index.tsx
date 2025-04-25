'use client';

import React, { useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { DDMMYYYY } from '@/lib/date';
import { DataTable } from '@/app/(protected)/users/data-table';
import { User } from '@prisma/client';
import { verifyUser } from '@/utils/actions/authActions';
import { changeRole, deleteUser } from '@/utils/actions/adminActions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export type ROW = {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    role: string;
    emailVerified: Date | null;
};

const UserTable = ({ data }: { data: User[] }) => {
    const [loggedinUser, setLoggedInUser] = useState<User>();
    const [currentRole, setCurrentRole] = useState<string | null>(null);

    const currentUser = async () => {
        const { user } = await verifyUser();
        if (!user) return null;
        setLoggedInUser(user);
        setCurrentRole(user?.role);
        if (user) return user;
    };
    useEffect(() => {
        currentUser();
    }, []);

    const router = useRouter();

    const handleRoleChange = async (role: string, userId: string) => {
        const response = await changeRole(userId, role);
        if (response.status == 'failed') {
            toast.error('Something went wrong');
        }
        toast.success('Role changed succcesfully');
        router.refresh();
    };

    const handleDelete = async (id: string) => {
        const response = await deleteUser(id);
        if (response.status == 'failed') {
            toast.error('Something went wrong');
        }
        toast.success('Deleted User Successfully');
        router.refresh();
    };

    const columns: ColumnDef<ROW>[] = [
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
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            }
        },
        {
            accessorKey: 'email',
            header: 'Email'
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
                const originalDate = row.original.createdAt;
                const dateTime = DDMMYYYY(originalDate);

                return <div>{dateTime}</div>;
            }
        },
        {
            accessorKey: 'role',
            header: 'Role'
        },
        {
            accessorKey: 'emailVerified',
            header: 'Verified?',
            cell: ({ row }) => {
                const isVerified = row.original.emailVerified;
                if (isVerified == null) return <span className=" bg-red-400 px-2 font-medium text-black">No</span>;
                return <span className=" bg-green-400 px-2 font-medium text-black">Yes</span>;
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original;
                const userRole: any = user.role;

                const dropdownMenuItems = (() => {
                    if (currentRole === 'SUPERADMIN' && userRole == 'ADMIN') {
                        return (
                            <>
                                <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('SUPERADMIN', user.id)}>Change to SUPERADMIN</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>
                            </>
                        );
                    } else if (currentRole === 'SUPERADMIN' && userRole == 'USER') {
                        return (
                            <>
                                <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('ADMIN', user.id)}>Change to ADMIN</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('SUPERADMIN', user.id)}>Change to SUPERADMIN</DropdownMenuItem>
                            </>
                        );
                    } else if (currentRole === 'SUPERADMIN' && userRole == 'EDITOR') {
                        return (
                            <>
                                <DropdownMenuItem onClick={() => handleRoleChange('ADMIN', user.id)}>Change to ADMIN</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('SUPERADMIN', user.id)}>Change to SUPERADMIN</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>
                            </>
                        );
                    } else if (currentRole === 'ADMIN' && userRole == 'USER') {
                        return <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>;
                    } else if (currentRole == 'ADMIN' && userRole == 'EDITOR') {
                        return <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>;
                    }
                })();

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
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>copy userID</DropdownMenuItem>
                            <DropdownMenuSeparator />

                            {dropdownMenuItems}
                            {currentRole == 'SUPERADMIN' ? (
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>Delete User</DropdownMenuItem>
                            ) : currentRole == 'ADMIN' ? (
                                <DropdownMenuItem onClick={() => handleDelete(user.id)}>Delete User</DropdownMenuItem>
                            ) : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            }
        }
    ];

    if (currentRole !== null) return <DataTable columns={columns} data={data} />;
};

export default UserTable;
