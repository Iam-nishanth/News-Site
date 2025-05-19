import { BarChart3, Calendar, Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import Button from '../common/Button';

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

const NewsCardTwo = ({ className, Content }: Props) => {
    const { tag, title, description, image, author, likes, views, comments, date, slug } = Content;

    return (
        <div className="w-full">
            <div className=" w-full h-auto sm:h-[300px] flex gap-6 flex-col sm:flex-row">
                <div className="h-full w-full max-w-full min-h-[250px] sm:max-w-[300px] relative overflow-hidden">
                    <div className="absolute bottom-3 left-3 w-auto h-5 bg-blue-700 z-10 flex justify-center items-center">
                        <span className="text-sm uppercase text-white tracking-wide px-2 py-1">{tag}</span>
                    </div>
                    <Image src={image} alt={title} fill className="object-cover dark:brightness-[0.8] hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="w-full h-full flex flex-col gap-3">
                    <div className="w-full h-full flex flex-col gap-3 sm:gap-0 sm:justify-evenly border-b-2 border-[#c3cbd1] dark:border-[#949495] px-2 pb-3 sm:pb-0 sm:px-0">
                        <p className="text-sm font-medium uppercase tracking-wide flex items-center gap-[10px] text-gray-500">
                            <Calendar />
                            <span>{date}</span>
                        </p>
                        <h3 className="font-bold text-2xl hover:heading-underline">{title}</h3>
                        <p className="text-md">
                            By <span className="text-red-700 font-medium"> {author}</span>
                        </p>
                        <p className="text-base font-light">{description}</p>
                    </div>
                    <div className="w-full flex justify-between items-center px-2 sm:px-0">
                        <Button to={`/news/${slug}`} className=" rounded-none px-8">
                            Read more
                        </Button>
                        <div className="flex gap-3 items-center px-1">
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
            </div>
        </div>
    );
};

export default NewsCardTwo;
