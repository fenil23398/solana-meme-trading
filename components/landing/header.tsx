import Link from "next/link"

import { FomoLogo } from "@/components/landing/v2/fomo-logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="sticky top-9 z-50 border-b border-white/[0.06] bg-[#080404]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-2 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0">
          <FomoLogo className="h-[16px] text-[#CBD0EB]" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/trade"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-[14px] font-medium text-white/60 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            Trade
          </Link>
          <Link
            href="#download"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "ml-2 border-white/12 bg-transparent text-[14px] font-medium text-white hover:bg-white/[0.04]"
            )}
          >
            Download
          </Link>
        </nav>

        <Link
          href="#download"
          className={cn(
            buttonVariants({ size: "sm" }),
            "shrink-0 bg-brand font-semibold text-black hover:bg-brand/90 md:hidden"
          )}
        >
          Get app
        </Link>
      </div>
    </header>
  )
}
