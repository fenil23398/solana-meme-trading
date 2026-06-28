import "server-only"

import { fetchTrendingTokenDetails, fetchTrendingTokens } from "@/lib/birdeye"
import type { TickerToken } from "@/lib/constants"
import { fetchDexScreenerTrendingTokens } from "@/lib/dexscreener"
import { queryKeys } from "@/lib/queries/keys"
import {
  getFreshTrendingCache,
  getStaleTrendingCache,
  setTrendingCache,
  TRENDING_CACHE_TTL_MS,
} from "@/lib/trending-cache"
import type { TokenDetail } from "@/lib/types/trading"

export async function getTickerTrending(): Promise<TickerToken[]> {
  const tokens = await fetchTrendingTokens(12)
  return tokens ?? []
}

export async function getTradingTrending(): Promise<TokenDetail[]> {
  const fresh = getFreshTrendingCache()
  if (fresh && fresh.length > 0) return fresh

  const stale = getStaleTrendingCache()

  try {
    const birdeye = await fetchTrendingTokenDetails(20)
    if (birdeye.length > 0) {
      setTrendingCache(birdeye)
      return birdeye
    }
  } catch {
    // Fall through to DexScreener
  }

  try {
    const dexTrending = await fetchDexScreenerTrendingTokens(20)
    if (dexTrending.length > 0) {
      setTrendingCache(dexTrending)
      return dexTrending
    }
  } catch {
    // Fall through to stale cache
  }

  if (stale && stale.length > 0) return stale

  return []
}

export function tickerTrendingPrefetchOptions() {
  return {
    queryKey: queryKeys.ticker.trending(),
    queryFn: getTickerTrending,
    staleTime: TRENDING_CACHE_TTL_MS,
  }
}

export function tradingTrendingPrefetchOptions() {
  return {
    queryKey: queryKeys.trading.trending(),
    queryFn: getTradingTrending,
    staleTime: TRENDING_CACHE_TTL_MS,
  }
}
