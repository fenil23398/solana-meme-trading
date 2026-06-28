import type { OhlcvCandle } from "@/lib/types/trading"
import {
  getCurrentCandleBucket,
  MINUTE_CANDLE_SECONDS,
} from "@/lib/trading/candle-interval"

export function buildSyntheticOhlcv(
  price: number,
  candles = 300,
  intervalSeconds = MINUTE_CANDLE_SECONDS
): OhlcvCandle[] {
  if (!Number.isFinite(price) || price <= 0) return []

  const bucket = getCurrentCandleBucket(intervalSeconds)
  const result: OhlcvCandle[] = []

  for (let index = candles - 1; index >= 0; index -= 1) {
    result.push({
      time: bucket - index * intervalSeconds,
      open: price,
      high: price,
      low: price,
      close: price,
      volume: 0,
    })
  }

  return result
}

export function buildTrendOhlcvFromPrice(
  price: number,
  priceChange24h = 0,
  candles = 120,
  intervalSeconds = MINUTE_CANDLE_SECONDS
): OhlcvCandle[] {
  if (!Number.isFinite(price) || price <= 0) return []

  const change = Number.isFinite(priceChange24h) ? priceChange24h : 0
  const startPrice =
    Math.abs(change) >= 0.0001 ? price / (1 + change / 100) : price * 0.985

  const bucket = getCurrentCandleBucket(intervalSeconds)
  const result: OhlcvCandle[] = []
  const span = Math.max(candles - 1, 1)
  const totalMove = price - startPrice
  const wickSize = Math.max(Math.abs(totalMove) * 0.08, price * 0.0015)

  for (let index = candles - 1; index >= 0; index -= 1) {
    const progress = (candles - 1 - index) / span
    const close = startPrice + totalMove * progress
    const prevProgress = index === candles - 1 ? 0 : (candles - index) / span
    const open = startPrice + totalMove * prevProgress
    const bodyHigh = Math.max(open, close)
    const bodyLow = Math.min(open, close)

    result.push({
      time: bucket - index * intervalSeconds,
      open,
      close,
      high: bodyHigh + wickSize,
      low: Math.max(bodyLow - wickSize, bodyLow * 0.5),
      volume: 0,
    })
  }

  return result
}
