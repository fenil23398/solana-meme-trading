import type { OhlcvCandle } from "@/lib/types/trading"
import {
  getCurrentCandleBucket,
  inferCandleIntervalSeconds,
} from "@/lib/trading/candle-interval"
import { dedupeOhlcvCandles } from "@/lib/trading/ohlcv"

function updateCandleWithLivePrice(
  candle: OhlcvCandle,
  livePrice: number
): OhlcvCandle {
  return {
    ...candle,
    close: livePrice,
    high: Math.max(candle.high, livePrice),
    low: Math.min(candle.low, livePrice),
  }
}

export function applyLivePriceToOhlcv(
  candles: OhlcvCandle[],
  livePrice: number
): OhlcvCandle[] {
  if (!candles.length || !Number.isFinite(livePrice) || livePrice <= 0) {
    return dedupeOhlcvCandles(candles)
  }

  const copy = [...candles]
  const intervalSeconds = inferCandleIntervalSeconds(copy)
  const bucket = getCurrentCandleBucket(intervalSeconds)
  const lastIndex = copy.length - 1
  const last = copy[lastIndex]
  const bucketIndex = copy.findIndex((candle) => candle.time === bucket)

  if (last.time < bucket) {
    copy.push({
      time: bucket,
      open: last.close,
      high: livePrice,
      low: livePrice,
      close: livePrice,
      volume: 0,
    })
  } else if (bucketIndex >= 0) {
    copy[bucketIndex] = updateCandleWithLivePrice(copy[bucketIndex], livePrice)
  } else {
    copy[lastIndex] = updateCandleWithLivePrice(last, livePrice)
  }

  return dedupeOhlcvCandles(copy)
}
