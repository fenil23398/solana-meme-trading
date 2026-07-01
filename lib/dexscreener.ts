import { buildDexScreenerBoostIconUrl } from "@/lib/token-icon"
import type { TokenDetail, TokenSocial } from "@/lib/types/trading"

type DexScreenerToken = {
  address?: string
  name?: string
  symbol?: string
}

type DexScreenerTxns = {
  buys?: number
  sells?: number
}

type DexScreenerSocial = {
  type?: string
  url?: string
}

type DexScreenerInfo = {
  imageUrl?: string
  socials?: DexScreenerSocial[]
  websites?: { url?: string }[]
}

type DexScreenerPair = {
  chainId?: string
  dexId?: string
  pairAddress?: string
  baseToken?: DexScreenerToken
  quoteToken?: DexScreenerToken
  priceUsd?: string
  priceChange?: {
    m5?: number
    h1?: number
    h6?: number
    h24?: number
  }
  volume?: {
    m5?: number
    h1?: number
    h6?: number
    h24?: number
  }
  txns?: {
    m5?: DexScreenerTxns
    h1?: DexScreenerTxns
    h6?: DexScreenerTxns
    h24?: DexScreenerTxns
  }
  liquidity?: {
    usd?: number
  }
  marketCap?: number
  fdv?: number
  pairCreatedAt?: number
  info?: DexScreenerInfo
}

type DexScreenerTokensResponse = {
  pairs?: DexScreenerPair[]
}

export type DexScreenerMarket = {
  pairAddress: string
  priceUsd: number
  priceChange5m: number
  priceChange1h: number
  priceChange6h: number
  priceChange24h: number
  volume24h: number
  volume6h: number
  volume1h: number
  liquidity: number
  marketCap: number
  fdv: number
  buys24h: number
  sells24h: number
  buys1h: number
  sells1h: number
  symbol: string
  name: string
  pairCreatedAt?: number
  dex?: string
  socials: TokenSocial[]
  websites: string[]
  icon?: string
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

  const socials: TokenSocial[] = (pair.info?.socials ?? [])
    .filter((s): s is { type: string; url: string } => !!(s.type && s.url))
    .map((s) => ({ type: s.type, url: s.url }))

  const websites: string[] = (pair.info?.websites ?? [])
    .map((w) => w.url)
    .filter((u): u is string => !!u)

  return {
    pairAddress: pair.pairAddress,
    priceUsd: parseUsd(pair.priceUsd),
    priceChange5m: pair.priceChange?.m5 ?? 0,
    priceChange1h: pair.priceChange?.h1 ?? 0,
    priceChange6h: pair.priceChange?.h6 ?? 0,
    priceChange24h: pair.priceChange?.h24 ?? 0,
    volume24h: pair.volume?.h24 ?? 0,
    volume6h: pair.volume?.h6 ?? 0,
    volume1h: pair.volume?.h1 ?? 0,
    liquidity: pair.liquidity?.usd ?? 0,
    marketCap: pair.marketCap ?? pair.fdv ?? 0,
    fdv: pair.fdv ?? pair.marketCap ?? 0,
    buys24h: pair.txns?.h24?.buys ?? 0,
    sells24h: pair.txns?.h24?.sells ?? 0,
    buys1h: pair.txns?.h1?.buys ?? 0,
    sells1h: pair.txns?.h1?.sells ?? 0,
    symbol: token?.symbol ?? "???",
    name: token?.name ?? token?.symbol ?? "Unknown",
    pairCreatedAt: pair.pairCreatedAt,
    dex: pair.dexId,
    socials,
    websites,
    icon: pair.info?.imageUrl,
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
    priceChange5m: market.priceChange5m,
    priceChange1h: market.priceChange1h,
    priceChange6h: market.priceChange6h,
    priceChange24h: market.priceChange24h,
    volume24h: market.volume24h > 0 ? market.volume24h : overview.volume24h,
    volume6h: market.volume6h,
    volume1h: market.volume1h,
    liquidity: market.liquidity > 0 ? market.liquidity : overview.liquidity,
    marketCap: market.marketCap > 0 ? market.marketCap : overview.marketCap,
    fdv: market.fdv > 0 ? market.fdv : overview.fdv,
    buys24h: market.buys24h,
    sells24h: market.sells24h,
    buys1h: market.buys1h,
    sells1h: market.sells1h,
    pairAddress: market.pairAddress,
    pairCreatedAt: market.pairCreatedAt,
    dex: market.dex,
    socials: market.socials.length > 0 ? market.socials : overview.socials,
    websites: market.websites.length > 0 ? market.websites : overview.websites,
    icon: overview.icon ?? market.icon,
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
    priceChange5m: market.priceChange5m,
    priceChange1h: market.priceChange1h,
    priceChange6h: market.priceChange6h,
    priceChange24h: market.priceChange24h,
    volume24h: market.volume24h,
    volume6h: market.volume6h,
    volume1h: market.volume1h,
    liquidity: market.liquidity,
    marketCap: market.marketCap,
    fdv: market.fdv,
    buys24h: market.buys24h,
    sells24h: market.sells24h,
    buys1h: market.buys1h,
    sells1h: market.sells1h,
    pairAddress: market.pairAddress,
    pairCreatedAt: market.pairCreatedAt,
    dex: market.dex,
    socials: market.socials,
    websites: market.websites,
    icon: market.icon,
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
  boostIcon?: string
): TokenDetail | null {
  const market = mapDexPairToMarket(pair, tokenAddress)
  if (!market || market.priceUsd <= 0) return null

  return {
    ...overviewFromDexScreenerMarket(tokenAddress, market),
    // Prefer boost icon over pair info icon for the sidebar thumbnails
    icon: boostIcon ?? market.icon,
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

    // Deduplicate: preserve original boost order, one entry per address
    const seen = new Set<string>()
    return addresses
      .filter((address) => {
        const key = address.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .map((address) => byAddress.get(address.toLowerCase()))
      .filter((token): token is TokenDetail => token != null)
  } catch {
    return []
  }
}
