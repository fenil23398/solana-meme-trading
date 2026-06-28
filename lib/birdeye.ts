import { birdeyeFetch } from "@/lib/birdeye-client"
import { fetchDexScreenerPairAddress } from "@/lib/dexscreener"
import { fetchGeckoTrades, fetchGeckoTradesForPool } from "@/lib/geckoterminal"
import { dedupeOhlcvCandles } from "@/lib/trading/ohlcv"
import { withResolvedTradePrices } from "@/lib/trading/trade-price"
import { dedupeTrades } from "@/lib/trading/trade-id"
import type {
  OhlcvCandle,
  TokenDetail,
  TokenHolder,
  TokenTrade,
} from "@/lib/types/trading"
import { mapBirdEyeToTickers, dedupeTrendingTokens, type BirdEyeTrendingToken } from "@/lib/ticker"

type BirdEyeTrendingResponse = {
  success?: boolean
  data?: { tokens?: BirdEyeTrendingToken[] }
}

type BirdEyeOverviewResponse = {
  data?: {
    address?: string
    symbol?: string
    name?: string
    price?: number
    priceChange24hPercent?: number
    v24hUSD?: number
    liquidity?: number
    mc?: number
    marketCap?: number
    fdv?: number
    logoURI?: string
    totalSupply?: number
    circulatingSupply?: number
    realCirculatingSupply?: number
    holder?: number
  }
}

type BirdEyeTradeLeg = {
  address?: string
  ui_amount?: number
  uiAmount?: number
  price?: number
}

type BirdEyeTradeItem = {
  txHash?: string
  tx_hash?: string
  side?: string
  tokenAmount?: number
  volume?: number
  priceUsd?: number
  volumeUsd?: number
  volume_usd?: number
  owner?: string
  blockUnixTime?: number
  block_unix_time?: number
  from?: BirdEyeTradeLeg
  to?: BirdEyeTradeLeg
}

type BirdEyeHolderItem = {
  owner?: string
  uiAmount?: number
  ui_amount?: number
  percentage?: number
}

type BirdEyeOhlcvResponse = {
  data?: {
    items?: Array<{
      unixTime?: number
      o?: number
      h?: number
      l?: number
      c?: number
      v?: number
    }>
  }
}

function normalizeOhlcvItems(
  items: NonNullable<BirdEyeOhlcvResponse["data"]>["items"]
): OhlcvCandle[] {
  return dedupeOhlcvCandles(
    (items ?? [])
      .filter((item) => item.unixTime != null)
      .map((item) => ({
        time: item.unixTime!,
        open: item.o ?? 0,
        high: item.h ?? 0,
        low: item.l ?? 0,
        close: item.c ?? 0,
        volume: item.v ?? 0,
      }))
  )
}

export async function fetchTokenOhlcv(address: string): Promise<OhlcvCandle[]> {
  const timeTo = Math.floor(Date.now() / 1000)
  const timeFrom = timeTo - 60 * 60 * 6

  const json = await birdeyeFetch<BirdEyeOhlcvResponse>("/defi/ohlcv", {
    searchParams: {
      address,
      type: "1m",
      time_from: String(timeFrom),
      time_to: String(timeTo),
    },
    revalidate: 60,
    retries: 1,
  })

  return normalizeOhlcvItems(json?.data?.items)
}

type BirdEyePriceResponse = {
  data?: {
    value?: number
  }
}

export async function fetchBirdEyeSpotPrice(address: string): Promise<number | null> {
  const json = await birdeyeFetch<BirdEyePriceResponse>("/defi/price", {
    searchParams: { address },
    revalidate: 15,
    retries: 0,
    fresh: true,
  })

  const price = json?.data?.value
  return Number.isFinite(price) && price! > 0 ? price! : null
}

export async function fetchBirdEyeTradesForChart(
  address: string
): Promise<TokenTrade[]> {
  return fetchTokenTradesFromEndpoint("/defi/txs/token", address, {
    limit: 50,
  })
}

type BirdEyeHoldersResponse = {
  data?: {
    items?: BirdEyeHolderItem[]
  }
}

type BirdEyeTradesResponse = {
  data?: {
    items?: BirdEyeTradeItem[]
  }
}

function extractTotalSupply(data: BirdEyeOverviewResponse["data"]) {
  return (
    data?.circulatingSupply ??
    data?.realCirculatingSupply ??
    data?.totalSupply ??
    undefined
  )
}

function mapBirdEyeTradeItem(
  item: BirdEyeTradeItem,
  tokenAddress: string
): TokenTrade | null {
  const txHash = item.tx_hash ?? item.txHash
  if (!txHash) return null

  const tokenLeg =
    item.from?.address === tokenAddress
      ? item.from
      : item.to?.address === tokenAddress
        ? item.to
        : undefined

  const tokenAmount =
    item.volume ??
    item.tokenAmount ??
    tokenLeg?.ui_amount ??
    tokenLeg?.uiAmount ??
    0

  const priceUsd = item.priceUsd ?? 0
  const volumeUsd = item.volume_usd ?? item.volumeUsd ?? 0
  let resolvedPrice = priceUsd

  if (tokenAmount > 0 && volumeUsd > 0) {
    resolvedPrice = volumeUsd / tokenAmount
  } else if (resolvedPrice <= 0) {
    resolvedPrice = tokenLeg?.price ?? 0
  }

  return {
    txHash,
    side: item.side === "sell" ? "sell" : "buy",
    tokenAmount,
    priceUsd: resolvedPrice,
    volumeUsd,
    trader: item.owner ?? "Unknown",
    time: item.block_unix_time ?? item.blockUnixTime ?? 0,
  }
}

function mapBirdEyeHolders(
  items: BirdEyeHolderItem[],
  totalSupply?: number
): TokenHolder[] {
  const holders = items
    .filter((item) => item.owner)
    .map((item) => {
      const amount = item.ui_amount ?? item.uiAmount ?? 0
      return {
        address: item.owner!,
        amount,
        percentage: item.percentage ?? 0,
      }
    })

  const supplyBase =
    totalSupply && totalSupply > 0
      ? totalSupply
      : holders.reduce((sum, holder) => sum + holder.amount, 0)

  if (supplyBase <= 0) return holders

  return holders.map((holder) => ({
    ...holder,
    percentage:
      holder.percentage > 0
        ? holder.percentage
        : (holder.amount / supplyBase) * 100,
  }))
}

export function applyHolderSupply(
  holders: TokenHolder[],
  totalSupply?: number
): TokenHolder[] {
  if (!totalSupply || totalSupply <= 0) return holders

  return holders.map((holder) => ({
    ...holder,
    percentage: (holder.amount / totalSupply) * 100,
  }))
}

export async function fetchTrendingTokens(limit = 12) {
  const json = await birdeyeFetch<BirdEyeTrendingResponse>("/defi/token_trending", {
    searchParams: {
      sort_by: "rank",
      sort_type: "asc",
      offset: "0",
      limit: String(Math.min(limit, 20)),
    },
  })

  const tokens = json?.data?.tokens ?? []
  if (tokens.length === 0) return null

  return mapBirdEyeToTickers(tokens)
}

export async function fetchTrendingTokenDetails(limit = 20): Promise<TokenDetail[]> {
  const json = await birdeyeFetch<BirdEyeTrendingResponse>("/defi/token_trending", {
    searchParams: {
      sort_by: "rank",
      sort_type: "asc",
      offset: "0",
      limit: String(Math.min(limit, 20)),
    },
  })

  const tokens = dedupeTrendingTokens(json?.data?.tokens ?? [])
  return tokens
    .filter((token) => token.address && token.symbol)
    .map((token) => ({
      address: token.address!,
      symbol: token.symbol!,
      name: token.name ?? token.symbol!,
      price: token.price ?? 0,
      priceChange24h: token.price24hChangePercent ?? 0,
      volume24h: 0,
      liquidity: 0,
      marketCap: 0,
      icon: token.logoURI,
    }))
}

export async function fetchTokenOverview(
  address: string,
  options: { fresh?: boolean } = {}
): Promise<TokenDetail | null> {
  const json = await birdeyeFetch<BirdEyeOverviewResponse>("/defi/token_overview", {
    searchParams: { address },
    revalidate: options.fresh ? 0 : 30,
    fresh: options.fresh,
    retries: options.fresh ? 0 : 1,
  })

  const data = json?.data
  if (!data?.address || !data.symbol) return null

  return {
    address: data.address,
    symbol: data.symbol,
    name: data.name ?? data.symbol,
    price: data.price ?? 0,
    priceChange24h: data.priceChange24hPercent ?? 0,
    volume24h: data.v24hUSD ?? 0,
    liquidity: data.liquidity ?? 0,
    marketCap: data.marketCap ?? data.mc ?? data.fdv ?? 0,
    totalSupply: extractTotalSupply(data),
    holderCount: data.holder,
    icon: data.logoURI,
  }
}

export async function fetchTokenHolders(
  address: string,
  totalSupply?: number
): Promise<TokenHolder[]> {
  const json = await birdeyeFetch<BirdEyeHoldersResponse>("/defi/v3/token/holder", {
    searchParams: {
      address,
      offset: "0",
      limit: "15",
      ui_amount_mode: "scaled",
    },
    revalidate: 60,
  })

  return mapBirdEyeHolders(json?.data?.items ?? [], totalSupply)
}

async function fetchTokenTradesFromEndpoint(
  path: string,
  address: string,
  options: { scaled?: boolean; txType?: string; limit?: number } = {}
): Promise<TokenTrade[]> {
  const searchParams: Record<string, string> = {
    address,
    offset: "0",
    limit: String(options.limit ?? 25),
    tx_type: options.txType ?? "swap",
    sort_type: "desc",
  }

  if (options.scaled) {
    searchParams.ui_amount_mode = "scaled"
  }

  const json = await birdeyeFetch<BirdEyeTradesResponse>(path, {
    searchParams,
    revalidate: 10,
  })

  return dedupeTrades(
    (json?.data?.items ?? [])
      .map((item) => mapBirdEyeTradeItem(item, address))
      .filter((trade): trade is TokenTrade => trade != null)
  )
}

export async function fetchTokenTrades(
  address: string,
  options: { pairAddress?: string | null; referencePrice?: number } = {}
): Promise<TokenTrade[]> {
  const pairAddress =
    options.pairAddress !== undefined
      ? options.pairAddress
      : await fetchDexScreenerPairAddress(address).catch(() => null)

  const [birdeyeTrades, geckoTrades] = await Promise.all([
    fetchTokenTradesFromEndpoint("/defi/txs/token", address).catch(
      () => [] as TokenTrade[]
    ),
    pairAddress
      ? fetchGeckoTradesForPool(pairAddress, address).catch(() => [] as TokenTrade[])
      : fetchGeckoTrades(address).catch(() => [] as TokenTrade[]),
  ])

  return withResolvedTradePrices(
    dedupeTrades([...birdeyeTrades, ...geckoTrades]).sort(
      (left, right) => right.time - left.time
    ),
    options.referencePrice
  ).slice(0, 25)
}
