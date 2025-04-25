// 'use client';

// import { ColumnDef } from '@tanstack/react-table';
// import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Checkbox } from '@/components/ui/checkbox';
// import { DDMMYYYY } from '@/lib/date';
// import { verifyUser } from '@/utils/actions/authActions';

// export type ROW = {
//     id: string;
//     name: string;
//     email: string;
//     createdAt: Date;
//     role: string;
// };

// type Role = 'SUPERADMIN' | 'ADMIN';

// const handleRoleChange = async (role: string, userId: string) => {
//     console.log(`Changing role to ${role} for user ${userId}`);
// };

// const getUser = (async () => {
//     let response;
//     const { user } = await verifyUser();
//     if (!user) response = null;
//     else response = user;
// })();

// export const columns: ColumnDef<ROW>[] = [
//     {
//         id: 'select',
//         header: ({ table }) => (
//             <Checkbox
//                 checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
//                 onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//                 aria-label="Select all"
//             />
//         ),
//         cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
//         enableSorting: false,
//         enableHiding: false
//     },
//     {
//         accessorKey: 'name',
//         header: ({ column }) => {
//             return (
//                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Name
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         }
//     },
//     {
//         accessorKey: 'email',
//         header: 'Email'
//     },
//     {
//         accessorKey: 'createdAt',
//         header: ({ column }) => {
//             return (
//                 <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
//                     Created At
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             );
//         },
//         cell: ({ row }) => {
//             const originalDate = row.original.createdAt;
//             const dateTime = DDMMYYYY(originalDate);

//             return <div>{dateTime}</div>;
//         }
//     },
//     {
//         accessorKey: 'role',
//         header: 'Role'
//     },
//     {
//         id: 'actions',
//         cell: ({ row }) => {
//             const user = row.original;
//             const userRole: any = user.role;
//             const LoggedInUser = { role: 'SUPERADMIN' };
//             const loggedInUserRole = LoggedInUser && LoggedInUser.role;

//             const dropdownMenuItems = (() => {
//                 if (loggedInUserRole === 'SUPERADMIN' && userRole == 'ADMIN') {
//                     return (
//                         <>
//                             <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleRoleChange('SUPERADMIN', user.id)}>Change to SUPERADMIN</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>
//                         </>
//                     );
//                 } else if (loggedInUserRole === 'SUPERADMIN' && userRole == 'USER') {
//                     return (
//                         <>
//                             <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleRoleChange('ADMIN', user.id)}>Change to ADMIN</DropdownMenuItem>
//                         </>
//                     );
//                 } else if (loggedInUserRole === 'SUPERADMIN' && userRole == 'EDITOR') {
//                     return (
//                         <>
//                             <DropdownMenuItem onClick={() => handleRoleChange('ADMIN', user.id)}>Change to ADMIN</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleRoleChange('SUPERADMIN', user.id)}>Change to SUPERADMIN</DropdownMenuItem>
//                             <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>
//                         </>
//                     );
//                 } else if (loggedInUserRole === 'ADMIN' && userRole == 'USER') {
//                     return <DropdownMenuItem onClick={() => handleRoleChange('EDITOR', user.id)}>Change to EDITOR</DropdownMenuItem>;
//                 } else if (loggedInUserRole == 'ADMIN' && userRole == 'EDITOR') {
//                     return <DropdownMenuItem onClick={() => handleRoleChange('USER', user.id)}>Change to USER</DropdownMenuItem>;
//                 }
//             })();

//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end">
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>copy userID</DropdownMenuItem>
//                         <DropdownMenuSeparator />

//                         {dropdownMenuItems}
//                         {loggedInUserRole == 'SUPERADMIN' ? <DropdownMenuItem>Delete User</DropdownMenuItem> : loggedInUserRole == 'ADMIN' ? <DropdownMenuItem>Delete User</DropdownMenuItem> : null}
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             );
//         }
//     }
// ];
