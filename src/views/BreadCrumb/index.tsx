import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Image from "next/image";
import React from "react";

interface BreadcrumbProps {
  pageName: string;
}

const BreadCrumb = ({ pageName }: BreadcrumbProps) => {
  return (
    <MaxWidthWrapper className=" w-full">
      <div className="relative w-full h-full min-h-[200px] md:min-h-[300px]">
        <Image
          src="/images/breadcrumb.jpg"
          alt="Placeholder"
          fill
          sizes=""
          className="object-cover object-center brightness-50"
        />
        <h1 className="absolute text-white text-4xl md:text-5xl font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0 md:bottom-10 md:left-10">
          {pageName}
        </h1>
      </div>
    </MaxWidthWrapper>
  );
};

export default BreadCrumb;
