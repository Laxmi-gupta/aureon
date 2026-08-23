import { Nav } from '@/components/marketing/Nav';
import { Hero } from '@/components/marketing/Hero';
import { StorytellingSection } from '@/components/marketing/StorytellingSection';
import { ShowcaseProjectIntelligence } from '@/components/marketing/ShowcaseProjectIntelligence';
import { ShowcaseTaskFlow } from '@/components/marketing/ShowcaseTaskFlow';
import { ShowcaseApprovalHub } from '@/components/marketing/ShowcaseApprovalHub';
import { ShowcaseTeamPulse } from '@/components/marketing/ShowcaseTeamPulse';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { AboutSection } from '@/components/marketing/AboutSection';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export function LandingPage() {
  return (
    <div className="dark bg-ink-950">
      <Nav />
      <main>
        <Hero />
        <StorytellingSection />
        <ShowcaseProjectIntelligence />
        <ShowcaseTaskFlow />
        <ShowcaseApprovalHub />
        <ShowcaseTeamPulse />
        <FeatureGrid />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
