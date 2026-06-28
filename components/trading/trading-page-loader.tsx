"use client"

import { cn } from "@/lib/utils"

export function TradingPageLoader({
  show,
  className,
}: {
  show: boolean
  className?: string
}) {
  if (!show) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#080404]/75 backdrop-blur-sm",
        className
      )}
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading trading data"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-brand" />
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/45">
          Refreshing…
        </p>
      </div>
    </div>
  )
}
