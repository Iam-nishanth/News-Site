import HeroSection from "@/views/HeroSection";
import NewsSection from "@/views/NewsSection";
import { RevealY } from "@/utils/animation/revealY";
import StickySection from "@/views/StickySection";
import NewsLetter from "@/views/NewsLetter";
import NewsSectionTwo from "@/views/NewsSection_2";
import PopularSection from "@/views/PopularSection";

export default async function Home() {
  return (
    <main>
      <RevealY width="100%">
        <HeroSection />
      </RevealY>
      <NewsSection />
      <RevealY width="100%">
        <NewsLetter />
      </RevealY>
      <StickySection />
      <RevealY width="100%">
        <NewsSectionTwo heading="News Category" />
      </RevealY>
      <PopularSection />
    </main>
  );
}
