import { BrandLogo } from "@/components/landing/brand-logo"
import { AppStoreButtons } from "@/components/landing/app-store-buttons"
import { LandingSection } from "@/components/landing/landing-section"
import { ScrollReveal } from "@/components/landing/scroll-reveal"

export function CtaSection() {
  return (
    <LandingSection
      id="download"
      variant="elevated"
      className="relative overflow-hidden"
      containerClassName="max-w-3xl text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(204,255,0,0.08),transparent)]" />

      <div className="relative">
        <ScrollReveal>
          <div className="flex justify-center">
            <BrandLogo size="lg" showName={false} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="section-title mt-10">
            A trading app
            <span className="block text-white/45">for the rest of us</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.18}>
          <p className="section-subtitle mx-auto mt-6 max-w-md">
            Join thousands of traders making their name on ChadWallet. Solana
            memecoins, zero complexity.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.26} className="mt-12 flex justify-center">
          <AppStoreButtons size="large" />
        </ScrollReveal>
      </div>
    </LandingSection>
  )
}
