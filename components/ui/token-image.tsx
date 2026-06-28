"use client"

import { useEffect, useState } from "react"

import { getProxiedTokenIconByAddress, getProxiedTokenIconUrl } from "@/lib/token-icon"
import { cn } from "@/lib/utils"

type TokenImageProps = {
  symbol: string
  address?: string
  icon?: string | null
  className?: string
  fallbackClassName?: string
}

export function TokenImage({
  symbol,
  address,
  icon,
  className,
  fallbackClassName,
}: TokenImageProps) {
  const [failed, setFailed] = useState(false)
  const [useAddressFallback, setUseAddressFallback] = useState(false)

  useEffect(() => {
    setFailed(false)
    setUseAddressFallback(false)
  }, [icon, address])

  const src = useAddressFallback
    ? address
      ? getProxiedTokenIconByAddress(address)
      : undefined
    : getProxiedTokenIconUrl(icon) ??
      (address ? getProxiedTokenIconByAddress(address) : undefined)

  if (!src || failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-white/10 font-bold uppercase text-white/70",
          fallbackClassName ?? className
        )}
      >
        {symbol.slice(0, 1)}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn("shrink-0 rounded-full object-cover ring-1 ring-white/10", className)}
      onError={() => {
        if (!useAddressFallback && address && icon) {
          setUseAddressFallback(true)
          return
        }
        setFailed(true)
      }}
    />
  )
}
