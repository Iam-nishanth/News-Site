'use client';
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button, buttonVariants } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Layers, LucideUserCheck, MenuIcon, NotebookText, SettingsIcon, UserCog } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { getInitials } from '@/lib/utils';
import { ModeToggle } from '../../ui/theme-switch';
import { User } from '@prisma/client';
import { LogoutButton } from '../../common/AuthButtons';

const DashBoardHeader = ({ user }: { user?: User }) => {
    const [status, setStatus] = useState(false);

    const isAdmin = (user: User | null): boolean => {
        if (!user) return false;

        const admin = user.role == 'ADMIN' || user.role == 'SUPERADMIN';

        return admin;
    };
    const role = isAdmin(user ?? null);

    const SheetLinks = role
        ? [
              {
                  name: 'Editor',
                  link: '/editor',
                  Icon: <Edit className="w-5 h-5" />
              },
              {
                  name: 'Users',
                  link: '/users',
                  Icon: <LucideUserCheck className="w-5 h-5" />
              },
              {
                  name: 'Drafts',
                  link: '/preview',
                  Icon: <NotebookText className="w-5 h-5" />
              },
              {
                  name: 'All News',
                  link: '/manage-news',
                  Icon: <Layers className="w-5 h-5" />
              },
              {
                  name: 'Profile',
                  link: '/profile',
                  Icon: <UserCog className="w-5 h-5" />
              }
          ]
        : [
              {
                  name: 'Editor',
                  link: '/editor',
                  Icon: <Edit className="w-5 h-5" />
              },
              {
                  name: 'Profile',
                  link: '/profile',
                  Icon: <UserCog className="w-5 h-5" />
              }
          ];

    return (
        <nav className="w-full flex justify-center items-center border-b-2 dark:border-b border-muted">
            <div className="w-full max-w-[95%] px-3 h-16 flex items-center justify-between">
                <Sheet open={status} onOpenChange={(val) => setStatus(val)}>
                    <SheetTrigger className={buttonVariants({ size: 'icon', variant: 'outline' })}>
                        <MenuIcon className="w-6 h-6" />
                    </SheetTrigger>
                    <SheetContent side="left" className="p-2 w-80 z-[9999]">
                        <SheetHeader className="py-3 flex justify-center items-center border-b border-muted w-full">
                            <div className="w-48 h-16 relative flex justify-center">
                                <Image src="/images/Stock-Liv.png" alt="Logo" fill className="w-full h-full object-contain object-center" />
                            </div>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 p-8">
                            {SheetLinks.map((item, index) => (
                                <Link key={index} href={item.link} onClick={() => setStatus((prev) => !prev)} className="flex gap-4 items-center font-Roboto text-base font-medium">
                                    {item.Icon}
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                {user?.image && <AvatarImage src={user?.image} />}
                                <AvatarFallback>{getInitials(user?.name ?? 'Not Available')}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48" align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem>
                                <LogoutButton className="text-foreground p-0 h-auto" variant="link" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default DashBoardHeader;
