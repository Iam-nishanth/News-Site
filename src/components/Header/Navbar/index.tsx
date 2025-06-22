import React from 'react';
import Headlines from '../Headlines';
import Image from 'next/image';
import Link from 'next/link';
import { NavbarMenu } from '../NavbarMenu';
import { ModeToggle } from '@/components/ui/theme-switch';
import SearchButton from '@/components/common/SearchButton';
import { cn } from '@/lib/utils';

const Navbar = ({ className }: { className?: string }) => {
    return (
        <nav className={cn('w-full flex flex-col ', className)}>
            <Headlines />
            <div className="flex justify-center items-center w-full z-50 relative">
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="w-full flex items-center min-h-20 sm:min-h-20 justify-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:shadow-[0_3px_3px_rgb(152,152,152,0.2)]">
                        <div className="w-full flex justify-between max-w-screen-xl">
                            <div className="w-full flex flex-row sm:flex-row-reverse justify-normal gap-2 sm:gap-0 sm:justify-between">
                                <NavbarMenu />
                                <div className="w-36 sm:w-44 h-12 sm:h-14 relative">
                                    <Link href="/" className="no-underline w-full">
                                        <Image src="/images/hard-yards.png" alt="logo" fill className="object-cover object-left" quality={100} />
                                    </Link>
                                </div>
                            </div>
                            <div className="flex sm:hidden gap-3 items-center">
                                <SearchButton />
                                <ModeToggle variant="ghost" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
