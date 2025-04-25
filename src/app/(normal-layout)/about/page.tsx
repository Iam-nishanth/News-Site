import { RevealY } from "@/utils/animation/revealY";
import AboutSection from "@/views/AboutSection";
import BreadCrumb from "@/views/BreadCrumb";
import NewsSectionTwo from "@/views/NewsSection_2";
import PopularSection from "@/views/PopularSection";
import React from "react";

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col gap-5 pt-4">
      <BreadCrumb pageName="About us" />
      <AboutSection />
      <RevealY width="100%">
        <NewsSectionTwo heading="" />
      </RevealY>
      <PopularSection />
    </main>
  );
}
