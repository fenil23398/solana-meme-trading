import type { QueryClient } from "@tanstack/react-query"

import {
  chartPairQueryOptions,
  tokenBundleQueryOptions,
} from "@/lib/queries/token.client"

export function prefetchTokenQueries(queryClient: QueryClient, address: string) {
  if (!address || address.startsWith("fallback-")) return

  void queryClient.prefetchQuery(tokenBundleQueryOptions(address))
  void queryClient.prefetchQuery(chartPairQueryOptions(address))
}
