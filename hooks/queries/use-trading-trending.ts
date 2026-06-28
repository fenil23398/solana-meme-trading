"use client"

import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { tradingTrendingQueryOptions } from "@/lib/queries/trending.client"

export function useTradingTrending() {
  const queryClient = useQueryClient()
  const query = useQuery(tradingTrendingQueryOptions())

  useEffect(() => {
    if ((query.data?.length ?? 0) > 0) return
    void queryClient.fetchQuery(tradingTrendingQueryOptions())
  }, [query.data?.length, queryClient])

  return query
}
