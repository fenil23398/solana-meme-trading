"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { APP_LINKS } from "@/lib/constants"

const IOS_QR = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&color=000000&bgcolor=ffffff&data=${encodeURIComponent(APP_LINKS.ios)}`
const ANDROID_QR = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&color=000000&bgcolor=ffffff&data=${encodeURIComponent(APP_LINKS.android)}`

type Props = {
  open: boolean
  onClose: () => void
}

export function DownloadModal({ open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-[#606AF730] bg-[#0d0b1a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <p className="text-base font-semibold text-[#EAEDFF]">
            Download fomo.family
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#D1D8FF40] transition-colors hover:bg-[#606AF718] hover:text-[#EAEDFF]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* QR codes */}
        <div className="grid grid-cols-2 divide-x divide-white/[0.06] px-2 py-6">
          {/* iOS */}
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="overflow-hidden rounded-xl bg-white p-1.5">
              <Image
                src={IOS_QR}
                alt="Scan to download on iOS"
                width={140}
                height={140}
                unoptimized
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D1D8FF40]">
                iOS
              </p>
              <p className="mt-0.5 text-xs text-[#D1D8FF30]">App Store</p>
            </div>
          </div>

          {/* Android */}
          <div className="flex flex-col items-center gap-3 px-4">
            <div className="overflow-hidden rounded-xl bg-white p-1.5">
              <Image
                src={ANDROID_QR}
                alt="Scan to download on Android"
                width={140}
                height={140}
                unoptimized
              />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#D1D8FF40]">
                Android
              </p>
              <p className="mt-0.5 text-xs text-[#D1D8FF30]">Google Play</p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="border-t border-white/[0.05] px-6 py-3 text-center text-[11px] text-[#D1D8FF25]">
          Scan with your phone camera to download
        </p>
      </div>
    </div>
  )
}
