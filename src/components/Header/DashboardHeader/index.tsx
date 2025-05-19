'use client';
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Button, buttonVariants } from '../../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, HomeIcon, Layers, LayoutGrid, LucideUserCheck, MenuIcon, NotebookText, SettingsIcon, UserCog } from 'lucide-react';
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
                  name: 'Dashboard',
                  link: '/admin',
                  Icon: <LayoutGrid className="w-5 h-5" />
              },
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
                  name: 'Categories',
                  link: '/categories',
                  Icon: <Layers className="w-5 h-5" />
              },
              {
                  name: 'Banners',
                  link: '/banners',
                  Icon: (
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-grid2x2-plus-icon lucide-grid-2x2-plus"
                      >
                          <path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" />
                          <path d="M16 19h6" />
                          <path d="M19 22v-6" />
                      </svg>
                  )
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
                  name: 'Categories',
                  link: '/categories',
                  Icon: <Layers className="w-5 h-5" />
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
