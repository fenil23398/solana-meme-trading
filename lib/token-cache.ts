import type {
  OhlcvCandle,
  TokenDetail,
  TokenHolder,
  TokenTrade,
} from "@/lib/types/trading"

export type TokenBundle = {
  overview: TokenDetail
  ohlcv: OhlcvCandle[]
  holders: TokenHolder[]
  trades: TokenTrade[]
}

type CacheEntry = {
  data: TokenBundle
  expiresAt: number
}

const CACHE_TTL_MS = 5 * 60_000
const cache = new Map<string, CacheEntry>()

export function getCachedToken(address: string): TokenBundle | null {
  const entry = cache.get(address)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    cache.delete(address)
    return null
  }
  return entry.data
}

function preferNonEmpty<T>(next: T[], previous: T[] | undefined) {
  return next.length > 0 ? next : (previous ?? [])
}

export function mergeCachedToken(address: string, incoming: TokenBundle): TokenBundle {
  const cached = getCachedToken(address)

  const merged: TokenBundle = {
    overview: incoming.overview,
    ohlcv: [],
    holders: preferNonEmpty(incoming.holders, cached?.holders),
    trades: preferNonEmpty(incoming.trades, cached?.trades),
  }

  setCachedToken(address, merged)
  return merged
}

export function setCachedToken(address: string, data: TokenBundle) {
  cache.set(address, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

export function patchCachedToken(
  address: string,
  patch: Partial<Pick<TokenBundle, "overview" | "ohlcv" | "holders" | "trades">>
) {
  const cached = getCachedToken(address)
  if (!cached) return null

  const next: TokenBundle = {
    overview: patch.overview ?? cached.overview,
    ohlcv: [],
    holders:
      patch.holders && patch.holders.length > 0 ? patch.holders : cached.holders,
    trades: patch.trades && patch.trades.length > 0 ? patch.trades : cached.trades,
  }

  setCachedToken(address, next)
  return next
}
