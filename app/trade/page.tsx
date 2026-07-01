// import { redirect } from "next/navigation"

// import { getTradingTrending } from "@/lib/queries/trending.server"
// import { getStaleTrendingCache } from "@/lib/trending-cache"
// import type { TokenDetail } from "@/lib/types/trading"

// export const dynamic = "force-dynamic"

// function resolveDefaultAddress(tokens: TokenDetail[]) {
//   const address = tokens.find(
//     (token) => token.address && !token.address.startsWith("fallback-")
//   )?.address

//   return address ?? null
// }

// export default async function TradeIndexPage() {
//   let tokens: TokenDetail[] = []

//   try {
//     tokens = await getTradingTrending()
//   } catch {
//     // Fetch failed — fall through to stale cache below
//   }

//   const address =
//     resolveDefaultAddress(tokens) ??
//     resolveDefaultAddress(getStaleTrendingCache() ?? [])

//   if (address) {
//     redirect(`/trade/${address}`)
//   }

//   redirect("/")
// }

import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function TradeIndexPage() {
  redirect("/")
}
