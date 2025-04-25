"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { RevealY } from "@/utils/animation/revealY";

const Socials = () => {
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 150) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const scrollTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <div className="hidden sm:block sm:fixed top-1/2 right-3 w-10">
        <div className="flex flex-col gap-5 justify-center items-center">
          <RevealY>
            <Link href="https://facebook.com" className="no-underline w-full">
              <Image
                quality={100}
                src="/images/socials/facebook.svg"
                alt="facebook"
                width={30}
                height={30}
                className="hover:scale-110 transition-transform ease-in-out"
              />
              <span className="sr-only">Facebook</span>
            </Link>
          </RevealY>
          <RevealY>
            <Link href="https://instagram.com" className="no-underline w-full">
              <Image
                quality={100}
                src="/images/socials/instagram.svg"
                alt="instagram"
                width={25}
                height={25}
                className="hover:scale-110 transition-transform ease-in-out"
              />
              <span className="sr-only">Instagram</span>
            </Link>
          </RevealY>
          <RevealY>
            <Link href="https://youtube.com" className="no-underline w-fit">
              <Image
                quality={100}
                src="/images/socials/youtube.svg"
                alt="youtube"
                width={32}
                height={32}
                className="hover:scale-110 transition-transform ease-in-out"
              />
              <span className="sr-only">Youtube</span>
            </Link>
          </RevealY>
        </div>
      </div>
    </>
  );
};

export default Socials;
