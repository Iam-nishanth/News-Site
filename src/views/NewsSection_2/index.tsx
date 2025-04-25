import MaxWidthWrapper from '@/components/common/MaxWidthWrapper';
import NewsCardThree from '@/components/NewsCard_3';
import React from 'react';

const NewsSectionTwo = ({ heading }: { heading: string }) => {
    const date = new Date();
    const Content = {
        categorySlug: 'Category',
        title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
        createdAt: date
    };

    const news = Array(8).fill(Content);

    return (
        <MaxWidthWrapper className="flex flex-col w-full my-5">
            <div className="w-full flex flex-col gap-3">
                <h1 className="text-3xl font-semibold font-Roboto">{heading}</h1>
                <div className="w-full h-auto border-b-2 border-black dark:border-gray-500" />
            </div>
            <div className="w-full grid md:grid-cols-3 lg:grid-cols-4 gap-3 py-3">
                {news.map((item, index) => (
                    <NewsCardThree key={index} Content={item} />
                ))}
            </div>
        </MaxWidthWrapper>
    );
};

export default NewsSectionTwo;
