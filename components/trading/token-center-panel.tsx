"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Check, Copy, ExternalLink, Globe } from "lucide-react"

import { PriceText } from "@/components/ui/price-text"
import { TradingViewChart } from "@/components/trading/trading-view-chart"
import { TokenImage } from "@/components/ui/token-image"
import { useResolvedTokenOverview } from "@/hooks/queries/use-resolved-token-overview"
import {
  formatCompactRelativeTime,
  formatPercent,
  formatSharePercent,
  formatTokenAmount,
  formatUsd,
  shortenAddress,
} from "@/lib/format"
import { tradeId } from "@/lib/trading/trade-id"
import { cn } from "@/lib/utils"
import type { TokenDetail } from "@/lib/types/trading"

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
  return <p className="mt-0.5 text-sm font-medium text-white">{children}</p>
}

function PctBadge({ value, loading }: { value?: number; loading?: boolean }) {
  if (loading) {
    return <div className="h-5 w-14 animate-pulse rounded bg-white/[0.08]" />
  }
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return <span className="text-sm text-white/30">—</span>
  }
  const positive = value >= 0
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-xs font-medium",
        positive
          ? "bg-brand/15 text-brand"
          : "bg-red-500/15 text-red-400"
      )}
    >
      {formatPercent(value)}
    </span>
  )
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.257 5.634L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.281c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.94z" />
    </svg>
  )
}

function SocialLinks({ overview }: { overview: TokenDetail }) {
  const socials = overview.socials ?? []
  const websites = overview.websites ?? []

  const twitter = socials.find((s) => s.type === "twitter")
  const telegram = socials.find((s) => s.type === "telegram")
  const website = websites[0]

  if (!twitter && !telegram && !website) return null

  return (
    <div className="flex items-center gap-1.5">
      {twitter && (
        <a
          href={twitter.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter / X"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:border-white/[0.14] hover:text-white"
        >
          <XIcon className="h-3.5 w-3.5" />
        </a>
      )}
      {telegram && (
        <a
          href={telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/50 transition-colors hover:border-white/[0.14] hover:text-white"
        >
          <TelegramIcon className="h-3.5 w-3.5" />
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website"
          className="flex h-7 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 text-[11px] text-white/50 transition-colors hover:border-white/[0.14] hover:text-white"
        >
          <Globe className="h-3 w-3 shrink-0" />
          <span className="max-w-[80px] truncate">
            {new URL(website).hostname.replace(/^www\./u, "")}
          </span>
        </a>
      )}
      {overview.dex && (
        <span className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white/30">
          {overview.dex}
        </span>
      )}
    </div>
  )
}

function BuySellBar({
  buys,
  sells,
  loading,
}: {
  buys?: number
  sells?: number
  loading?: boolean
}) {
  if (loading) {
    return <div className="h-1.5 animate-pulse rounded-full bg-white/[0.08]" />
  }

  const total = (buys ?? 0) + (sells ?? 0)
  if (!total) return null

  const buyPct = ((buys ?? 0) / total) * 100
  const sellPct = 100 - buyPct

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-mono text-brand">
          {(buys ?? 0).toLocaleString()} buys
        </span>
        <span className="font-mono text-red-400">
          {(sells ?? 0).toLocaleString()} sells
        </span>
      </div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${buyPct.toFixed(1)}%` }}
        />
        <div
          className="h-full flex-1 rounded-full bg-red-500/60"
        />
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] text-white/30">
        <span>{buyPct.toFixed(0)}%</span>
        <span>{sellPct.toFixed(0)}%</span>
      </div>
    </div>
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

  const positive24h = overview.priceChange24h >= 0

  return (
    <section className="flex min-h-0 flex-col gap-0">
      {/* ── Token header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <TokenImage
            symbol={overview.symbol}
            address={overview.address}
            icon={overview.icon}
            className="!rounded-2xl h-10 w-10 shrink-0"
            fallbackClassName="!rounded-2xl h-10 w-10 text-base"
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="font-heading text-xl font-bold tracking-[-0.02em] text-white">
                {overview.symbol}
              </h1>
              <span className="hidden truncate text-sm text-white/40 sm:inline">
                {overview.name}
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="inline-flex items-center gap-0.5 font-mono text-[11px] text-white/35">
                {shortenAddress(overview.address, 5)}
                <CopyAddressButton address={overview.address} />
              </span>
              {overview.pairCreatedAt ? (
                <span className="text-[11px] text-white/25">
                  · Listed {formatCompactRelativeTime(Math.floor(overview.pairCreatedAt / 1000))} ago
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Price + 24h change */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-xl font-semibold text-white">
              <PriceText value={overview.price} />
            </p>
            <p
              className={cn(
                "font-mono text-xs font-medium",
                positive24h ? "text-brand" : "text-red-400"
              )}
            >
              {formatPercent(overview.priceChange24h)} 24h
            </p>
          </div>
        </div>
      </div>

      {/* ── Multi-interval price changes ── */}
      <div className="flex items-center gap-0 overflow-x-auto border-b border-white/[0.06] scrollbar-none">
        {(
          [
            { label: "5m", value: overview.priceChange5m },
            { label: "1h", value: overview.priceChange1h },
            { label: "6h", value: overview.priceChange6h },
            { label: "24h", value: overview.priceChange24h },
          ] as Array<{ label: string; value: number | undefined }>
        ).map(({ label, value }) => {
          const pos = (value ?? 0) >= 0
          const isLoadingValue = isPlaceholder && value === undefined
          return (
            <div
              key={label}
              className="flex min-w-[70px] flex-1 flex-col items-center border-r border-white/[0.06] px-2 py-2.5 last:border-r-0"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                {label}
              </span>
              {isLoadingValue ? (
                <div className="mt-1 h-4 w-12 animate-pulse rounded bg-white/[0.08]" />
              ) : (
                <span
                  className={cn(
                    "mt-1 font-mono text-xs font-semibold",
                    value === undefined || value === null
                      ? "text-white/25"
                      : pos
                        ? "text-brand"
                        : "text-red-400"
                  )}
                >
                  {value !== undefined && value !== null && Number.isFinite(value)
                    ? formatPercent(value)
                    : "—"}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 gap-px border-b border-white/[0.06] bg-white/[0.04] sm:grid-cols-4">
        {[
          {
            label: "Market cap",
            value: formatUsd(overview.marketCap, true),
            loading: isInitialLoad && overview.marketCap === 0,
          },
          {
            label: "FDV",
            value: formatUsd(overview.fdv ?? overview.marketCap, true),
            loading: isInitialLoad && (overview.fdv ?? 0) === 0,
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
            className="bg-[#0a0510] px-4 py-3"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
              {stat.label}
            </p>
            <StatValue loading={stat.loading}>{stat.value}</StatValue>
          </div>
        ))}
      </div>

      {/* ── Socials + buy/sell bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <SocialLinks overview={overview} />

        <div className="min-w-[180px] max-w-[240px] flex-1">
          <BuySellBar
            buys={overview.buys24h}
            sells={overview.sells24h}
            loading={isInitialLoad && !overview.buys24h}
          />
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="px-4 py-4 sm:px-5">
        <TradingViewChart key={overview.address} />
      </div>

      {/* ── Trades / Holders tabs ── */}
      <div className="px-4 pb-4 sm:px-5">
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
                    ? `${overview.holderCount.toLocaleString()} holders — detailed breakdown unavailable`
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
