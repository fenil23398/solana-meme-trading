import type { TokenDetail } from "@/lib/types/trading"

const STORAGE_KEY = "chad-wallet:trending-tokens:v2"
const FRESH_TTL_MS = 30_000
const STALE_TTL_MS = 60 * 60_000

type StoredTrending = {
  tokens: TokenDetail[]
  fetchedAt: number
}

function readStored(): StoredTrending | null {
  if (typeof window === "undefined") return null

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredTrending
    if (!Array.isArray(parsed.tokens) || parsed.tokens.length === 0) return null
    return parsed
  } catch {
    return null
  }
}

export function readClientTrendingCache(): TokenDetail[] | null {
  const stored = readStored()
  if (!stored) return null
  if (Date.now() - stored.fetchedAt > FRESH_TTL_MS) return null
  return stored.tokens
}

export function readStaleClientTrendingCache(): TokenDetail[] | null {
  const stored = readStored()
  if (!stored) return null
  if (Date.now() - stored.fetchedAt > STALE_TTL_MS) return null
  return stored.tokens
}

export function writeClientTrendingCache(tokens: TokenDetail[]) {
  if (typeof window === "undefined" || tokens.length === 0) return

  const payload: StoredTrending = {
    tokens,
    fetchedAt: Date.now(),
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore quota errors
  }
}
