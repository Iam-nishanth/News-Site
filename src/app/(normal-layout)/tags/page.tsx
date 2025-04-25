import CategoryCard from "@/components/CategoryCard";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import { getPostsByTag } from "@/utils/actions/userActions";
import { Reveal } from "@/utils/animation/reveal";
import { RevealY } from "@/utils/animation/revealY";
import React from "react";

interface Props {
  params: {};
  searchParams: { query: string };
}

async function getData(tag: string) {
  try {
    const news = await getPostsByTag(tag);
    if (!news || news.length === 0) {
      throw new Error("Category not found");
    }
    return news;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default async function TagsPage({ searchParams }: Props) {
  try {
    const news = await getData(searchParams?.query);
    const newsArr = Array.from({ length: 6 }, () => news).flat();

    return (
      <MaxWidthWrapper className="py-3">
        <Reveal width="100%">
          <div className="w-full border-b-2 border-black dark:border-gray-400 mb-10 flex flex-col gap-2 pb-4">
            <h1 className="text-3xl font-bold capitalize">
              Results for Tag: {searchParams.query}
            </h1>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsArr.map((newsItem, index) => (
            <RevealY key={index} width="100%">
              <CategoryCard Content={newsItem} />
            </RevealY>
          ))}
        </div>
      </MaxWidthWrapper>
    );
  } catch (error) {
    return (
      <MaxWidthWrapper className="fixed-height flex flex-col justify-center items-center gap-3">
        <h1 className=" text-3xl font-semibold capitalize">Not Found</h1>
        <p>There are no posts yet with this query.</p>
      </MaxWidthWrapper>
    );
  }
}
