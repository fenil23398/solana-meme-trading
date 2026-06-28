"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { TradingPageLoader } from "@/components/trading/trading-page-loader"
import { TokenCenterPanel } from "@/components/trading/token-center-panel"
import { TradePanel } from "@/components/trading/trade-panel"
import { TrendingSidebar } from "@/components/trading/trending-sidebar"
import { useTokenBundle } from "@/hooks/queries/use-token-bundle"
import { useTokenLiveStream } from "@/hooks/use-token-live-stream"
import { useTradingRefetchOnFocus } from "@/hooks/use-trading-refetch-on-focus"
import { prefetchTokenQueries } from "@/lib/queries/prefetch-token"

export function TradingWorkspace() {
  const params = useParams<{ address: string }>()
  const queryClient = useQueryClient()
  useTradingRefetchOnFocus()
  const { data: bundle, isPending: bundlePending } = useTokenBundle()

  useTokenLiveStream()

  useEffect(() => {
    prefetchTokenQueries(queryClient, params.address)
  }, [params.address, queryClient])

  const showPageLoader = bundlePending && !bundle

  return (
    <>
      <TradingPageLoader show={showPageLoader} />
      <div className="grid min-h-0 grid-cols-1 items-start lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <TrendingSidebar />
        <TokenCenterPanel key={params.address} />
        <TradePanel key={params.address} />
      </div>
    </>
  )
}
