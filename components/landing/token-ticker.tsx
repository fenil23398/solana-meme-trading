"use client"

import { useEffect, useState } from "react"

import { TICKER_TOKENS, type TickerToken } from "@/lib/constants"
import { cn } from "@/lib/utils"

const REFRESH_MS = 60_000

function TokenIcon({ symbol, icon }: { symbol: string; icon?: string }) {
  const [failed, setFailed] = useState(false)

  if (!icon || failed) {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[8px] font-bold uppercase text-white/70 sm:h-5 sm:w-5 sm:text-[9px]">
        {symbol.slice(0, 1)}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon}
      alt=""
      width={20}
      height={20}
      className="h-4 w-4 shrink-0 rounded-full object-cover ring-1 ring-white/10 sm:h-5 sm:w-5"
      onError={() => setFailed(true)}
    />
  )
}

function TickerItem({ symbol, change, positive, icon }: TickerToken) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 px-3 sm:gap-2 sm:px-5">
      <TokenIcon symbol={symbol} icon={icon} />
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
    </span>
  )
}

export function TokenTicker({ className }: { className?: string }) {
  const [tokens, setTokens] = useState<TickerToken[]>(TICKER_TOKENS)

  useEffect(() => {
    let active = true

    async function loadTickers() {
      try {
        const response = await fetch("/api/tokens/trending")
        if (!response.ok) return

        const data = (await response.json()) as { tokens?: TickerToken[] }
        if (active && data.tokens?.length) {
          setTokens(data.tokens)
        }
      } catch {
        // Keep showing current tokens on error
      }
    }

    loadTickers()
    const interval = setInterval(loadTickers, REFRESH_MS)

    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const items = [...tokens, ...tokens]

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
        {items.map((token, i) => (
          <TickerItem
            key={`${token.symbol}-${token.address ?? i}-${i}`}
            {...token}
          />
        ))}
      </div>
    </div>
  )
}
