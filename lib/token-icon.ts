const ICON_HOST_ALLOWLIST = [
  "ipfs.io",
  "cloudflare-ipfs.com",
  "gateway.pinata.cloud",
  "mypinata.cloud",
  "arweave.net",
  "abs.twimg.com",
  "pbs.twimg.com",
  "raw.githubusercontent.com",
  "cdn.jsdelivr.net",
  "shdw-drive.genesysgo.net",
  "static.jup.ag",
  "dd.dexscreener.com",
  "cdn.dexscreener.com",
  "img.fotofolio.xyz",
  "wsrv.nl",
  "coin-images.coingecko.com",
  "i.ibb.co",
  "ibb.co",
  "metadata.drift.foundation",
]

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://gateway.pinata.cloud/ipfs/",
  "https://cloudflare-ipfs.com/ipfs/",
]

export function extractIpfsCid(url: string): string | null {
  const match = url.match(/\/ipfs\/([^/?#]+)/)
  return match?.[1] ?? null
}

export function normalizeTokenIconUrl(url: string): string | undefined {
  try {
    const trimmed = url.trim()
    if (!trimmed) return undefined

    const cid = extractIpfsCid(trimmed)
    if (cid) return `${IPFS_GATEWAYS[0]}${cid}`

    const parsed = new URL(trimmed)
    if (parsed.protocol !== "https:") return undefined

    return trimmed
  } catch {
    return undefined
  }
}

export function isAllowedIconUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return ICON_HOST_ALLOWLIST.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    )
  } catch {
    return false
  }
}

export function getTokenIconCandidates(icon?: string | null): string[] {
  const normalized = icon ? normalizeTokenIconUrl(icon) : undefined
  if (!normalized) return []

  const cid = extractIpfsCid(normalized)
  if (cid) {
    return IPFS_GATEWAYS.map((gateway) => `${gateway}${cid}`)
  }

  return [normalized]
}

export function getProxiedTokenIconUrl(icon?: string | null): string | undefined {
  const normalized = icon ? normalizeTokenIconUrl(icon) : undefined
  if (!normalized) return undefined

  return `/api/token-icon?url=${encodeURIComponent(normalized)}`
}

export function getProxiedTokenIconByAddress(address: string): string {
  return `/api/token-icon?address=${encodeURIComponent(address)}`
}

export function buildDexScreenerBoostIconUrl(boost: {
  icon?: string
  header?: string
}): string | undefined {
  if (boost.header) {
    try {
      const parsed = new URL(boost.header)
      parsed.searchParams.set("width", "64")
      parsed.searchParams.set("height", "64")
      parsed.searchParams.set("fit", "crop")
      parsed.searchParams.set("quality", "95")
      parsed.searchParams.set("format", "auto")
      return parsed.toString()
    } catch {
      // Fall through to icon id
    }
  }

  if (!boost.icon) return undefined

  const params = new URLSearchParams({
    width: "64",
    height: "64",
    fit: "crop",
    quality: "95",
    format: "auto",
  })

  return `https://cdn.dexscreener.com/cms/images/${boost.icon}?${params.toString()}`
}

export function getTokenIconCandidatesForAddress(address: string): string[] {
  const lower = address.toLowerCase()
  return [
    `https://img.fotofolio.xyz/${address}`,
    `https://dd.dexscreener.com/ds-data/tokens/solana/${lower}.png`,
  ]
}

export function iconFetchHeaders(url: string): HeadersInit {
  const headers: Record<string, string> = {
    accept: "image/*",
    "user-agent": "Mozilla/5.0 (compatible; fomo.family/1.0)",
  }

  try {
    const { hostname } = new URL(url)
    if (hostname.includes("dexscreener.com")) {
      headers.referer = "https://dexscreener.com/"
    }
  } catch {
    // Ignore malformed URLs
  }

  return headers
}
