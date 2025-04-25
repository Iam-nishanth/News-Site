"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Adjust the import path based on your project structure
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

interface Headline {
  text: string;
  href: string;
}

interface Props {
  headlines: Headline[];
}

const NewsTicker: React.FC<Props> = ({ headlines }) => {
  return (
    <div className="relative h-full w-full sm:w-3/5 flex items-center px-2 sm:px-0 self-end">
      <Carousel
        className="w-full"
        opts={{
          slidesToScroll: 1,
          loop: true,
          dragFree: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {headlines.map((headline, index) => (
            <CarouselItem key={index} className="pl-7">
              <Link
                href={headline.href}
                className="inline-block text-white no-underline text-sm font-medium whitespace-nowrap overflow-hidden-important max-w-[70%] text-ellipsis"
              >
                {headline.text}
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="w-full h-full flex">
          <CarouselPrevious className="right-7 rounded-none bg-transparent border border-white w-5 h-5" />
          <CarouselNext className=" right-0 rounded-none bg-transparent border border-white w-5 h-5" />
        </div>
      </Carousel>
    </div>
  );
};

export default NewsTicker;
