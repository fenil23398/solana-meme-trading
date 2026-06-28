import { NextResponse } from "next/server"

import { getTradingTrending } from "@/lib/queries/trending.server"

export const dynamic = "force-dynamic"

export async function GET() {
  const tokens = await getTradingTrending()
  return NextResponse.json({ tokens })
}
