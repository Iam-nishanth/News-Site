import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import NewsCarousel from "@/components/NewsCarousel";
import React from "react";

const PopularSection = () => {
  return (
    <MaxWidthWrapper className="py-4">
      <div className="w-full flex flex-col gap-3 py-3">
        <h1 className="text-3xl font-semibold font-Roboto">Popular News</h1>
        <div className="w-full h-auto border-b-2 border-black dark:border-gray-500" />
      </div>
      <NewsCarousel />
    </MaxWidthWrapper>
  );
};

export default PopularSection;
