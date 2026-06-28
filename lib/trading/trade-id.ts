import type { TokenTrade } from "@/lib/types/trading"

export function tradeId(
  trade: Pick<
    TokenTrade,
    "txHash" | "time" | "trader" | "side" | "tokenAmount" | "volumeUsd"
  >
) {
  return `${trade.txHash}-${trade.time}-${trade.trader}-${trade.side}-${trade.tokenAmount}-${trade.volumeUsd}`
}

export function dedupeTrades(trades: TokenTrade[]) {
  const seen = new Set<string>()

  return trades.filter((trade) => {
    const id = tradeId(trade)
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}
