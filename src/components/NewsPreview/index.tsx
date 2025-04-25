import { formatCreatedAt } from '@/lib/date';
import { Reveal } from '@/utils/animation/reveal';
import { RevealY } from '@/utils/animation/revealY';
import { Share2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import NewsSectionTwo from '@/views/NewsSection_2';
import NewsCardThree from '../NewsCard_3';

export interface SinglePost {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    tags: string[];
    categorySlug: string;
    imgCaption: string | null;
    content: string;
    featuredImg: string | null;
    slug: string;
    userEmail: string;
    comments: Comment[];
    user: User;
}

interface User {
    name: string;
}

interface Comment {
    id: string;
    desc: string;
    userEmail: string;
    user: { name: string };
    createdAt: Date;
}

export interface Similar {
    id: string;
    categorySlug: string;
    createdAt: Date;
    title: string;
}

const NewsPreview = ({ Post, similar }: { Post: SinglePost[]; similar?: Similar[] | null }) => {
    return Post?.map((item, index) => (
        <div key={index} className="space-y-3 p-1 lg:p-3">
            <Reveal width="100%">
                <div className=" space-y-3">
                    <h1 className="text-2xl md:text-3xl font-semibold text-center">{item?.title}</h1>
                    <div className="w-full max-w-screen-md mx-auto flex justify-between">
                        <div>
                            <p className="font-normal text-sm">{formatCreatedAt(item.createdAt)}</p>
                            <p>
                                By <span className=" text-blue-500 font-medium">{item?.user.name}</span>
                            </p>
                        </div>
                        <a className="text-sm font-semibold flex items-center gap-2 no-underline text-foreground">
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </a>
                    </div>
                </div>
            </Reveal>
            <RevealY width="100%">
                <div className="flex flex-col gap-2">
                    {item?.featuredImg && (
                        <div className="relative w-full min-h-[250px] lg:min-h-[500px]">
                            <Image src={item.featuredImg} alt={item.title} fill className="lg:object-contain object-cover" />
                        </div>
                    )}
                    <p className="text-center text-xs md:text-sm">{item?.imgCaption}</p>
                </div>
            </RevealY>
            {/* ---------------------HTML----------------------- */}
            <RevealY width="100%">
                <div className="px-0 md:px-3 py-2">
                    <div className="content tracking-normal md:tracking-wide font-normal text-base lg:text-lg !font-Roboto" dangerouslySetInnerHTML={{ __html: item?.content ?? '' }}></div>
                </div>
            </RevealY>
            {/* --------------------Tags---------------------- */}
            <RevealY width="100%">
                <div className="flex gap-3 flex-wrap">
                    {item.tags.map((tag, index) => {
                        return (
                            <Badge className="px-4 py-1 bg-muted-foreground" key={index}>
                                <Link className="text-sm" href={`/tags?query=${tag}`}>
                                    {tag}
                                </Link>
                            </Badge>
                        );
                    })}
                </div>
            </RevealY>
            {/* ----------------------Comments------------------------ */}

            {/* <RevealY width="100%">
        <div className="w-full">
          <div className="w-full border-b-2 border-black dark:border-gray-400 mb-10 flex flex-col gap-2 pb-4">
            <h1 className="text-3xl font-bold capitalize">Comments</h1>
          </div>
          <div>
            {item.comments.map((comment, index) => (
              <p key={index}>Hello</p>
            ))}
          </div>
        </div>
      </RevealY> */}

            {/* --------------------Similar------------------------- */}
            <div className="w-full flex flex-col">
                <div className="w-full border-b-2 border-black dark:border-gray-400 mb-2 flex flex-col gap-2 pb-2">
                    <h1 className="text-3xl font-bold capitalize">Similar</h1>
                </div>
                {similar?.length !== 0 ? (
                    <RevealY width="100%">
                        <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
                            {similar?.map((item, index) => (
                                <NewsCardThree key={index} Content={item} />
                            ))}
                        </div>
                    </RevealY>
                ) : (
                    <RevealY width="100%">
                        <h2 className="font-medium text-base py-2 text-center">No Similiar Posts</h2>
                    </RevealY>
                )}
            </div>
        </div>
    ));
};

export default NewsPreview;
