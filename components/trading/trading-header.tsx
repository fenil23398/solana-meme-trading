import Link from "next/link"

import { AuthButton } from "@/components/trading/auth-button"
import { FomoLogo } from "@/components/landing/v2/fomo-logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TradingHeader() {
  return (
    <header className="sticky top-9 z-50 border-b border-white/[0.06] bg-[#080404]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-2 sm:h-16 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="min-w-0">
            <FomoLogo className="h-[16px] text-[#CBD0EB]" />
          </Link>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 sm:inline">
            Trade
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden text-white/60 hover:text-white sm:inline-flex"
            )}
          >
            Home
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  )
}
