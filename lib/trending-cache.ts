import type { TokenDetail } from "@/lib/types/trading"

type CacheEntry = {
  tokens: TokenDetail[]
  fetchedAt: number
}

const CACHE_TTL_MS = 30_000
const STALE_CACHE_TTL_MS = 60 * 60_000

let cache: CacheEntry | null = null

export function getFreshTrendingCache(): TokenDetail[] | null {
  if (!cache) return null
  if (Date.now() - cache.fetchedAt > CACHE_TTL_MS) return null
  return cache.tokens
}

export function getStaleTrendingCache(): TokenDetail[] | null {
  if (!cache) return null
  if (Date.now() - cache.fetchedAt > STALE_CACHE_TTL_MS) return null
  return cache.tokens
}

export function setTrendingCache(tokens: TokenDetail[]) {
  if (tokens.length === 0) return
  cache = { tokens, fetchedAt: Date.now() }
}

export const TRENDING_CACHE_TTL_MS = CACHE_TTL_MS
export const TRENDING_STALE_CACHE_TTL_MS = STALE_CACHE_TTL_MS
