import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import NewsletterForm from "@/components/NewsletterForm";
import { MailCheck } from "lucide-react";
import React from "react";

const NewsLetter = () => {
  return (
    <div className="py-20">
      <div className=" h-full min-h-[300px] w-full bg-[#f3f3f3] dark:bg-[#35374B]">
        <div className="bg-[#212121] w-16 h-16 rounded-[50%] flex justify-center items-center mx-auto relative -top-8">
          <MailCheck className="w-6 h-6 text-white" />
        </div>
        <div className="text-center flex flex-col gap-5">
          <h2 className="uppercase tracking-[2px] text-base font-medium">
            Newsletter
          </h2>
          <h3 className="lg:text-5xl text-3xl  font-Roboto font-bold">
            Become Informative
          </h3>
          <p className="text-[#353535] dark:text-gray-400">
            Sign up for Stock Liv’s Weekly Digest and get the best of News,
            tailored for you.
          </p>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
