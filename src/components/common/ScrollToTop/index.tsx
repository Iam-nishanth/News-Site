"use client";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/utils/animation/reveal";
import { RevealY } from "@/utils/animation/revealY";
import { ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const ScrollToTop = () => {
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
    <div className="fixed bottom-3 right-3 w-10 flex justify-center items-center">
      {sticky && (
        <Reveal>
          <Button
            type="button"
            variant="outline"
            onClick={scrollTop}
            className="rounded-full w-10 h-10 px-0 py-0"
          >
            <span className="sr-only">Scroll to top</span>
            <ChevronUp size={20} />
          </Button>
        </Reveal>
      )}
    </div>
  );
};

export default ScrollToTop;
