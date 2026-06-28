import { keepPreviousData, queryOptions } from "@tanstack/react-query"

import { queryKeys } from "@/lib/queries/keys"
import type { TokenBundle } from "@/lib/token-cache"

const STALE_TIME = 30_000
const CHART_PAIR_STALE_TIME = 5 * 60_000

async function fetchTokenBundleClient(address: string): Promise<TokenBundle> {
  const response = await fetch(`/api/trading/token/${address}`)
  if (!response.ok) {
    throw new Error("Failed to fetch token data")
  }
  return response.json() as Promise<TokenBundle>
}

async function fetchChartPairClient(
  address: string
): Promise<{ pairAddress: string }> {
  const response = await fetch(`/api/trading/token/${address}/chart-pair`)
  if (!response.ok) {
    throw new Error("Failed to fetch chart pair")
  }
  return response.json() as Promise<{ pairAddress: string }>
}

export function tokenBundleQueryOptions(address: string) {
  return queryOptions({
    queryKey: queryKeys.trading.token(address),
    queryFn: () => fetchTokenBundleClient(address),
    enabled: Boolean(address) && !address.startsWith("fallback-"),
    staleTime: STALE_TIME,
    placeholderData: keepPreviousData,
    retry: 2,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export function chartPairQueryOptions(address: string) {
  return queryOptions({
    queryKey: queryKeys.trading.chartPair(address),
    queryFn: () => fetchChartPairClient(address),
    enabled: Boolean(address) && !address.startsWith("fallback-"),
    staleTime: CHART_PAIR_STALE_TIME,
    placeholderData: keepPreviousData,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}
