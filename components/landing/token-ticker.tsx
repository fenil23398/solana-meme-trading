"use client"

import { useMemo } from "react"

import { TokenImage } from "@/components/ui/token-image"
import { useTradingTrending } from "@/hooks/queries/use-trading-trending"
import { mapTokenDetailsToTickers } from "@/lib/ticker"
import { cn } from "@/lib/utils"

function TickerItem({
  symbol,
  change,
  positive,
  icon,
  address,
}: ReturnType<typeof mapTokenDetailsToTickers>[number]) {
  const content = (
    <>
      <TokenImage
        symbol={symbol}
        address={address}
        icon={icon}
        className="h-4 w-4 sm:h-5 sm:w-5"
        fallbackClassName="h-4 w-4 text-[8px] sm:h-5 sm:w-5 sm:text-[9px]"
      />
      <span className="max-w-[5.5rem] truncate text-xs font-medium text-white/80 sm:max-w-none sm:text-[13px]">
        ${symbol}
      </span>
      <span
        className={cn(
          "shrink-0 font-mono text-[11px] tabular-nums sm:text-[12px]",
          positive ? "text-brand" : "text-red-400/90"
        )}
      >
        {change}
      </span>
    </>
  )

  // Links disabled — trading page commented out
  // if (address && !address.startsWith("fallback-")) {
  //   return (
  //     <Link
  //       href={`/trade/${address}`}
  //       className="inline-flex shrink-0 items-center gap-1.5 px-3 transition-opacity hover:opacity-80 sm:gap-2 sm:px-5"
  //     >
  //       {content}
  //     </Link>
  //   )
  // }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 px-3 sm:gap-2 sm:px-5">
      {content}
    </span>
  )
}

export function TokenTicker({ className }: { className?: string }) {
  const { data: tokens = [] } = useTradingTrending()
  const tickerTokens = useMemo(() => mapTokenDetailsToTickers(tokens), [tokens])
  const items = [...tickerTokens, ...tickerTokens]

  if (tickerTokens.length === 0) return null

  return (
    <div
      className={cn(
        "relative overflow-hidden border-white/[0.06] bg-landing-ticker backdrop-blur-md",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-landing-ticker to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-landing-ticker to-transparent sm:w-20" />
      <div className="flex w-max animate-marquee items-center py-2 sm:py-2.5">
        {items.map((token, index) => (
          <TickerItem
            key={`${token.address ?? token.symbol}-${index}`}
            {...token}
          />
        ))}
      </div>
    </div>
  )
}
