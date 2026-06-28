import { getSubscriptPriceParts, formatUsd } from "@/lib/format"
import { cn } from "@/lib/utils"

export function PriceText({
  value,
  compact = false,
  className,
}: {
  value: number
  compact?: boolean
  className?: string
}) {
  if (!Number.isFinite(value)) {
    return <span className={className}>—</span>
  }

  if (compact) {
    return <span className={cn("font-mono tabular-nums", className)}>{formatUsd(value, true)}</span>
  }

  const parts = getSubscriptPriceParts(value)
  if (!parts) {
    return <span className={cn("font-mono tabular-nums", className)}>{formatUsd(value)}</span>
  }

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {parts.prefix}
      <sub className="text-[0.72em]">{parts.subscript}</sub>
      {parts.suffix}
    </span>
  )
}
