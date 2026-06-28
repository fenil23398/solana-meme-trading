import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { TradingHeader } from "@/components/trading/trading-header"
import { TokenTicker } from "@/components/landing/token-ticker"
import { getQueryClient } from "@/lib/get-query-client"
import { queryKeys } from "@/lib/queries/keys"
import { getTradingTrending } from "@/lib/queries/trending.server"
import { getStaleTrendingCache } from "@/lib/trending-cache"

export default async function TradeLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <TradingHeader />
          <main>{children}</main>
        </div>
        <TokenTicker className="fixed bottom-0 z-[60] w-full border-t border-white/[0.06] pb-[env(safe-area-inset-bottom)]" />
      </div>
    </HydrationBoundary>
  )
}
