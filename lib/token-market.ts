import "server-only"

import { fetchTokenOverview } from "@/lib/birdeye"
import {
  fetchDexScreenerPrimaryPair,
  mergeDexScreenerIntoOverview,
  overviewFromDexScreenerMarket,
} from "@/lib/dexscreener"
import type { TokenDetail } from "@/lib/types/trading"

export async function resolveTokenOverview(
  address: string,
  options: { fresh?: boolean } = {}
): Promise<TokenDetail | null> {
  const [birdeyeOverview, dexMarket] = await Promise.all([
    fetchTokenOverview(address, options).catch(() => null),
    fetchDexScreenerPrimaryPair(address),
  ])

  if (birdeyeOverview && dexMarket) {
    return mergeDexScreenerIntoOverview(birdeyeOverview, dexMarket)
  }

  if (birdeyeOverview) return birdeyeOverview

  if (dexMarket && dexMarket.priceUsd > 0) {
    return overviewFromDexScreenerMarket(address, dexMarket)
  }

  return null
}
