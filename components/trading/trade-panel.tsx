"use client"

import { usePrivy } from "@privy-io/react-auth"

import { useResolvedTokenOverview } from "@/hooks/queries/use-resolved-token-overview"
import { useAuthLogin } from "@/hooks/use-auth-login"
import { useWalletTokenBalance } from "@/hooks/use-wallet-token-balance"
import { PriceText } from "@/components/ui/price-text"
import { buttonVariants } from "@/components/ui/button"
import { formatTokenAmount } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useTradingStore } from "@/stores/trading-store"

export function TradePanel() {
  const { authenticated } = usePrivy()
  const { signIn, authError } = useAuthLogin()
  const { overview, isLoading } = useResolvedTokenOverview()
  const { balance, isFetched } = useWalletTokenBalance(overview?.address)
  const tradeSide = useTradingStore((state) => state.tradeSide)
  const tradeAmount = useTradingStore((state) => state.tradeAmount)
  const setTradeSide = useTradingStore((state) => state.setTradeSide)
  const setTradeAmount = useTradingStore((state) => state.setTradeAmount)

  const hasPosition = authenticated && isFetched && balance > 0

  if (isLoading || !overview) {
    return (
      <aside className="border-t border-white/[0.06] p-4 lg:border-l lg:border-t-0">
        <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
      </aside>
    )
  }

  const estimatedTotal = Number(tradeAmount || 0) * (overview.price || 0)

  return (
    <aside className="flex h-full min-h-0 flex-col border-t border-white/[0.06] lg:border-l lg:border-t-0">
      <div className="border-b border-white/[0.06] px-4 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          Trade
        </p>
      </div>

      <div className="flex-1 space-y-5 p-4">
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] p-1">
          {(["buy", "sell"] as const).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => setTradeSide(side)}
              className={cn(
                "rounded-lg py-2 text-sm font-semibold capitalize transition-colors",
                tradeSide === side
                  ? side === "buy"
                    ? "bg-brand text-black"
                    : "bg-red-500 text-white"
                  : "text-white/50 hover:text-white"
              )}
            >
              {side}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-xs text-white/45">
            Amount ({overview.symbol})
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={tradeAmount}
            onChange={(event) => setTradeAmount(event.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-white outline-none ring-brand/30 placeholder:text-white/25 focus:ring-2"
          />
          <p className="mt-2 text-xs text-white/40">
            Est. total: <PriceText value={estimatedTotal} />
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!authenticated) signIn()
          }}
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 w-full font-semibold",
            tradeSide === "buy"
              ? "bg-brand text-black hover:bg-brand/90"
              : "bg-red-500 text-white hover:bg-red-500/90"
          )}
        >
          {authenticated
            ? `${tradeSide === "buy" ? "Buy" : "Sell"} ${overview.symbol}`
            : "Sign in to trade"}
        </button>

        {authError ? (
          <p className="text-xs leading-relaxed text-red-400">{authError}</p>
        ) : null}

        {!authenticated ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Your position
            </p>
            <p className="mt-3 text-sm text-white/45">
              Sign in with Apple or Google to view your position.
            </p>
          </div>
        ) : hasPosition ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Your position
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/45">Balance</span>
                <span className="font-mono text-white">
                  {formatTokenAmount(balance)} {overview.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/45">Value</span>
                <PriceText value={balance * overview.price} className="text-white" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
