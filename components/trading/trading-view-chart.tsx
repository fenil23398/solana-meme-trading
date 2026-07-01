"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { buildDexScreenerChartUrl } from "@/lib/dexscreener"
import { chartPairQueryOptions } from "@/lib/queries/token.client"
import { cn } from "@/lib/utils"

export function TradingViewChart({ className }: { className?: string }) {
  const params = useParams<{ address: string }>()
  const address = params.address

  const { data, isPending, isError } = useQuery(chartPairQueryOptions(address))

  // Track if the iframe content has finished loading
  const [iframeReady, setIframeReady] = useState(false)
  const prevEmbedUrlRef = useRef<string | null>(null)

  const chartAddress = data?.pairAddress ?? address
  const embedUrl = chartAddress ? buildDexScreenerChartUrl(chartAddress) : null

  // Reset iframe ready state when the embed URL changes
  useEffect(() => {
    if (embedUrl !== prevEmbedUrlRef.current) {
      prevEmbedUrlRef.current = embedUrl
      setIframeReady(false)
    }
  }, [embedUrl])

  const handleIframeLoad = useCallback(() => {
    setIframeReady(true)
  }, [])

  // Show our skeleton whenever pair is being fetched OR iframe hasn't loaded yet
  const showSkeleton = (isPending && !data) || !iframeReady
  const showError = !showSkeleton && (isError || !embedUrl)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080404]",
        className
      )}
    >
      <div className="relative h-[480px] overflow-hidden">
        {/* Skeleton overlay — sits above iframe until iframe fires load */}
        {showSkeleton ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#080404]">
            <div className="h-32 w-full animate-pulse rounded-lg bg-white/[0.04]" />
            <div className="h-32 w-full animate-pulse rounded-lg bg-white/[0.03]" />
            <div className="h-16 w-full animate-pulse rounded-lg bg-white/[0.02]" />
          </div>
        ) : null}

        {showError ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#080404] text-sm text-white/40">
            Chart unavailable
          </div>
        ) : null}

        {embedUrl ? (
          <>
            <iframe
              key={embedUrl}
              src={embedUrl}
              title="TradingView chart"
              className="h-[504px] w-full -translate-y-3 border-0"
              allow="clipboard-write"
              loading="lazy"
              scrolling="no"
              onLoad={handleIframeLoad}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[#080404] via-[#080404]/95 to-transparent"
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
