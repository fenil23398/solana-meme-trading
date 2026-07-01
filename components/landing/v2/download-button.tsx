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
    "border border-[#EAEDFF18] bg-[#EAEDFF0c] text-[#EAEDFF] backdrop-blur-md hover:bg-[#EAEDFF18] hover:border-[#EAEDFF30]",
  purple:
    "border border-[#606AF730] bg-[#606AF720] text-[#9BA4FA] backdrop-blur-md hover:bg-[#606AF740] hover:border-[#606AF760] hover:text-[#EAEDFF]",
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
