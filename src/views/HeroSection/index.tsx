'use client';
import HeroCard from '@/components/HeroCard';
import { RevealY } from '@/utils/animation/revealY';
import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeroNews {
    position: number;
    news: {
        title: string;
        slug: string;
        featuredImg: string;
        user: {
            name: string;
        };
    };
}

const HeroSection = ({ heroNews, loading }: { heroNews: HeroNews[]; loading: boolean }) => {
    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <section className="flex w-full h-full flex-col sm:flex-row">
            <div className="w-full h-full max-w-full min-h-[550px] sm:max-w-[450px] flex flex-col">
                {heroNews[0] && (
                    <HeroCard
                        smallCard={true}
                        commentCount={0}
                        likeCount={0}
                        author={heroNews[0].news.user.name}
                        title={heroNews[0].news.title}
                        link={`/news/${heroNews[0].news.slug}`}
                        imgSrc={heroNews[0].news.featuredImg || '/images/placeholder.webp'}
                        className="flex-1"
                    />
                )}
                {heroNews[1] && (
                    <HeroCard
                        smallCard={true}
                        commentCount={0}
                        likeCount={0}
                        author={heroNews[1].news.user.name}
                        title={heroNews[1].news.title}
                        link={`/news/${heroNews[1].news.slug}`}
                        imgSrc={heroNews[1].news.featuredImg || '/images/placeholder.webp'}
                        className="flex-1"
                    />
                )}
            </div>
            {heroNews[2] && (
                <HeroCard
                    commentCount={0}
                    likeCount={0}
                    author={heroNews[2].news.user.name}
                    title={heroNews[2].news.title}
                    link={`/news/${heroNews[2].news.slug}`}
                    imgSrc={heroNews[2].news.featuredImg || '/images/placeholder.webp'}
                    className="sm:w-full max-w-full sm:max-w-none sm:min-h-full min-h-[550px]"
                />
            )}
            <div className="w-full h-full max-w-full min-h-[550px] sm:max-w-[450px] flex flex-col">
                {heroNews[3] && (
                    <HeroCard
                        smallCard={true}
                        commentCount={0}
                        likeCount={0}
                        author={heroNews[3].news.user.name}
                        title={heroNews[3].news.title}
                        link={`/news/${heroNews[3].news.slug}`}
                        imgSrc={heroNews[3].news.featuredImg || '/images/placeholder.webp'}
                        className="flex-1"
                    />
                )}
                {heroNews[4] && (
                    <HeroCard
                        smallCard={true}
                        commentCount={0}
                        likeCount={0}
                        author={heroNews[4].news.user.name}
                        title={heroNews[4].news.title}
                        link={`/news/${heroNews[4].news.slug}`}
                        imgSrc={heroNews[4].news.featuredImg || '/images/placeholder.webp'}
                        className="flex-1"
                    />
                )}
            </div>
        </section>
    );
};

export default HeroSection;
