'use client'

import { MarketingNav } from './MarketingNav'
import { HeroSection } from './HeroSection'
import { TrustedBy } from './TrustedBy'
import { HowItWorks } from './HowItWorks'
import { BenefitsSection } from './BenefitsSection'
import { FeatureBento } from './FeatureBento'
import { MoreFeaturesGrid } from './MoreFeaturesGrid'
import { TestimonialsSection } from './TestimonialsSection'
import { SiteFooter } from './SiteFooter'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] text-zinc-950 antialiased">
      <MarketingNav />
      <main className="relative isolate overflow-x-hidden">
        <HeroSection />
        <TrustedBy />
        <HowItWorks />
        <BenefitsSection />
        <FeatureBento />
        <MoreFeaturesGrid />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </div>
  )
}
