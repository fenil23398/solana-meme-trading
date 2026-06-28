import type { OhlcvCandle, TokenTrade } from "@/lib/types/trading"
import { dedupeOhlcvCandles } from "@/lib/trading/ohlcv"
import { buildOhlcvFromTrades } from "@/lib/trading/ohlcv-from-trades"
import { buildTrendOhlcvFromPrice } from "@/lib/trading/synthetic-ohlcv"

const MIN_REAL_OHLCV_BARS = 12
const MIN_PRICE_VARIATION = 0.0005

export type ChartPriceFallback = {
  price: number
  priceChange24h?: number
}

export function isFlatOhlcv(candles: OhlcvCandle[]): boolean {
  if (candles.length === 0) return true

  const lows = candles.map((candle) => candle.low)
  const highs = candles.map((candle) => candle.high)
  const min = Math.min(...lows)
  const max = Math.max(...highs)

  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0) return true

  return (max - min) / min < MIN_PRICE_VARIATION
}

export function buildOhlcvFromTradeTicks(trades: TokenTrade[]): OhlcvCandle[] {
  const sorted = [...trades]
    .filter((trade) => Number.isFinite(trade.priceUsd) && trade.priceUsd > 0)
    .sort((a, b) => a.time - b.time)

  const result: OhlcvCandle[] = []
  let lastTime = 0

  for (const trade of sorted) {
    let time = trade.time
    if (time <= lastTime) time = lastTime + 1
    lastTime = time

    result.push({
      time,
      open: trade.priceUsd,
      high: trade.priceUsd,
      low: trade.priceUsd,
      close: trade.priceUsd,
      volume: trade.volumeUsd,
    })
  }

  return dedupeOhlcvCandles(result)
}

function hasUsableBirdEyeOhlcv(candles: OhlcvCandle[]) {
  return candles.length >= MIN_REAL_OHLCV_BARS && !isFlatOhlcv(candles)
}

export function resolveChartCandles(
  ohlcv: OhlcvCandle[],
  trades: TokenTrade[],
  fallback?: ChartPriceFallback
): OhlcvCandle[] {
  const fromMinuteTrades = buildOhlcvFromTrades(trades)
  const fromTradeTicks = buildOhlcvFromTradeTicks(trades)

  if (hasUsableBirdEyeOhlcv(ohlcv)) {
    return dedupeOhlcvCandles(ohlcv)
  }

  if (fromMinuteTrades.length >= MIN_REAL_OHLCV_BARS && !isFlatOhlcv(fromMinuteTrades)) {
    return fromMinuteTrades
  }

  if (fromTradeTicks.length >= 3 && !isFlatOhlcv(fromTradeTicks)) {
    return fromTradeTicks
  }

  if (fromMinuteTrades.length > 0 && !isFlatOhlcv(fromMinuteTrades)) {
    return fromMinuteTrades
  }

  if (ohlcv.length > 0 && !isFlatOhlcv(ohlcv)) {
    return dedupeOhlcvCandles(ohlcv)
  }

  if (fromTradeTicks.length > 0) {
    return fromTradeTicks
  }

  if (fallback?.price && fallback.price > 0) {
    return buildTrendOhlcvFromPrice(fallback.price, fallback.priceChange24h ?? 0)
  }

  return []
}
