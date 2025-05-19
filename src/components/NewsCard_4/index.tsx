import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ContentType {
    tag?: string;
    title: string;
    date?: string;
    image?: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    categorySlug: string;
    imgCaption: string | null;
    content: string;
    featuredImg: string | null;
    slug: string;
    userEmail: string;
}

const NewsCardFour = ({ Content, className, link }: { Content: ContentType; className?: string; link?: string }) => {
    const { tag, title, featuredImg, createdAt } = Content;

    return (
        <Link href={link ?? ''}>
            <div className={cn('w-full flex flex-col gap-3', className)}>
                <div className="w-full h-[200px] relative">
                    <Image src={featuredImg ?? ''} alt={title} layout="fill" className="object-cover object-center" />
                    <div className=" absolute w-[80px] h-6 flex justify-center items-center bg-[#f80e5d] px-2 bottom-3 left-3">
                        <p className=" text-xs tracking-wider uppercase text-white">{tag}</p>
                    </div>
                </div>

                <h2 className="font-Roboto font-bold text-lg leading-[23px]">{title}</h2>
                <p className="flex gap-2 text-gray-500 items-center">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wide">{createdAt.toString()}</span>
                </p>
            </div>
        </Link>
    );
};

export default NewsCardFour;
