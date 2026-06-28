import { NextResponse } from "next/server"

import { getTokenBundle } from "@/lib/queries/token.server"

export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{ address: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { address } = await context.params

  if (!address || address.startsWith("fallback-")) {
    return NextResponse.json({ error: "Invalid token address" }, { status: 400 })
  }

  try {
    const payload = await getTokenBundle(address)
    return NextResponse.json(payload)
  } catch {
    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 })
  }
}
