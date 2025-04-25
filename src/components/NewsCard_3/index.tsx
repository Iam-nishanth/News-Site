import { DDMMYYYY } from '@/lib/date';
import { Calendar } from 'lucide-react';
import React from 'react';

interface ContentType {
    categorySlug: string;
    title: string;
    createdAt: Date;
}

const NewsCardThree = ({ Content }: { Content: ContentType }) => {
    const { categorySlug, title, createdAt } = Content;

    return (
        <div className="w-full flex flex-col gap-3 py-3">
            <div className=" w-full max-w-[80px] h-6 flex justify-center items-center bg-[#f80e5d] px-2">
                <p className=" text-xs tracking-wider uppercase text-white">{categorySlug}</p>
            </div>
            <h2 className="font-Roboto font-bold text-lg leading-[23px] hover:heading-underline">{title}</h2>
            <p className="flex gap-2 text-gray-500 items-center">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wide">{DDMMYYYY(createdAt as Date)}</span>
            </p>
        </div>
    );
};

export default NewsCardThree;
