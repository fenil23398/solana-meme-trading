import type { TickerToken } from "@/lib/constants"

export type BirdEyeTrendingToken = {
  address?: string
  symbol?: string
  name?: string
  price24hChangePercent?: number
  price?: number
  logoURI?: string
}

export function formatTickerChange(percent: number | undefined): {
  change: string
  positive: boolean
} {
  if (percent == null || Number.isNaN(percent)) {
    return { change: "—", positive: true }
  }

  const positive = percent >= 0
  const abs = Math.abs(percent)

  if (abs >= 100) {
    const multiplier = abs / 100
    const formatted =
      multiplier >= 10 ? multiplier.toFixed(1) : multiplier.toFixed(2)
    return {
      change: `${positive ? "+" : "-"}${formatted}X`,
      positive,
    }
  }

  const formatted = abs < 10 ? abs.toFixed(2) : abs.toFixed(1)
  return {
    change: `${positive ? "+" : "-"}${formatted}%`,
    positive,
  }
}

export function mapBirdEyeToTickers(
  tokens: BirdEyeTrendingToken[]
): TickerToken[] {
  return dedupeTrendingTokens(tokens)
    .filter((token) => token.symbol)
    .map((token) => {
      const { change, positive } = formatTickerChange(
        token.price24hChangePercent
      )

      return {
        symbol: token.symbol!,
        change,
        positive,
        address: token.address,
        icon: token.logoURI,
      }
    })
}

export function mapTokenDetailsToTickers(
  tokens: Array<{
    symbol: string
    address: string
    priceChange24h: number
    icon?: string
  }>
): TickerToken[] {
  return tokens.map((token) => {
    const { change, positive } = formatTickerChange(token.priceChange24h)

    return {
      symbol: token.symbol,
      change,
      positive,
      address: token.address,
      icon: token.icon,
    }
  })
}

export function dedupeTrendingTokens<T extends { address?: string }>(
  tokens: T[]
): T[] {
  const seen = new Set<string>()

  return tokens.filter((token) => {
    if (!token.address) return false
    if (seen.has(token.address)) return false
    seen.add(token.address)
    return true
  })
}
