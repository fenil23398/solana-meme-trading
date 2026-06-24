import Link from "next/link"
import { ArrowRight, Coins, Copy, Zap } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
} from "@/components/landing/scroll-reveal"
import { OUTRUN_BOTS } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ICONS = {
  zap: Zap,
  copy: Copy,
  coins: Coins,
} as const

export function OutrunBots() {
  return (
    <LandingSection variant="base" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(204,255,0,0.06),transparent)]" />

      <div className="relative">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">Built for speed</p>
          <h2 className="section-title mt-4">Outrun the Bots</h2>
          <p className="section-subtitle mx-auto mt-5 max-w-xl">
            The fastest way to trade memecoins on Solana. Stay ahead of every
            launch, every pump, every opportunity.
          </p>
        </ScrollReveal>

        <ScrollStagger className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 lg:grid-cols-3">
          {OUTRUN_BOTS.map((item, index) => {
            const Icon = ICONS[item.icon]
            return (
              <ScrollStaggerItem key={item.title}>
                <article
                  className={cn(
                    "landing-card landing-card-hover group relative h-full overflow-hidden p-6 sm:p-7 lg:p-8"
                  )}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand/5 blur-2xl transition-opacity group-hover:bg-brand/10" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                      <Icon className="size-6 text-brand" strokeWidth={1.75} />
                    </div>

                    <span className="mt-6 block font-mono text-xs text-white/30">
                      0{index + 1}
                    </span>

                    <h3 className="mt-2 font-heading text-xl font-semibold leading-snug tracking-[-0.01em] text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                      {item.description}
                    </p>
                  </div>
                </article>
              </ScrollStaggerItem>
            )
          })}
        </ScrollStagger>

        <ScrollReveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href="#download"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full max-w-md gap-2.5 bg-brand px-8 text-[15px] font-semibold text-black hover:bg-brand/90 sm:w-auto"
            )}
          >
            I don&apos;t wanna miss out!
            <ArrowRight className="size-4 shrink-0" strokeWidth={2} />
          </Link>
        </ScrollReveal>
      </div>
    </LandingSection>
  )
}
