/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface RevealProps {
  children: JSX.Element;
  width?: "fit-content" | "100%";
}

export const Reveal = ({ children, width = "fit-content" }: RevealProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
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
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
