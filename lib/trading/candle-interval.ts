import type { OhlcvCandle } from "@/lib/types/trading"

export const MINUTE_CANDLE_SECONDS = 60

export function inferCandleIntervalSeconds(candles: OhlcvCandle[]): number {
  if (candles.length < 2) return MINUTE_CANDLE_SECONDS

  const diffs: number[] = []
  for (let index = 1; index < candles.length; index += 1) {
    const diff = candles[index].time - candles[index - 1].time
    if (diff > 0) diffs.push(diff)
  }

  if (diffs.length === 0) return MINUTE_CANDLE_SECONDS

  diffs.sort((a, b) => a - b)
  const median = diffs[Math.floor(diffs.length / 2)]

  if (median <= 90) return MINUTE_CANDLE_SECONDS
  if (median <= 600) return median
  if (median <= 5400) return 3600

  return median
}

export function getCurrentCandleBucket(
  intervalSeconds: number,
  nowSeconds = Math.floor(Date.now() / 1000)
) {
  return Math.floor(nowSeconds / intervalSeconds) * intervalSeconds
}

export function getMinVisibleBars(intervalSeconds: number, barCount: number) {
  if (barCount <= 30) return barCount
  if (intervalSeconds <= MINUTE_CANDLE_SECONDS) return Math.min(120, barCount)
  if (intervalSeconds <= 3600) return Math.min(48, barCount)
  return Math.min(24, barCount)
}
