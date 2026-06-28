import type { OhlcvCandle, TokenTrade } from "@/lib/types/trading"
import { dedupeOhlcvCandles } from "@/lib/trading/ohlcv"
import { dedupeTrades } from "@/lib/trading/trade-id"

const GECKO_API = "https://api.geckoterminal.com/api/v2"
const GECKO_OHLCV_CACHE_TTL_MS = 5 * 60_000

type GeckoOhlcvCacheEntry = {
  candles: OhlcvCandle[]
  fetchedAt: number
}

const geckoOhlcvCache = new Map<string, GeckoOhlcvCacheEntry>()

type GeckoPoolsResponse = {
  data?: Array<{ id?: string; attributes?: { address?: string } }>
}

type GeckoTradesResponse = {
  data?: Array<{
    attributes?: {
      tx_hash?: string
      tx_from_address?: string
      kind?: string
      volume_in_usd?: string
      from_token_amount?: string
      to_token_amount?: string
      from_token_address?: string
      to_token_address?: string
      block_timestamp?: string
    }
  }>
}

type GeckoOhlcvResponse = {
  data?: {
    attributes?: {
      ohlcv_list?: Array<[number, number, number, number, number, number]>
    }
  }
}

async function geckoFetch<T>(path: string, retries = 2): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(`${GECKO_API}${path}`, {
        headers: { accept: "application/json" },
        next: { revalidate: 60 },
      })

      if (response.status === 429 && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)))
        continue
      }

      if (!response.ok) return null
      return (await response.json()) as T
    } catch {
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)))
        continue
      }
      return null
    }
  }

  return null
}

export async function fetchGeckoPrimaryPoolAddress(
  tokenAddress: string
): Promise<string | null> {
  const json = await geckoFetch<GeckoPoolsResponse>(
    `/networks/solana/tokens/${tokenAddress}/pools`
  )

  const pool = json?.data?.[0]
  if (!pool) return null

  if (pool.attributes?.address) return pool.attributes.address
  if (pool.id?.startsWith("solana_")) return pool.id.replace("solana_", "")

  return null
}

function mapGeckoTradeItem(
  tokenAddress: string,
  attrs: NonNullable<GeckoTradesResponse["data"]>[number]["attributes"]
): TokenTrade | null {
  if (!attrs?.tx_hash) return null

  const isSell = attrs.from_token_address === tokenAddress
  const isBuy = attrs.to_token_address === tokenAddress
  const side = attrs.kind === "sell" || isSell ? "sell" : "buy"

  const tokenAmount = Number(
    isSell
      ? attrs.from_token_amount
      : isBuy
        ? attrs.to_token_amount
        : attrs.to_token_amount ?? attrs.from_token_amount
  )

  const volumeUsd = Number(attrs.volume_in_usd ?? 0)
  const priceUsd =
    tokenAmount > 0 && volumeUsd > 0 ? volumeUsd / tokenAmount : 0

  const time = attrs.block_timestamp
    ? Math.floor(new Date(attrs.block_timestamp).getTime() / 1000)
    : 0

  return {
    txHash: attrs.tx_hash,
    side: side as "buy" | "sell",
    tokenAmount: Number.isFinite(tokenAmount) ? tokenAmount : 0,
    priceUsd,
    volumeUsd,
    trader: attrs.tx_from_address ?? "Unknown",
    time,
  }
}

export async function fetchGeckoTradesForPool(
  poolAddress: string,
  tokenAddress: string,
  limit = 25
): Promise<TokenTrade[]> {
  const json = await geckoFetch<GeckoTradesResponse>(
    `/networks/solana/pools/${poolAddress}/trades`
  )

  return dedupeTrades(
    (json?.data ?? [])
      .map((item) => mapGeckoTradeItem(tokenAddress, item.attributes))
      .filter((trade): trade is TokenTrade => trade != null)
      .slice(0, limit)
  )
}

export async function fetchGeckoTrades(
  tokenAddress: string,
  limit = 25
): Promise<TokenTrade[]> {
  const poolAddress = await fetchGeckoPrimaryPoolAddress(tokenAddress)
  if (!poolAddress) return []

  return fetchGeckoTradesForPool(poolAddress, tokenAddress, limit)
}

export async function fetchGeckoOhlcv(
  tokenAddress: string,
  limit = 300,
  timeframe: "hour" | "minute" = "minute"
): Promise<OhlcvCandle[]> {
  const cacheKey = `${tokenAddress}:${timeframe}:${limit}`
  const cached = geckoOhlcvCache.get(cacheKey)
  const cacheFresh =
    cached && Date.now() - cached.fetchedAt <= GECKO_OHLCV_CACHE_TTL_MS

  if (cacheFresh && cached.candles.length > 0) {
    return cached.candles
  }

  const poolAddress = await fetchGeckoPrimaryPoolAddress(tokenAddress)
  if (!poolAddress) {
    return cached?.candles ?? []
  }

  const json = await geckoFetch<GeckoOhlcvResponse>(
    `/networks/solana/pools/${poolAddress}/ohlcv/${timeframe}?limit=${limit}`
  )

  const candles = normalizeGeckoOhlcv(json)
  if (candles.length > 0) {
    geckoOhlcvCache.set(cacheKey, { candles, fetchedAt: Date.now() })
    return candles
  }

  return cached?.candles ?? []
}

function normalizeGeckoOhlcv(json: GeckoOhlcvResponse | null): OhlcvCandle[] {
  return dedupeOhlcvCandles(
    (json?.data?.attributes?.ohlcv_list ?? [])
      .map(([time, open, high, low, close, volume]) => ({
        time,
        open,
        high,
        low,
        close,
        volume,
      }))
      .filter(
        (candle) =>
          Number.isFinite(candle.time) &&
          candle.time > 0 &&
          Number.isFinite(candle.close) &&
          candle.close > 0
      )
  )
}
