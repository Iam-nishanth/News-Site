import { formatDay } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  link: string;
  imgSrc: string;
  className?: string;
  title: string;
  author: string;
  commentCount?: number;
  likeCount?: number;
  smallCard?: boolean;
}

const HeroCard: React.FC<Props> = ({
  link,
  imgSrc,
  className,
  title,
  author,
  commentCount,
  likeCount,
  smallCard,
}) => {
  const date = formatDay(new Date());
  return (
    <Link
      href={link}
      className={cn(
        "w-full relative bg-white transition duration-300 group",
        className
      )}
    >
      <Image
        src={imgSrc}
        alt="placeholder"
        layout="fill"
        className="object-cover absolute z-0 dark:brightness-[0.8]"
      />
      <div className=" bg-black/15 group-hover:bg-black/60 group-hover:bg-opacity-70 absolute w-full h-full top-0 left-0 transition-all duration-300 flex justify-center items-center text-white">
        <div className=" relative text-center flex flex-col justify-center items-center h-full gap-3">
          <p
            className={cn(
              " text-sm bg-blue-800 px-3 text-white absolute",
              smallCard ? "top-3" : "top-8"
            )}
          >
            Category
          </p>
          <p className="flex items-center gap-2 transition-transform duration-300">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              {date}
            </span>
          </p>
          <h2
            className={cn(
              " font-bold px-5 transition-transform duration-300 hover:heading-underline",
              smallCard ? "text-xl" : "text-2xl"
            )}
          >
            {title}
          </h2>
          <p className=" text-md font-medium">By {author}</p>
          <div className=" -mb-[180px] sm:-mb-[200px] group-hover:mb-0 invisible group-hover:visible transition-all duration-300 flex gap-5 overflow-y-hidden">
            <span className=" text-blue-600 text-sm">
              <MessageCircle />
              {commentCount}
            </span>
            <span className=" text-red-600 text-sm">
              <Heart />
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroCard;
