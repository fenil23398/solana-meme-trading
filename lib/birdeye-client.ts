const BIRDEYE_API_BASE = "https://public-api.birdeye.so"

type FetchOptions = {
  revalidate?: number
  searchParams?: Record<string, string>
  retries?: number
  fresh?: boolean
}

type BirdEyeEnvelope = {
  success?: boolean
  message?: string
}

export function getBirdEyeApiKey() {
  return process.env.BIRDEYE_API_KEY
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRateLimitMessage(message?: string) {
  if (!message) return false
  const lower = message.toLowerCase()
  return (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("compute units")
  )
}

export async function birdeyeFetch<T>(
  path: string,
  { revalidate = 60, searchParams, retries = 1, fresh = false }: FetchOptions = {}
): Promise<T | null> {
  const apiKey = getBirdEyeApiKey()
  if (!apiKey) return null

  const url = new URL(`${BIRDEYE_API_BASE}${path}`)
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value)
    }
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        headers: {
          "X-API-KEY": apiKey,
          "x-chain": "solana",
          accept: "application/json",
        },
        ...(fresh
          ? { cache: "no-store" as const }
          : { next: { revalidate } }),
      })

      const json = (await response.json()) as T & BirdEyeEnvelope

      if (json.success === false) {
        if (isRateLimitMessage(json.message) && attempt < retries) {
          await wait(1200 * (attempt + 1))
          continue
        }
        return null
      }

      if (!response.ok) {
        if ((response.status === 429 || response.status === 400) && attempt < retries) {
          await wait(1200 * (attempt + 1))
          continue
        }
        return null
      }

      return json
    } catch {
      if (attempt < retries) {
        await wait(1200 * (attempt + 1))
        continue
      }
      return null
    }
  }

  return null
}
