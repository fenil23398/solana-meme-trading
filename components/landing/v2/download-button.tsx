"use client"

import { useState } from "react"

import { APP_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { DownloadModal } from "@/components/landing/v2/download-modal"

type Variant = "frosted" | "purple"

type Props = {
  label?: string
  variant?: Variant
  className?: string
}

function isMobile() {
  if (typeof navigator === "undefined") return false
  return /android|iphone|ipad|ipod/i.test(navigator.userAgent)
}

function mobileStoreUrl() {
  if (typeof navigator === "undefined") return APP_LINKS.ios
  return /android/i.test(navigator.userAgent) ? APP_LINKS.android : APP_LINKS.ios
}

const VARIANT_CLASS: Record<Variant, string> = {
  frosted:
    "border border-white/[0.15] bg-white/[0.12] text-white backdrop-blur-md hover:bg-white/20",
  purple:
    "border border-white/[0.15] bg-[#606AF7]/50 text-white backdrop-blur-md hover:bg-[#606AF7]/80",
}

export function DownloadButton({
  label = "Download app",
  variant = "frosted",
  className,
}: Props) {
  const [open, setOpen] = useState(false)

  function handleClick() {
    if (isMobile()) {
      window.open(mobileStoreUrl(), "_blank", "noopener,noreferrer")
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "flex h-12 min-w-[11rem] cursor-pointer items-center justify-center rounded-xl text-[15px] font-bold transition-colors",
          VARIANT_CLASS[variant],
          className
        )}
      >
        {label}
      </button>

      <DownloadModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
