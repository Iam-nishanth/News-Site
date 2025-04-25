import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import NewsTicker from "@/components/common/NewsTicker";
import { formatDay } from "@/lib/date";
import { Calendar } from "lucide-react";
import React from "react";

const news = [
  {
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    href: "/news/2",
  },
  {
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    href: "/news/3",
  },
  {
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    href: "/news/4",
  },
  {
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    href: "/news/5",
  },
];

const Headlines = () => {
  const date = formatDay(new Date());

  return (
    <div className="flex justify-center items-center w-full h-[30px] bg-gradient-to-r from-gray-800 to-blue-500 overflow-y-hidden">
      <MaxWidthWrapper className="text-white w-full h-full flex relative px-0 py-0">
        <p className="hidden sm:flex items-center gap-2 w-72">
          <Calendar className="w-4 h-4" color="#ffffff" />
          <span className="text-sm font-medium uppercase tracking-wide">
            {date}
          </span>
        </p>
        <div className="hidden sm:flex justify-center items-center w-32 h-full bg-slate-800">
          <span className="text-sm font-medium uppercase tracking-wide">
            Trending
          </span>
        </div>
        <NewsTicker headlines={news} />
      </MaxWidthWrapper>
    </div>
  );
};

export default Headlines;
