"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Check, Copy } from "lucide-react"

import { PriceText } from "@/components/ui/price-text"
import { TradingViewChart } from "@/components/trading/trading-view-chart"
import { TokenImage } from "@/components/ui/token-image"
import { useResolvedTokenOverview } from "@/hooks/queries/use-resolved-token-overview"
import { formatCompactRelativeTime, formatPercent, formatSharePercent, formatTokenAmount, formatUsd, shortenAddress } from "@/lib/format"
import { tradeId } from "@/lib/trading/trade-id"
import { cn } from "@/lib/utils"

type Tab = "trades" | "holders"

const TRADE_ROW_GRID =
  "grid grid-cols-[2.5rem_2rem_minmax(4.75rem,1.2fr)_3.5rem_3rem] items-center gap-x-1.5 sm:grid-cols-[2.75rem_2.25rem_minmax(5.75rem,1.4fr)_4rem_3.5rem] sm:gap-x-2"

function TradeListHeader() {
  return (
    <li
      className={cn(
        TRADE_ROW_GRID,
        "sticky top-0 z-10 border-b border-white/[0.06] bg-[#0c0606] px-3 py-2",
        "font-mono text-[10px] uppercase tracking-[0.14em] text-white/30"
      )}
    >
      <span>Side</span>
      <span className="min-w-0 truncate">Wallet</span>
      <span className="min-w-0 text-right">Price</span>
      <span className="shrink-0 text-right">Vol</span>
      <span className="shrink-0 text-right">Time</span>
    </li>
  )
}

function StatValue({
  loading,
  children,
}: {
  loading?: boolean
  children: React.ReactNode
}) {
  if (loading) {
    return <div className="mt-1 h-4 w-16 animate-pulse rounded bg-white/[0.08]" />
  }

  return <p className="mt-1 text-sm font-medium text-white">{children}</p>
}

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Address copied" : "Copy address"}
      className="inline-flex shrink-0 items-center justify-center rounded p-0.5 text-white/35 transition-colors hover:text-white/70"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-brand" aria-hidden />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden />
      )}
    </button>
  )
}

export function TokenCenterPanel() {
  const params = useParams<{ address: string }>()
  const [tab, setTab] = useState<Tab>("trades")
  const { overview, isPlaceholder, isLoading, bundle } = useResolvedTokenOverview()

  useEffect(() => {
    setTab("trades")
  }, [params.address])

  const holders = bundle?.holders ?? []
  const trades = bundle?.trades ?? []
  const isInitialLoad = isPlaceholder && !bundle

  if (isLoading || !overview) {
    return (
      <div className="flex min-h-[480px] items-center justify-center p-6">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.05]" />
      </div>
    )
  }

  const positive = overview.priceChange24h >= 0

  return (
    <section className="flex min-h-0 flex-col gap-5 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <TokenImage
            symbol={overview.symbol}
            address={overview.address}
            icon={overview.icon}
            className="!rounded-2xl h-12 w-12"
            fallbackClassName="!rounded-2xl h-12 w-12 text-lg"
          />
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-[-0.02em] text-white">
              {overview.symbol}
            </h1>
            <p className="flex flex-wrap items-center gap-x-1 text-sm text-white/45">
              {overview.name}
              <span className="text-white/25"> · </span>
              <span className="inline-flex items-center gap-0.5 font-mono text-white/40">
                {shortenAddress(overview.address, 6)}
                <CopyAddressButton address={overview.address} />
              </span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <p
            className={cn(
              "font-mono text-2xl font-semibold",
              positive ? "text-brand" : "text-red-400"
            )}
          >
            {formatPercent(overview.priceChange24h)}
          </p>
          <p className="text-sm text-white/45">24h change</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Market cap",
            value: formatUsd(overview.marketCap, true),
            loading: isInitialLoad && overview.marketCap === 0,
          },
          {
            label: "Volume 24h",
            value: formatUsd(overview.volume24h, true),
            loading: isInitialLoad && overview.volume24h === 0,
          },
          {
            label: "Liquidity",
            value: formatUsd(overview.liquidity, true),
            loading: isInitialLoad && overview.liquidity === 0,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
              {stat.label}
            </p>
            <StatValue loading={stat.loading}>{stat.value}</StatValue>
          </div>
        ))}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">
            Price
          </p>
          <StatValue loading={isInitialLoad && overview.price === 0}>
            <PriceText value={overview.price} />
          </StatValue>
        </div>
      </div>

      <TradingViewChart key={overview.address} />

      <div>
        <div className="mb-3 flex gap-2">
          {(["trades", "holders"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                tab === value
                  ? "bg-brand text-black"
                  : "bg-white/[0.04] text-white/55 hover:text-white"
              )}
            >
              {value === "trades" ? "Live trades" : "Holders"}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {tab === "trades" ? (
            <ul className="max-h-[280px] overflow-y-auto">
              {isInitialLoad && trades.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-white/40">
                  Loading recent trades…
                </li>
              ) : trades.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-white/40">
                  No recent trades found for this token
                </li>
              ) : (
                <>
                  <TradeListHeader />
                  {trades.map((trade) => (
                    <li
                      key={tradeId(trade)}
                      className={cn(
                        TRADE_ROW_GRID,
                        "border-b border-white/[0.04] px-3 py-2 last:border-b-0",
                        "text-[11px] sm:text-xs"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 font-medium capitalize",
                          trade.side === "buy" ? "text-brand" : "text-red-400"
                        )}
                      >
                        {trade.side}
                      </span>
                      <span
                        className="min-w-0 truncate font-mono text-white/45"
                        title={trade.trader}
                      >
                        {shortenAddress(trade.trader, 2)}
                      </span>
                      <span className="min-w-0 truncate text-right font-mono text-white/80">
                        <PriceText value={trade.priceUsd} />
                      </span>
                      <span className="shrink-0 text-right font-mono text-white/50">
                        {formatUsd(trade.volumeUsd, true)}
                      </span>
                      <span
                        className="shrink-0 text-right font-mono tabular-nums text-white/35"
                        title={new Date(trade.time * 1000).toLocaleString()}
                      >
                        {formatCompactRelativeTime(trade.time)}
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          ) : (
            <ul className="max-h-[280px] divide-y divide-white/[0.05] overflow-y-auto">
              {isInitialLoad && holders.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-white/40">
                  Loading holders…
                </li>
              ) : holders.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-white/40">
                  {overview.holderCount
                    ? `${overview.holderCount.toLocaleString()} holders — detailed breakdown unavailable (BirdEye limit)`
                    : "Holder data unavailable"}
                </li>
              ) : (
                holders.map((holder) => (
                  <li
                    key={holder.address}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <p className="truncate font-mono text-white/70">
                      {shortenAddress(holder.address, 6)}
                    </p>
                    <div className="text-right">
                      <p className="text-white">{formatSharePercent(holder.percentage)}</p>
                      <p className="text-xs text-white/35">
                        {formatTokenAmount(holder.amount)}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
