import { NextResponse } from "next/server"

import { getTickerTrending } from "@/lib/queries/trending.server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const tokens = await getTickerTrending()
    return NextResponse.json({ tokens })
  } catch (error) {
    console.error("Failed to fetch trending tokens:", error)
    return NextResponse.json({ tokens: [] })
  }
}
