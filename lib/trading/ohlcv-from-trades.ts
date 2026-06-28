import type { OhlcvCandle, TokenTrade } from "@/lib/types/trading"
import {
  getCurrentCandleBucket,
  MINUTE_CANDLE_SECONDS,
} from "@/lib/trading/candle-interval"
import { dedupeOhlcvCandles } from "@/lib/trading/ohlcv"

export function buildOhlcvFromTrades(
  trades: TokenTrade[],
  intervalSeconds = MINUTE_CANDLE_SECONDS
): OhlcvCandle[] {
  if (!trades.length) return []

  const buckets = new Map<number, OhlcvCandle>()

  for (const trade of [...trades].sort((a, b) => a.time - b.time)) {
    if (!Number.isFinite(trade.priceUsd) || trade.priceUsd <= 0) continue

    const bucket = getCurrentCandleBucket(intervalSeconds, trade.time)
    const existing = buckets.get(bucket)

    if (!existing) {
      buckets.set(bucket, {
        time: bucket,
        open: trade.priceUsd,
        high: trade.priceUsd,
        low: trade.priceUsd,
        close: trade.priceUsd,
        volume: trade.volumeUsd,
      })
      continue
    }

    buckets.set(bucket, {
      time: bucket,
      open: existing.open,
      high: Math.max(existing.high, trade.priceUsd),
      low: Math.min(existing.low, trade.priceUsd),
      close: trade.priceUsd,
      volume: existing.volume + trade.volumeUsd,
    })
  }

  return dedupeOhlcvCandles([...buckets.values()])
}
