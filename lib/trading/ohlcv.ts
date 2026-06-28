import type { OhlcvCandle } from "@/lib/types/trading"

function mergeOhlcvCandles(current: OhlcvCandle, next: OhlcvCandle): OhlcvCandle {
  return {
    time: current.time,
    open: current.open,
    high: Math.max(current.high, next.high),
    low: Math.min(current.low, next.low),
    close: next.close,
    volume: current.volume + next.volume,
  }
}

export function dedupeOhlcvCandles(candles: OhlcvCandle[]): OhlcvCandle[] {
  const sorted = [...candles]
    .filter((candle) => Number.isFinite(candle.time) && candle.time > 0)
    .sort((a, b) => a.time - b.time)

  const unique: OhlcvCandle[] = []

  for (const candle of sorted) {
    const last = unique[unique.length - 1]
    if (last?.time === candle.time) {
      unique[unique.length - 1] = mergeOhlcvCandles(last, candle)
    } else {
      unique.push(candle)
    }
  }

  return unique
}
