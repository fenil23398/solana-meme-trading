import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { TokenTicker } from "@/components/landing/token-ticker"
import { V2Cta } from "@/components/landing/v2/cta"
import { V2CrossPlatform } from "@/components/landing/v2/cross-platform"
import { V2Features } from "@/components/landing/v2/features"
import { V2Footer } from "@/components/landing/v2/footer"
import { V2Header } from "@/components/landing/v2/header"
import { V2Hero } from "@/components/landing/v2/hero"
import { PageBackground } from "@/components/landing/v2/page-background"
import { getQueryClient } from "@/lib/get-query-client"
import { queryKeys } from "@/lib/queries/keys"
import { getTradingTrending } from "@/lib/queries/trending.server"
import { getStaleTrendingCache } from "@/lib/trending-cache"

export default async function Page() {
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
      <div className="fomo-page relative min-h-svh overflow-x-hidden bg-[#060510]">
        <PageBackground />
        <TokenTicker className="fixed top-0 z-[60] w-full border-b border-white/[0.05] [background:#06051055] backdrop-blur-md" />
        <div className="relative z-[1] pb-10 pt-9">
          <V2Header />
          <main>
            <V2Hero />
            <V2CrossPlatform />
            <V2Features />
            <V2Cta />
          </main>
          <V2Footer />
        </div>
        <TokenTicker className="fixed bottom-0 z-[60] w-full border-t border-white/[0.05] pb-[env(safe-area-inset-bottom)] [background:#06051055] backdrop-blur-md" />
      </div>
    </HydrationBoundary>
  )
}
