const SUBSCRIPT_DIGITS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"] as const

export type SubscriptPriceParts = {
  prefix: string
  subscript: string
  suffix: string
}

function toSubscriptDigits(value: number) {
  return String(value)
    .split("")
    .map((digit) => SUBSCRIPT_DIGITS[Number(digit)] ?? digit)
    .join("")
}

function formatMantissaFromDecimal(value: number, zeroCount: number) {
  const decimals = value.toFixed(zeroCount + 4).split(".")[1] ?? ""
  const suffix = decimals.slice(zeroCount).replace(/0+$/u, "")

  return suffix || null
}

export function getSubscriptPriceParts(value: number): SubscriptPriceParts | null {
  if (!Number.isFinite(value) || value <= 0 || value >= 0.01) return null

  const exponent = Math.floor(Math.log10(value))
  const zeroCount = -exponent - 1
  if (zeroCount < 3) return null

  const suffix = formatMantissaFromDecimal(value, zeroCount)
  if (!suffix) return null

  return {
    prefix: "$0.0",
    subscript: toSubscriptDigits(zeroCount),
    suffix,
  }
}

export function formatSubscriptPrice(value: number) {
  const parts = getSubscriptPriceParts(value)
  if (!parts) return null

  return `${parts.prefix}${parts.subscript}${parts.suffix}`
}

export function formatUsd(value: number, compact = false) {
  if (!Number.isFinite(value)) return "—"
  if (value === 0) return "$0.00"

  if (compact) {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  }

  const subscript = formatSubscriptPrice(value)
  if (subscript) return subscript

  if (value >= 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (value >= 0.01) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 8,
  }).format(value)
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) return "—"
  const sign = value >= 0 ? "+" : ""
  const abs = Math.abs(value)

  if (abs >= 0.01) return `${sign}${value.toFixed(2)}%`
  if (abs >= 0.0001) return `${sign}${value.toFixed(4)}%`
  return `${sign}${value.toPrecision(3)}%`
}

export function formatSharePercent(value: number) {
  if (!Number.isFinite(value)) return "—"
  if (value >= 0.01) return `${value.toFixed(2)}%`
  if (value >= 0.0001) return `${value.toFixed(4)}%`
  return `${value.toPrecision(3)}%`
}

export function formatTokenAmount(value: number) {
  if (!Number.isFinite(value)) return "—"
  if (value === 0) return "0"

  const subscript = formatSubscriptPrice(value)
  if (subscript) return subscript.replace(/^\$/u, "")

  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  if (value >= 1) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 })
  }
  if (value >= 0.0001) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 6 })
  }

  return value.toLocaleString("en-US", { maximumSignificantDigits: 6 })
}

export function formatChartPrice(value: number) {
  const subscript = formatSubscriptPrice(value)
  if (subscript) return subscript.replace(/^\$/u, "")

  if (!Number.isFinite(value)) return ""
  if (value === 0) return "0"
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(4)
  if (value >= 0.0001) return value.toFixed(6)
  return value.toPrecision(4)
}

export function getChartPriceFormat(referencePrice: number) {
  if (!Number.isFinite(referencePrice) || referencePrice <= 0) {
    return { precision: 6, minMove: 0.000001 }
  }

  if (referencePrice >= 100) return { precision: 2, minMove: 0.01 }
  if (referencePrice >= 1) return { precision: 4, minMove: 0.0001 }
  if (referencePrice >= 0.01) return { precision: 6, minMove: 0.000001 }

  const exponent = Math.floor(Math.log10(referencePrice))
  const precision = Math.min(10, Math.max(6, -exponent + 2))
  const minMove = 10 ** exponent

  return { precision, minMove }
}

export function shortenAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}

export function formatCompactRelativeTime(unixSeconds: number) {
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

export function formatRelativeTime(unixSeconds: number) {
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
