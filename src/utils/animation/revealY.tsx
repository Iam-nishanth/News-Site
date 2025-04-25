/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%";
}

export const RevealY = ({ children, width = "fit-content" }: RevealProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const mainControls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          duration: 0.5,
          delay: 0.1,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
