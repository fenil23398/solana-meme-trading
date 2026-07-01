import { BarChart3, Users, Zap } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
} from "@/components/landing/scroll-reveal"
import { WHY_CHADWALLET } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ICONS = {
  users: Users,
  zap: Zap,
  chart: BarChart3,
} as const

export function WhyChadWallet() {
  return (
    <LandingSection id="why-chadwallet" variant="elevated">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <h2 className="section-title">Why fomo.family?</h2>
        <p className="section-subtitle mx-auto mt-5 max-w-lg">
          Everything you need to trade Solana memecoins — social alpha, instant
          execution, and smarter research in one app.
        </p>
      </ScrollReveal>

      <ScrollStagger className="mt-12 grid gap-5 sm:mt-16 sm:gap-6 lg:grid-cols-3">
        {WHY_CHADWALLET.map((item, index) => {
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
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                      <Icon className="size-6 text-brand" strokeWidth={1.75} />
                    </div>
                    <span className="font-mono text-xs text-white/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-semibold leading-snug tracking-[-0.01em] text-white">
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
    </LandingSection>
  )
}
