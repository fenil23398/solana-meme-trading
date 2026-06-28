import { buildDexScreenerBoostIconUrl } from "@/lib/token-icon"
import type { TokenDetail } from "@/lib/types/trading"

type DexScreenerToken = {
  address?: string
  name?: string
  symbol?: string
}

type DexScreenerPair = {
  chainId?: string
  dexId?: string
  pairAddress?: string
  baseToken?: DexScreenerToken
  quoteToken?: DexScreenerToken
  priceUsd?: string
  priceChange?: {
    h24?: number
  }
  volume?: {
    h24?: number
  }
  liquidity?: {
    usd?: number
  }
  marketCap?: number
  fdv?: number
}

type DexScreenerTokensResponse = {
  pairs?: DexScreenerPair[]
}

export type DexScreenerMarket = {
  pairAddress: string
  priceUsd: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  symbol: string
  name: string
}

function parseUsd(value?: string | number) {
  const parsed = typeof value === "string" ? Number(value) : value
  return Number.isFinite(parsed) && parsed! > 0 ? parsed! : 0
}

function pairMatchesToken(pair: DexScreenerPair, tokenAddress: string) {
  const normalized = tokenAddress.toLowerCase()
  return (
    pair.baseToken?.address?.toLowerCase() === normalized ||
    pair.quoteToken?.address?.toLowerCase() === normalized
  )
}

function mapDexPairToMarket(
  pair: DexScreenerPair,
  tokenAddress: string
): DexScreenerMarket | null {
  if (!pair.pairAddress) return null

  const isBase = pair.baseToken?.address?.toLowerCase() === tokenAddress.toLowerCase()
  const token = isBase ? pair.baseToken : pair.quoteToken

  return {
    pairAddress: pair.pairAddress,
    priceUsd: parseUsd(pair.priceUsd),
    priceChange24h: pair.priceChange?.h24 ?? 0,
    volume24h: pair.volume?.h24 ?? 0,
    liquidity: pair.liquidity?.usd ?? 0,
    marketCap: pair.marketCap ?? pair.fdv ?? 0,
    symbol: token?.symbol ?? "???",
    name: token?.name ?? token?.symbol ?? "Unknown",
  }
}

export async function fetchDexScreenerPrimaryPair(
  tokenAddress: string
): Promise<DexScreenerMarket | null> {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`,
      { next: { revalidate: 30 } }
    )

    if (!response.ok) return null

    const json = (await response.json()) as DexScreenerTokensResponse
    const pairs = (json.pairs ?? [])
      .filter(
        (pair) =>
          pair.chainId === "solana" &&
          pair.pairAddress &&
          pairMatchesToken(pair, tokenAddress)
      )
      .sort(
        (left, right) =>
          (right.liquidity?.usd ?? 0) - (left.liquidity?.usd ?? 0)
      )

    const primary = pairs[0]
    if (!primary) return null

    return mapDexPairToMarket(primary, tokenAddress)
  } catch {
    return null
  }
}

export async function fetchDexScreenerPairAddress(
  tokenAddress: string
): Promise<string | null> {
  const market = await fetchDexScreenerPrimaryPair(tokenAddress)
  return market?.pairAddress ?? null
}

export function mergeDexScreenerIntoOverview(
  overview: TokenDetail,
  market: DexScreenerMarket | null
): TokenDetail {
  if (!market || market.priceUsd <= 0) return overview

  return {
    ...overview,
    price: market.priceUsd,
    priceChange24h: market.priceChange24h,
    volume24h: market.volume24h > 0 ? market.volume24h : overview.volume24h,
    liquidity: market.liquidity > 0 ? market.liquidity : overview.liquidity,
    marketCap: market.marketCap > 0 ? market.marketCap : overview.marketCap,
  }
}

export function overviewFromDexScreenerMarket(
  address: string,
  market: DexScreenerMarket
): TokenDetail {
  return {
    address,
    symbol: market.symbol,
    name: market.name,
    price: market.priceUsd,
    priceChange24h: market.priceChange24h,
    volume24h: market.volume24h,
    liquidity: market.liquidity,
    marketCap: market.marketCap,
  }
}

export function buildDexScreenerChartUrl(pairAddress: string) {
  const params = new URLSearchParams({
    embed: "1",
    theme: "dark",
    chartTheme: "dark",
    info: "0",
    trades: "0",
    tabs: "0",
    chartLeftToolbar: "0",
    loadChartSettings: "0",
    interval: "1",
  })

  return `https://dexscreener.com/solana/${pairAddress}?${params.toString()}`
}

type DexBoostItem = {
  chainId?: string
  tokenAddress?: string
  icon?: string
  header?: string
}

function mapDexPairToTokenDetail(
  pair: DexScreenerPair,
  tokenAddress: string,
  icon?: string
): TokenDetail | null {
  const market = mapDexPairToMarket(pair, tokenAddress)
  if (!market || market.priceUsd <= 0) return null

  return {
    address: tokenAddress,
    symbol: market.symbol,
    name: market.name,
    price: market.priceUsd,
    priceChange24h: market.priceChange24h,
    volume24h: market.volume24h,
    liquidity: market.liquidity,
    marketCap: market.marketCap,
    icon,
  }
}

export async function fetchDexScreenerTrendingTokens(
  limit = 20
): Promise<TokenDetail[]> {
  try {
    const boostResponse = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1",
      { next: { revalidate: 60 } }
    )

    if (!boostResponse.ok) return []

    const boosts = (await boostResponse.json()) as DexBoostItem[]

    const solanaBoosts = boosts
      .filter((item) => item.chainId === "solana" && item.tokenAddress)
      .slice(0, limit)

    const addresses = solanaBoosts.map((item) => item.tokenAddress!)
    const iconByAddress = new Map(
      solanaBoosts.map((boost) => [
        boost.tokenAddress!.toLowerCase(),
        buildDexScreenerBoostIconUrl(boost),
      ])
    )

    if (addresses.length === 0) return []

    const marketResponse = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${addresses.join(",")}`,
      { next: { revalidate: 30 } }
    )

    if (!marketResponse.ok) return []

    const pairs = (await marketResponse.json()) as DexScreenerPair[]
    const byAddress = new Map<string, TokenDetail>()

    for (const pair of pairs) {
      for (const address of addresses) {
        if (!pairMatchesToken(pair, address)) continue
        const detail = mapDexPairToTokenDetail(
          pair,
          address,
          iconByAddress.get(address.toLowerCase())
        )
        if (detail) byAddress.set(address.toLowerCase(), detail)
      }
    }

    return addresses
      .map((address) => byAddress.get(address.toLowerCase()))
      .filter((token): token is TokenDetail => token != null)
  } catch {
    return []
  }
}
