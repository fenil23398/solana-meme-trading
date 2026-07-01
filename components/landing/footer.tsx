import Link from "next/link"

import { FomoLogo } from "@/components/landing/v2/fomo-logo"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { APP_LINKS, SOCIAL_LINKS } from "@/lib/constants"

const FOOTER_LINKS = {
  about: [
    { label: "Blog", href: "https://fomo.family/blog" },
    { label: "FAQ", href: "https://fomo.family/answers" },
    { label: "Affiliates", href: "https://fomo.family/affiliates" },
  ],
  social: [
    { label: "Discord", href: SOCIAL_LINKS.discord },
    { label: "X / Twitter", href: SOCIAL_LINKS.twitter },
    { label: "Telegram", href: SOCIAL_LINKS.telegram },
  ],
  legal: [
    { label: "Privacy Policy", href: "https://fomo.family/privacy-policy" },
    { label: "Terms of Service", href: "https://fomo.family/terms" },
  ],
} as const

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050303] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
            <div>
              <Link href="/">
                <FomoLogo className="h-[16px] text-[#CBD0EB]" />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
                Where traders become legends.
              </p>
              <div className="mt-6 flex gap-5">
                <Link
                  href={APP_LINKS.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/45 transition-colors hover:text-brand"
                >
                  iOS
                </Link>
                <Link
                  href={APP_LINKS.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/45 transition-colors hover:text-brand"
                >
                  Android
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-12">
              {(
                Object.entries(FOOTER_LINKS) as [
                  string,
                  readonly { label: string; href: string }[],
                ][]
              ).map(([section, links]) => (
                <div key={section}>
                  <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                    {section}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-white/45 transition-colors hover:text-white"
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

          <div className="mt-14 border-t border-white/[0.06] pt-8 text-center text-sm text-white/30">
            © {new Date().getFullYear()} fomo.family
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
