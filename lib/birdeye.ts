import { mapBirdEyeToTickers, type BirdEyeTrendingToken } from "@/lib/ticker"

const BIRDEYE_API_BASE = "https://public-api.birdeye.so"

type BirdEyeTrendingResponse = {
  data?: {
    tokens?: BirdEyeTrendingToken[]
  }
  success?: boolean
}

export async function fetchTrendingTokens(limit = 12) {
  const apiKey = process.env.BIRDEYE_API_KEY

  if (!apiKey) {
    return null
  }

  const url = new URL(`${BIRDEYE_API_BASE}/defi/token_trending`)
  url.searchParams.set("sort_by", "rank")
  url.searchParams.set("sort_type", "asc")
  url.searchParams.set("offset", "0")
  url.searchParams.set("limit", String(Math.min(limit, 20)))

  const response = await fetch(url.toString(), {
    headers: {
      "X-API-KEY": apiKey,
      "x-chain": "solana",
      accept: "application/json",
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(`BirdEye API error: ${response.status}`)
  }

  const json = (await response.json()) as BirdEyeTrendingResponse
  const tokens = json.data?.tokens ?? []

  if (tokens.length === 0) {
    return null
  }

  return mapBirdEyeToTickers(tokens)
}
