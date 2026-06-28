import { NextResponse } from "next/server"

import {
  getTokenIconCandidates,
  getTokenIconCandidatesForAddress,
  iconFetchHeaders,
  isAllowedIconUrl,
  normalizeTokenIconUrl,
} from "@/lib/token-icon"

export const dynamic = "force-dynamic"

async function fetchIconCandidate(candidate: string) {
  const response = await fetch(candidate, {
    headers: iconFetchHeaders(candidate),
    redirect: "follow",
    signal: AbortSignal.timeout(8_000),
  })

  if (!response.ok) return null

  const contentType = response.headers.get("content-type") ?? "image/png"
  if (!contentType.startsWith("image/")) return null

  const buffer = await response.arrayBuffer()
  if (buffer.byteLength === 0) return null

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}

async function resolveIconResponse(candidates: string[]) {
  for (const candidate of candidates) {
    try {
      const normalized = normalizeTokenIconUrl(candidate) ?? candidate
      if (!isAllowedIconUrl(normalized)) continue

      const response = await fetchIconCandidate(normalized)
      if (response) return response
    } catch {
      continue
    }
  }

  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get("url")
  const address = searchParams.get("address")

  if (rawUrl) {
    const normalized = normalizeTokenIconUrl(rawUrl)
    if (!normalized || !isAllowedIconUrl(normalized)) {
      return NextResponse.json({ error: "Invalid icon url" }, { status: 400 })
    }

    const response = await resolveIconResponse(getTokenIconCandidates(normalized))
    if (response) return response

    return NextResponse.json({ error: "Icon not found" }, { status: 404 })
  }

  if (address) {
    const response = await resolveIconResponse(
      getTokenIconCandidatesForAddress(address)
    )
    if (response) return response

    return NextResponse.json({ error: "Icon not found" }, { status: 404 })
  }

  return NextResponse.json({ error: "Missing url or address" }, { status: 400 })
}
