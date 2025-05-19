'use client';
import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sidebar } from '../MobileNav';
import { AlignJustify } from 'lucide-react';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Icons } from '../icons';
import SearchButton from '@/components/common/SearchButton';
import { ModeToggle } from '@/components/ui/theme-switch';
import { useSession } from 'next-auth/react';

const components: { title: string; href: string; description?: string }[] = [
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
];

export function NavbarMenu() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = React.useState(false);
    const sidebarRef = React.useRef(null);

    const handleClickOutside = (event: MouseEvent | TouchEvent | KeyboardEvent) => {
        setIsOpen(false);
    };

    useOnClickOutside(sidebarRef, handleClickOutside);

    const toggle = () => {
        setIsOpen((prev) => !prev);
    };
    return (
        <>
            <div className="flex sm:hidden justify-between items-center h-12">
                <Button variant="ghost" size="icon" onClick={toggle}>
                    <AlignJustify className="w-5 h-5 dark:text-white" />
                </Button>
                <Sidebar isOpen={isOpen} toggle={toggle} ref={sidebarRef} />
                {/* <div className="flex justify-center items-center gap-3">
          <SearchButton />
          <Button variant="outline" size="icon" className="relative">
            <Link href="#" className="dark:text-white">
              <Icons.facebook className="w-6 h-6 dark:fill-white fill-black" />
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Link href="#">
              <Icons.instagram className="w-6 h-6 dark:w-7 dark:h-7 dark:fill-white stroke-black" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="relative">
            <Link href="#">
              <Icons.youtube className="w-7 h-7 dark:fill-white fill-black" />
            </Link>
          </Button>
        </div> */}
            </div>
            <NavigationMenu className="hidden">
                <NavigationMenuList className="space-x-1">
                    {/* <NavigationMenuItem className="px-2">
                        <NavigationMenuTrigger className="font-Barlow uppercase font-medium">Trending</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 w-[500px] md:w-[600px] lg:w-[800px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href="/"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/docs" title="Introduction">
                                    Re-usable components built using Radix UI and Tailwind CSS.
                                </ListItem>
                                <ListItem href="/docs/installation" title="Installation">
                                    How to install dependencies and structure your app.
                                </ListItem>
                                <ListItem href="/docs/primitives/typography" title="Typography">
                                    Styles for headings, paragraphs, lists...etc
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem> */}
                    {(session?.user?.role === 'ADMIN' || session?.user?.role === 'EDITOR' || session?.user?.role === 'SUPERADMIN') && (
                        <NavigationMenuItem>
                            <NavigationMenuLink href="/admin" className={cn(navigationMenuTriggerStyle(), 'font-Barlow uppercase font-medium')}>
                                Dashboard
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="font-Barlow uppercase font-medium">Categories</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[550px] gap-3 p-4 grid-cols-2 lg:w-[600px]">
                                {components.map((component) => (
                                    <ListItem key={component.title} title={component.title} href={component.href}>
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/about" className={cn(navigationMenuTriggerStyle(), 'font-Barlow uppercase font-medium')}>
                            About
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink href="/contact" className={cn(navigationMenuTriggerStyle(), 'font-Barlow uppercase font-medium')}>
                            Contact
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <SearchButton />
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <ModeToggle variant="ghost" />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    href={props.href ?? ''}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
