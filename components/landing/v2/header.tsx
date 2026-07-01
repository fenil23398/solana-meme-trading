import Link from "next/link"

import { FomoLogo } from "@/components/landing/v2/fomo-logo"

export function V2Header() {
  return (
    <header className="sticky top-9 z-50 border-b border-white/[0.05] backdrop-blur-xl">
      <div className="flex h-14 w-full items-center justify-between px-5 sm:h-16 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <FomoLogo className="h-[18px] text-[#CBD0EB]" />
          <span className="hidden text-[11px] font-medium tracking-[0.18em] text-[#D1D8FF40] sm:inline">
            .family
          </span>
        </Link>

        <Link
          href="/trade"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-[#606AF730] bg-[#606AF718] px-4 text-[13px] font-medium text-[#9BA4FA] transition-all duration-200 hover:border-[#606AF760] hover:bg-[#606AF730] hover:text-[#EAEDFF]"
        >
          Open app
        </Link>
      </div>
    </header>
  )
}
