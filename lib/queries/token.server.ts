import "server-only"

import {
  applyHolderSupply,
  fetchTokenHolders,
  fetchTokenTrades,
} from "@/lib/birdeye"
import { fetchDexScreenerPairAddress } from "@/lib/dexscreener"
import { queryKeys } from "@/lib/queries/keys"
import { resolveTokenOverview } from "@/lib/token-market"
import { dedupeTrades } from "@/lib/trading/trade-id"
import {
  getCachedToken,
  mergeCachedToken,
} from "@/lib/token-cache"
import type { OhlcvCandle, TokenHolder, TokenTrade } from "@/lib/types/trading"

const STALE_TIME = 30_000

function hasSecondaryMarketData(bundle: {
  trades: unknown[]
  holders: unknown[]
}) {
  return bundle.trades.length > 0 || bundle.holders.length > 0
}

function emptyBundleOhlcv(): OhlcvCandle[] {
  return []
}

export async function getTokenBundle(address: string) {
  if (!address || address.startsWith("fallback-")) {
    throw new Error("Invalid token address")
  }

  const cached = getCachedToken(address)
  if (cached?.overview?.address === address && hasSecondaryMarketData(cached)) {
    const overview = await resolveTokenOverview(address)
    if (!overview) return cached

    const pairAddress = await fetchDexScreenerPairAddress(address).catch(() => null)
    const trades = await fetchTokenTrades(address, {
      pairAddress,
      referencePrice: overview.price,
    }).catch(() => cached.trades)

    return mergeCachedToken(address, {
      ...cached,
      overview,
      trades,
      ohlcv: emptyBundleOhlcv(),
    })
  }

  const overview = await resolveTokenOverview(address)
  if (!overview) {
    throw new Error("Token not found")
  }

  const pairAddress = await fetchDexScreenerPairAddress(address).catch(() => null)

  const [holders, trades] = await Promise.all([
    fetchTokenHolders(address, overview.totalSupply).catch(
      () => cached?.holders ?? ([] as TokenHolder[])
    ),
    fetchTokenTrades(address, {
      pairAddress,
      referencePrice: overview.price,
    }).catch(() => cached?.trades ?? ([] as TokenTrade[])),
  ])

  return mergeCachedToken(address, {
    overview,
    ohlcv: emptyBundleOhlcv(),
    holders: applyHolderSupply(
      holders.length > 0 ? holders : (cached?.holders ?? []),
      overview.totalSupply
    ),
    trades: dedupeTrades(trades.length > 0 ? trades : (cached?.trades ?? [])),
  })
}

export function tokenBundlePrefetchOptions(address: string) {
  return {
    queryKey: queryKeys.trading.token(address),
    queryFn: () => getTokenBundle(address),
    staleTime: STALE_TIME,
  }
}
