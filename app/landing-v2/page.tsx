import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { CtaSection } from "@/components/landing/cta-section"
import { CrossPlatform } from "@/components/landing/cross-platform"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { OutrunBots } from "@/components/landing/outrun-bots"
import { TokenTicker } from "@/components/landing/token-ticker"
import { WhyChadWallet } from "@/components/landing/why-chadwallet"
import { getQueryClient } from "@/lib/get-query-client"
import { queryKeys } from "@/lib/queries/keys"
import { getTradingTrending } from "@/lib/queries/trending.server"
import { getStaleTrendingCache } from "@/lib/trending-cache"

export default async function LandingV2Page() {
  const queryClient = getQueryClient()

  try {
    const tokens = await getTradingTrending()
    if (tokens.length > 0) {
      queryClient.setQueryData(queryKeys.trading.trending(), tokens)
    }
  } catch {
    const stale = getStaleTrendingCache()
    if (stale?.length) {
      queryClient.setQueryData(queryKeys.trading.trending(), stale)
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-svh overflow-x-hidden bg-[#080404]">
        <TokenTicker className="fixed top-0 z-[60] w-full border-b border-white/[0.06]" />
        <div className="pb-10 pt-9">
          <Header />
          <main>
            <Hero />
            <WhyChadWallet />
            <OutrunBots />
            <CrossPlatform />
            <CtaSection />
          </main>
          <Footer />
        </div>
        <TokenTicker className="fixed bottom-0 z-[60] w-full border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]" />
      </div>
    </HydrationBoundary>
  )
}
