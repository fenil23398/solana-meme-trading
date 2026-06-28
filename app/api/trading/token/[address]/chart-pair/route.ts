import { NextResponse } from "next/server"

import { fetchDexScreenerPairAddress } from "@/lib/dexscreener"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ address: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params

  if (!address || address.startsWith("fallback-")) {
    return NextResponse.json({ error: "Invalid token address" }, { status: 400 })
  }

  const pairAddress = await fetchDexScreenerPairAddress(address)

  return NextResponse.json({
    pairAddress: pairAddress ?? address,
  })
}
