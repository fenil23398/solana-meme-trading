import type { OhlcvCandle } from "@/lib/types/trading"

export function getChartReferencePrice(
  candles: OhlcvCandle[],
  livePrice?: number
) {
  if (livePrice && livePrice > 0) return livePrice
  return candles.at(-1)?.close ?? candles[0]?.close ?? 0
}

export function clampChartWicks(
  candles: OhlcvCandle[],
  referencePrice: number
): OhlcvCandle[] {
  if (!referencePrice || referencePrice <= 0) return candles

  return candles.map((candle) => ({
    ...candle,
    high: Math.max(candle.high, candle.open, candle.close, candle.low),
    low: Math.min(candle.low, candle.open, candle.close, candle.high),
  }))
}

export function getChartPriceRange(
  candles: OhlcvCandle[],
  livePrice?: number
) {
  const referencePrice = getChartReferencePrice(candles, livePrice)
  const recent = candles.slice(-120)

  if (!referencePrice || referencePrice <= 0 || recent.length === 0) {
    return { minValue: 0, maxValue: 1 }
  }

  let min = referencePrice
  let max = referencePrice

  for (const candle of recent) {
    min = Math.min(min, candle.low, candle.open, candle.close)
    max = Math.max(max, candle.high, candle.open, candle.close)
  }

  if (livePrice && livePrice > 0) {
    min = Math.min(min, livePrice)
    max = Math.max(max, livePrice)
  }

  const dataSpread = max - min
  const padding = Math.max(
    dataSpread * 0.12,
    referencePrice * 0.0002,
    referencePrice * 0.00000001
  )

  return {
    minValue: Math.max(0, min - padding),
    maxValue: max + padding,
  }
}
