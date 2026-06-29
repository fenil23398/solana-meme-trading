import Link from "next/link"

import { BrandLogo } from "@/components/landing/brand-logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function V2Header() {
  return (
    <header className="sticky top-9 z-50 border-b border-white/[0.06] bg-[#080404]/90 backdrop-blur-xl">
      <div className="flex h-14 w-full items-center justify-between px-5 sm:h-16 sm:px-6 lg:px-8">
        <Link href="/">
          <BrandLogo size="sm" />
        </Link>

        <Link
          href="/trade"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-[13px] font-medium text-white/55 hover:text-white"
          )}
        >
          Login
        </Link>
      </div>
    </header>
  )
}
