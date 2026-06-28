"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { PriceText } from "@/components/ui/price-text"
import { TokenImage } from "@/components/ui/token-image"
import { useTradingTrending } from "@/hooks/queries/use-trading-trending"
import { formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

export function TrendingSidebar() {
  const params = useParams<{ address: string }>()
  const { data, isPending, isError, refetch } = useTradingTrending()
  const trendingTokens = data ?? []

  const waitingForTrending = isPending && trendingTokens.length === 0
  const showEmptyTrending = !waitingForTrending && trendingTokens.length === 0

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col overflow-hidden border-b border-white/[0.06]",
        "max-h-[min(280px,40dvh)]",
        "lg:sticky lg:top-[6.25rem] lg:max-h-[calc(100dvh-8.75rem)] lg:self-start",
        "lg:border-b-0 lg:border-r"
      )}
    >
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Trending
        </p>
        <h2 className="mt-1 font-heading text-lg font-semibold text-white">
          Solana tokens
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {waitingForTrending ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-white/[0.04]"
              />
            ))}
          </div>
        ) : showEmptyTrending ? (
          <div className="space-y-3 p-4 text-center">
            <p className="text-sm text-white/40">No trending tokens available</p>
            {isError ? (
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-xs font-medium text-brand hover:underline"
              >
                Retry
              </button>
            ) : null}
          </div>
        ) : (
          <ul className="p-2">
            {trendingTokens.map((token) => {
              const active = params.address === token.address
              const positive = token.priceChange24h >= 0

              return (
                <li key={token.address}>
                  <Link
                    href={`/trade/${token.address}`}
                    prefetch
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                      active
                        ? "bg-brand/10 ring-1 ring-brand/20"
                        : "hover:bg-white/[0.04]"
                    )}
                  >
                    <TokenImage
                      symbol={token.symbol}
                      address={token.address}
                      icon={token.icon}
                      className="h-8 w-8"
                      fallbackClassName="h-8 w-8 text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-white">
                          {token.symbol}
                        </p>
                        <p className="shrink-0 text-xs text-white/70">
                          <PriceText value={token.price} />
                        </p>
                      </div>
                      <p
                        className={cn(
                          "mt-0.5 font-mono text-[11px]",
                          positive ? "text-brand" : "text-red-400"
                        )}
                      >
                        {formatPercent(token.priceChange24h)}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
