import { NextResponse } from "next/server"

import { fetchTrendingTokens } from "@/lib/birdeye"
import { TICKER_TOKENS } from "@/lib/constants"

export const revalidate = 60

export async function GET() {
  try {
    const tokens = await fetchTrendingTokens(12)

    if (!tokens?.length) {
      return NextResponse.json({
        tokens: TICKER_TOKENS,
        source: "fallback",
      })
    }

    return NextResponse.json({
      tokens,
      source: "birdeye",
    })
  } catch (error) {
    console.error("Failed to fetch trending tokens:", error)

    return NextResponse.json({
      tokens: TICKER_TOKENS,
      source: "fallback",
    })
  }
}
