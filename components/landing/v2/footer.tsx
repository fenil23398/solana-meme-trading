import Link from "next/link"

import { BrandLogo } from "@/components/landing/brand-logo"
import { APP_LINKS, SOCIAL_LINKS } from "@/lib/constants"

const FOOTER_LINKS = {
  About: [
    { label: "Blog", href: "https://www.chadwallet.xyz" },
    { label: "FAQ", href: "https://www.chadwallet.xyz" },
    { label: "Affiliates", href: "https://www.chadwallet.xyz" },
    { label: "Rewards", href: "https://www.chadwallet.xyz/rewards" },
  ],
  Social: [
    { label: "Discord", href: SOCIAL_LINKS.discord },
    { label: "X/Twitter", href: SOCIAL_LINKS.twitter },
    { label: "Telegram", href: SOCIAL_LINKS.telegram },
  ],
  Legal: [
    { label: "Privacy Policy", href: "https://www.chadwallet.xyz" },
    { label: "Terms of Service", href: "https://www.chadwallet.xyz" },
  ],
} as const

export function V2Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080404] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand + tagline */}
          <div className="shrink-0">
            <Link href="/">
              <BrandLogo size="sm" />
            </Link>
            <p className="mt-4 text-sm text-white/30">
              where traders become legends.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            {(
              Object.entries(FOOTER_LINKS) as [
                string,
                readonly { label: string; href: string }[],
              ][]
            ).map(([section, links]) => (
              <div key={section}>
                <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-white/25">
                  {section}
                </p>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-white/40 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-7">
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} Chad Wallet L.L.C.
          </p>
        </div>
      </div>
    </footer>
  )
}
