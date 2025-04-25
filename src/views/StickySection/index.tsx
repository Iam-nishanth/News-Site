import React from "react";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import NewsCardTwo from "@/components/NewsCard_2";
import Button from "@/components/common/Button";
import Image from "next/image";
import Categories from "@/components/Categories";

const StickySection = () => {
  const Content = {
    tag: "Category",
    date: "DD Month YYYY",
    title:
      "News Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem",
    description: `
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

  const news = Array(8).fill(Content);

  return (
    <MaxWidthWrapper className="flex gap-10 items-start relative lg:flex-row flex-col">
      <div className="w-full flex flex-col gap-8 py-10 lg:py-5">
        {news.map((Content, index) => (
          <NewsCardTwo key={index} Content={Content} />
        ))}
      </div>
      <aside className="w-full max-w-full lg:max-w-[300px] static sm:sticky top-0 h-auto lg:h-screen justify-center items-center lg:flex">
        <Categories />
      </aside>
    </MaxWidthWrapper>
  );
};

export default StickySection;
