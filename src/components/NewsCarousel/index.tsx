"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import NewsCardFour from "../NewsCard_4";

const NewsCarousel = () => {
  const Content = {
    tag: "Category",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
    createdAt: "DD Month YYYY",
    featuredImg: "/images/placeholder.webp",
  };

  const news = Array(8).fill(Content);
  return (
    <>
      <Carousel
        opts={{
          slidesToScroll: 2,
          breakpoints: {
            "(max-width: 768px)": { slidesToScroll: 1 },
          },
          loop: true,
          dragFree: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {news.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-[100%] md:basis-1/3 lg:basis-1/4 "
            >
              <div className="p-1">
                <div>
                  <NewsCardFour Content={item} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
};

export default NewsCarousel;
