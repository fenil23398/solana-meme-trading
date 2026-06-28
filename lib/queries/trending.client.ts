import { queryOptions } from "@tanstack/react-query"

import { queryKeys } from "@/lib/queries/keys"
import {
  readClientTrendingCache,
  readStaleClientTrendingCache,
  writeClientTrendingCache,
} from "@/lib/trending-cache.client"
import { TRENDING_CACHE_TTL_MS } from "@/lib/trending-cache"
import type { TokenDetail } from "@/lib/types/trading"

// Keep in sync with server stale TTL (1 hour)
const TRENDING_STALE_CACHE_TTL_MS = 60 * 60_000

async function fetchTradingTrendingClient(): Promise<TokenDetail[]> {
  const response = await fetch("/api/trading/trending", {
    cache: "no-store",
    headers: { accept: "application/json" },
  })

  if (!response.ok) {
    const stale = readStaleClientTrendingCache()
    if (stale?.length) return stale
    throw new Error("Failed to fetch trending tokens")
  }

  const data = (await response.json()) as { tokens: TokenDetail[] }
  const tokens = data.tokens ?? []

  if (tokens.length > 0) {
    writeClientTrendingCache(tokens)
    return tokens
  }

  const stale = readStaleClientTrendingCache()
  if (stale?.length) return stale

  return tokens
}

function trendingPlaceholderData(
  previousData?: TokenDetail[]
): TokenDetail[] | undefined {
  if (previousData?.length) return previousData
  const cached = readClientTrendingCache() ?? readStaleClientTrendingCache()
  return cached && cached.length > 0 ? cached : undefined
}

export function tradingTrendingQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.trading.trending(),
    queryFn: fetchTradingTrendingClient,
    placeholderData: trendingPlaceholderData,
    staleTime: TRENDING_CACHE_TTL_MS,
    gcTime: TRENDING_STALE_CACHE_TTL_MS,
    refetchInterval: TRENDING_CACHE_TTL_MS,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 2,
  })
}
