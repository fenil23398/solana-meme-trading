"use client"

import { useParams } from "next/navigation"

import { useTokenBundle } from "@/hooks/queries/use-token-bundle"
import { useTradingTrending } from "@/hooks/queries/use-trading-trending"
import type { TokenDetail } from "@/lib/types/trading"

export function useResolvedTokenOverview() {
  const params = useParams<{ address: string }>()
  const address = params.address
  const { data: bundle, isLoading, isFetching, isError } = useTokenBundle()
  const { data: trending = [] } = useTradingTrending()

  const matchedBundle =
    bundle?.overview?.address === address ? bundle : undefined
  const placeholder = trending.find((token) => token.address === address)
  const overview: TokenDetail | undefined =
    matchedBundle?.overview ?? placeholder
  const isPlaceholder = Boolean(overview && !matchedBundle?.overview)

  return {
    address,
    overview,
    fullOverview: matchedBundle?.overview,
    isPlaceholder,
    isLoading: isLoading && !overview,
    isFetching,
    isError,
    bundle: matchedBundle,
  }
}
