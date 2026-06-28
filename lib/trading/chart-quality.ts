import type { OhlcvCandle } from "@/lib/types/trading"
import { inferCandleIntervalSeconds, MINUTE_CANDLE_SECONDS } from "@/lib/trading/candle-interval"

export function isRealOhlcvCandles(candles: OhlcvCandle[]): boolean {
  if (candles.length < 8) return false

  const hasPriceMovement = candles.some((candle) => {
    const body = Math.abs(candle.open - candle.close)
    const range = candle.high - candle.low
    const reference = Math.max(candle.close, candle.open, 1e-12)
    return range > reference * 1e-8 || body > reference * 1e-8
  })

  if (!hasPriceMovement) return false

  const interval = inferCandleIntervalSeconds(candles)
  if (interval > MINUTE_CANDLE_SECONDS * 5) return candles.length >= 20

  return true
}
