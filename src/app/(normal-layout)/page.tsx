import HeroSection from '@/views/HeroSection';
import NewsSection from '@/views/NewsSection';
import { RevealY } from '@/utils/animation/revealY';
import StickySection from '@/views/StickySection';
import NewsLetter from '@/views/NewsLetter';
import NewsSectionTwo from '@/views/NewsSection_2';
import PopularSection from '@/views/PopularSection';

async function getHeroNews() {
    try {
        const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/hero-section`);

        if (!response.ok) {
            throw new Error(`Failed to fetch hero section: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Failed to fetch hero section news:', error);
        return [];
    }
}

export default async function Home() {
    const heroNews = await getHeroNews();

    return (
        <main>
            <RevealY width="100%">
                <HeroSection heroNews={heroNews} loading={false} />
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
