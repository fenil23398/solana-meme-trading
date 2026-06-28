"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { buildDexScreenerChartUrl } from "@/lib/dexscreener"
import { chartPairQueryOptions } from "@/lib/queries/token.client"
import { cn } from "@/lib/utils"

export function TradingViewChart({ className }: { className?: string }) {
  const params = useParams<{ address: string }>()
  const address = params.address

  const { data, isPending, isError } = useQuery(chartPairQueryOptions(address))

  const chartAddress = data?.pairAddress ?? address
  const embedUrl = chartAddress ? buildDexScreenerChartUrl(chartAddress) : null
  const showChartSkeleton = isPending && !data

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080404]",
        className
      )}
    >
      {showChartSkeleton ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080404]">
          <div className="h-48 w-full max-w-md animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
      ) : null}

      {!showChartSkeleton && (isError || !embedUrl) ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080404] text-sm text-white/40">
          Chart unavailable
        </div>
      ) : null}

      {embedUrl ? (
        <div className="relative h-[480px] overflow-hidden">
          <iframe
            key={embedUrl}
            src={embedUrl}
            title="TradingView chart"
            className="h-[504px] w-full -translate-y-3 border-0"
            allow="clipboard-write"
            loading="lazy"
            scrolling="no"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[#080404] via-[#080404]/95 to-transparent"
          />
        </div>
      ) : null}
    </div>
  )
}
