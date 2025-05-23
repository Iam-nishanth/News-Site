import { cn } from '@/lib/utils';
import { BarChart3, Calendar, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface ContentType {
    tag: string;
    date: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    author: string;
    likes: number;
    views: number;
    comments: number;
}
type Props = {
    className?: string;
    Content: ContentType;
};

const NewsCard = ({ className, Content }: Props) => {
    const { tag, title, description, image, author, likes, views, comments, date, slug } = Content;

    return (
        <div className={cn('w-full h-full border border-[#E0DEDE] dark:border-[#e0dede5b] dark:text-gray-300', className)}>
            <div className="w-full min-h-[230px] relative overflow-hidden group">
                <div className="absolute bottom-3 left-3 w-auto h-5 bg-blue-700 z-10 flex justify-center items-center">
                    <span className="text-sm uppercase text-white tracking-wide px-2 py-1">{tag}</span>
                </div>
                <Image src={image} alt="placeholder" fill className="object-cover dark:brightness-[0.8] group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-4 flex flex-col gap-4">
                <p className="flex gap-2 text-black dark:text-gray-500 items-center">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wide">{date}</span>
                </p>
                <div className="flex flex-col gap-1">
                    <Link href={`/news/${slug}`} className="text-black dark:text-gray-300 hover:heading-underline">
                        <h3 className="font-Roboto text-2xl font-bold">{title}</h3>
                    </Link>
                    <p className="text-md">
                        By <span className="text-red-700 font-medium"> {author}</span>
                    </p>
                </div>

                <p className=" text-base">{description}</p>
            </div>
            <div className="p-3 border-t border-[#E0DEDE] dark:border-[#e0dede5b]">
                <div className="flex gap-3 items-center w-[50%] px-1">
                    <p className="flex text-sm gap-1 hover:text-red-500" title="Likes">
                        <Heart className="w-4 h-4" />
                        <span>{likes}</span>
                    </p>
                    <p className="flex text-sm gap-1 hover:text-blue-600" title="Comments">
                        <MessageCircle className="w-4 h-4" />
                        <span>{comments}</span>
                    </p>
                    <p className="flex text-sm gap-1 hover:text-green-500" title="Views">
                        <BarChart3 className="w-4 h-4" />
                        <span>{views}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
