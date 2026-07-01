import Image from "next/image"

import { AppStoreButtons } from "@/components/landing/app-store-buttons"
import { PhoneMockup } from "@/components/landing/brand-logo"
import { FomoLogo } from "@/components/landing/v2/fomo-logo"
import { LandingSection } from "@/components/landing/landing-section"
import { HeroReveal } from "@/components/landing/scroll-reveal"

export function Hero() {
  return (
    <LandingSection
      variant="base"
      bordered={false}
      className="relative overflow-hidden pt-14 sm:pt-20 lg:pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(204,255,0,0.07),transparent)]" />

      <div className="relative grid min-w-0 items-center gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex min-w-0 flex-col items-center text-center lg:items-start lg:text-left">
          <HeroReveal delay={0.05}>
            <FomoLogo className="mb-6 h-7 text-[#CBD0EB] lg:mb-8" />
          </HeroReveal>

          <HeroReveal delay={0.12}>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 sm:text-[11px]">
                Solana, all in one app
              </span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.2}>
            <h1 className="font-heading text-balance max-w-xl text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
              Where traders become{" "}
              <span className="text-brand">legends.</span>
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.28}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/55 sm:mt-7 sm:text-lg">
              From memecoins to viral tokens, trade Solana in seconds. Hunt every
              memecoin. One wallet.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.36}>
            <div className="mt-8 flex justify-center sm:mt-10 lg:justify-start">
              <AppStoreButtons />
            </div>
          </HeroReveal>
        </div>

        <HeroReveal delay={0.15} direction="right" className="relative mx-auto w-full max-w-[260px] sm:max-w-[280px]">
          <div className="hidden items-end justify-center gap-4 xl:flex">
            <HeroReveal delay={0.45} direction="left" className="mb-8 shrink-0">
              <div className="landing-card p-3">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.png"
                    alt=""
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">$QUEST</p>
                    <p className="font-mono text-xs text-brand">+81.28X</p>
                  </div>
                </div>
              </div>
            </HeroReveal>

            <PhoneMockup className="w-[270px] shrink-0" />

            <HeroReveal delay={0.55} direction="right" className="mb-8 shrink-0">
              <div className="landing-card p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 font-mono text-xs font-bold text-brand">
                    #1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Leaderboard</p>
                    <p className="text-xs text-white/45">Top performer</p>
                  </div>
                </div>
              </div>
            </HeroReveal>
          </div>

          <PhoneMockup className="w-full xl:hidden" />
        </HeroReveal>
      </div>
    </LandingSection>
  )
}
