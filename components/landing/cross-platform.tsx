import { Monitor, Smartphone } from "lucide-react"

import { LandingSection } from "@/components/landing/landing-section"
import {
  ScrollReveal,
  ScrollStagger,
  ScrollStaggerItem,
} from "@/components/landing/scroll-reveal"

export function CrossPlatform() {
  return (
    <LandingSection variant="alt">
      <ScrollReveal className="mx-auto max-w-2xl text-center">
        <p className="section-label">Cross-platform</p>
        <h2 className="section-title mt-4">
          Trade from anywhere.
          <span className="block text-white/45">Never lose a beat.</span>
        </h2>
        <p className="section-subtitle mx-auto mt-5 max-w-lg">
          Open a trade on your phone, close it on your desktop — seamlessly
          synced across every device.
        </p>
      </ScrollReveal>

      <ScrollStagger className="mx-auto mt-12 flex max-w-3xl items-center justify-center gap-6 sm:mt-14 sm:gap-10">
        <ScrollStaggerItem className="flex flex-1 sm:flex-none">
          <div className="landing-card flex w-full flex-col items-center gap-3.5 px-6 py-6 sm:px-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/15 bg-brand/8">
              <Smartphone className="size-6 text-brand" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-white/70">Mobile</span>
          </div>
        </ScrollStaggerItem>

        <div className="hidden flex-1 items-center sm:flex">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="mx-4 h-1.5 w-1.5 rounded-full bg-brand/60" />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        <ScrollStaggerItem className="flex flex-1 sm:flex-none">
          <div className="landing-card flex w-full flex-col items-center gap-3.5 px-6 py-6 sm:px-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/15 bg-brand/8">
              <Monitor className="size-6 text-brand" strokeWidth={1.75} />
            </div>
            <span className="text-sm font-medium text-white/70">Desktop</span>
          </div>
        </ScrollStaggerItem>
      </ScrollStagger>

      <ScrollStagger className="mx-auto mt-12 grid max-w-4xl gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
        {[
          { label: "Execution speed", value: "<1s" },
          { label: "Primary chain", value: "Solana" },
          { label: "Trading fees", value: "Lowest" },
        ].map((stat) => (
          <ScrollStaggerItem key={stat.label}>
            <div className="landing-card landing-card-hover px-6 py-6 text-center">
              <p className="font-heading text-2xl font-bold tracking-[-0.02em] text-brand sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm text-white/45">{stat.label}</p>
            </div>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </LandingSection>
  )
}
