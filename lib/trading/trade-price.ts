import type { TokenTrade } from "@/lib/types/trading"

function isPriceOutlier(priceUsd: number, reference: number) {
  const ratio = priceUsd / reference
  return ratio > 25 || ratio < 0.04
}

export function withResolvedTradePrice(
  trade: TokenTrade,
  referencePrice?: number
): TokenTrade {
  let { priceUsd, volumeUsd, tokenAmount } = trade

  if (tokenAmount > 0 && volumeUsd > 0) {
    const impliedPrice = volumeUsd / tokenAmount
    if (
      priceUsd <= 0 ||
      (referencePrice && referencePrice > 0 && isPriceOutlier(priceUsd, referencePrice))
    ) {
      priceUsd = impliedPrice
    }
  }

  if (volumeUsd <= 0 && priceUsd > 0 && tokenAmount > 0) {
    volumeUsd = priceUsd * tokenAmount
  }

  return { ...trade, priceUsd, volumeUsd }
}

export function withResolvedTradePrices(
  trades: TokenTrade[],
  referencePrice?: number
): TokenTrade[] {
  return trades
    .map((trade) => withResolvedTradePrice(trade, referencePrice))
    .filter((trade) => trade.priceUsd > 0)
}
