import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import NewsCard from "@/components/NewsCard";
import { Reveal } from "@/utils/animation/reveal";
import { RevealY } from "@/utils/animation/revealY";
import React from "react";

const NewsSection = () => {
  const Content = {
    tag: "Category",
    date: "DD Month YYYY",
    title: "News Heading",
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem
        accusantium ut sit rerum, cumque sunt quos reprehenderit
        exercitationem, quo nobis animi excepturi tempore veniam perspiciatis
        aperiam, nemo illo! Sit, aspernatur?`,
    // image: "/images/placeholder.webp",
    image: "/images/test.jpg",
    author: "Stock-Liv",
    likes: 10,
    views: 200,
    comments: 10,
    slug: "news-heading",
  };

  const news = Array(6).fill(Content);

  return (
    <MaxWidthWrapper className="my-7">
      <Reveal width="100%">
        <div className="w-full border-b-2 border-black dark:border-gray-400 mb-10 flex flex-col gap-2 pb-4">
          <h1 className="text-3xl font-bold">News</h1>
          <p className=" text-base font-medium text-gray-500">
            Latest News and Events
          </p>
        </div>
      </Reveal>

      <RevealY>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {news.map((news, index) => (
            <NewsCard key={index} Content={news} />
          ))}
        </div>
      </RevealY>
    </MaxWidthWrapper>
  );
};

export default NewsSection;
