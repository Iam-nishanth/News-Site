'use client';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/theme-switch';
import { cn } from '@/lib/utils';
import { Building2, ChevronDown, Flame, Headset, Home, Settings2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC, forwardRef, useRef, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const menuItems = [
    {
        name: 'Categories',
        icon: <Settings2 />,
        items: [
            {
                title: 'Sports',
                href: '/category/sports',
                description: 'Latest sports news and updates'
            },
            {
                title: 'Business',
                href: '/category/business',
                description: 'Global business news and updates'
            },
            {
                title: 'Lifestyle',
                href: '/category/lifestyle',
                description: 'Lifestyle news and trends'
            },
            {
                title: 'Politics',
                href: '/category/politics',
                description: 'Latest political news and updates'
            },
            {
                title: 'Technology',
                href: '/category/technology',
                description: 'Technology news and innovations'
            },
            {
                title: 'Celebrity',
                href: '/category/celebrity',
                description: 'Celebrity news and updates'
            },
            {
                title: 'World',
                href: '/category/world',
                description: 'World news and global events'
            },
            {
                title: 'Weather',
                href: '/category/weather',
                description: 'Weather forecasts and updates'
            }
        ]
    },
    {
        name: 'Trending',
        icon: <Flame />,
        link: '/trending'
    },
    {
        name: 'About',
        icon: <Building2 />,
        link: '/about'
    },
    {
        name: 'Contact',
        icon: <Headset />,
        link: '/contact'
    }
];

const NavHeader = ({ toggle }: { toggle: () => void }) => (
    <header className="flex items-center justify-between py-6 bg-white dark:bg-gray-800">
        <Link href="/" onClick={toggle}>
            <Image src="/images/Stock-Liv.png" alt="logo" width={100} height={38} quality={100} />
        </Link>
        <div className=" space-x-1">
            <Button variant="outline" className="bg-transparent" size="icon" onClick={toggle}>
                <X className="w-5 h-5" />
            </Button>
        </div>
    </header>
);

type SidebarProps = {
    toggle: () => void;
    isOpen: boolean;
};

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>((props, ref) => {
    const { isOpen, toggle, ...otherProps } = props;

    const [activeItem, setActiveItem] = useState<string>('');

    const path = usePathname();
    return (
        <aside
            ref={ref}
            className={cn(
                'fixed top-0 flex flex-col gap-2 w-[17rem] h-full p-4 bg-white  dark:bg-gray-800 border-r border-gray-700 transition-all duration-400 z-50',
                isOpen ? 'left-0' : 'left-[-17rem]'
            )}
        >
            <NavHeader toggle={toggle} />
            <div>
                {menuItems.map((item, index) => {
                    return !item.items ? (
                        <Link
                            onClick={toggle}
                            key={`menu-item-${index}`}
                            href={item.link}
                            className={`flex items-center gap-4 py-2 rounded-lg font-medium ${
                                path.match(item.link) ? 'bg-blue-500 dark:text-white text-black' : 'dark:text-gray-300 text-black hover:bg-blue-500 dark:hover:bg-gray-700'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ) : (
                        <Accordion key={`accordion-${index}`} type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <p className="flex items-center gap-4">
                                        {item.icon}
                                        {item.name}
                                    </p>
                                </AccordionTrigger>
                                {item.items.map((subItem, subIndex) => (
                                    <AccordionContent key={`subItem-${index}-${subIndex}`}>
                                        <Link
                                            onClick={toggle}
                                            className={`flex items-center gap-4 px-3 py-2 rounded-lg ${
                                                path.match(subItem.href) ? 'bg-blue-500 dark:text-white text-black' : 'dark:text-gray-300 text-black hover:bg-blue-500 dark:hover:bg-gray-700'
                                            }`}
                                            href={subItem.href}
                                        >
                                            {subItem.title}
                                        </Link>
                                    </AccordionContent>
                                ))}
                            </AccordionItem>
                        </Accordion>
                    );
                })}
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';
