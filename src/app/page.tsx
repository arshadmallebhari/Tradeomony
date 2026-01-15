import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedExporters from '@/components/home/FeaturedExporters';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturesSection from '@/components/home/FeaturesSection';

export default function Home() {
    return (
        <>
            <HeroSection />
            <CategoryGrid />
            <FeaturedExporters />
            <HowItWorks />
            <FeaturesSection />
        </>
    );
}
