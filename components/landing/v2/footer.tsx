"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

import { FomoLogo } from "@/components/landing/v2/fomo-logo"

const EASE = [0.22, 1, 0.36, 1] as const
const VIEW = { once: true, amount: 0.1 } as const

const SOCIAL_ICON_PATHS = {
  discord: (
    <path
      d="M16.9419 1.29643C15.6473 0.690699 14.263 0.250481 12.8157 -0.000183105C12.638 0.321159 12.4304 0.753372 12.2872 1.09719C10.7487 0.864914 9.22373 0.864914 7.71226 1.09719C7.56904 0.753372 7.35638 0.321159 7.17862 -0.000183105C5.72395 0.250481 4.33218 0.698122 3.03759 1.31131C0.436882 5.24177 -0.267958 9.07407 0.0844638 12.852C1.81369 14.1467 3.48592 14.9478 5.13116 15.4709C5.53366 14.9237 5.89171 14.3402 6.19976 13.7262C5.61631 13.5061 5.05335 13.2314 4.52188 12.9082C4.66509 12.8054 4.80086 12.6966 4.93663 12.5877C8.19531 14.1225 11.7451 14.1225 14.9652 12.5877C15.1069 12.6966 15.2427 12.8054 15.3798 12.9082C14.8484 13.2375 14.2794 13.5122 13.6959 13.7262C14.0039 14.3402 14.362 14.9297 14.7645 15.4709C16.4097 14.9478 18.0879 14.1467 19.8172 12.852C20.2317 8.46846 19.1137 4.66985 16.9419 1.29643ZM6.67765 10.5426C5.68888 10.5426 4.87683 9.63253 4.87683 8.52256C4.87683 7.41259 5.67141 6.50251 6.67765 6.50251C7.68388 6.50251 8.49594 7.41259 8.47846 8.52256C8.47846 9.63253 7.67641 10.5426 6.67765 10.5426ZM13.2241 10.5426C12.2353 10.5426 11.4232 9.63253 11.4232 8.52256C11.4232 7.41259 12.2178 6.50251 13.2241 6.50251C14.2303 6.50251 15.0424 7.41259 15.0249 8.52256C15.0249 9.63253 14.2303 10.5426 13.2241 10.5426Z"
      fill="currentColor"
    />
  ),
  twitter: (
    <path
      d="M11.438 8.85221L17.0277 2.5H15.7036L10.8481 8.0144L6.97281 2.5H2.50208L8.36348 10.8395L2.50208 17.5H3.82618L8.95047 11.6754L13.0277 17.5H17.4984M3.99241 3.49298H6.33908L15.9999 16.5565H13.652"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  telegram: (
    <path
      d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.93 6.824l-1.675 7.89c-.122.55-.45.684-.91.425l-2.5-1.84-1.207 1.162c-.133.133-.245.245-.502.245l.18-2.546 4.622-4.176c.2-.18-.044-.28-.312-.1L5.4 13.1l-2.46-.768c-.535-.167-.544-.535.112-.79l9.638-3.715c.445-.16.834.108.69.997h-.45z"
      fill="currentColor"
    />
  ),
}

const SOCIAL_LINKS = [
  { label: "Discord",   href: "https://discord.com/invite/fomofamily",               viewBox: "0 0 20 16", icon: SOCIAL_ICON_PATHS.discord  },
  { label: "X (Twitter)", href: "https://x.com/fomo",                               viewBox: "0 0 20 20", icon: SOCIAL_ICON_PATHS.twitter  },
  { label: "Telegram",  href: "https://t.me/fomofamily",                             viewBox: "0 0 20 20", icon: SOCIAL_ICON_PATHS.telegram },
]

const FOOTER_LINKS = {
  About: [
    { label: "Blog",          href: "https://fomo.family/blog"       },
    { label: "FAQ",           href: "https://fomo.family/answers"    },
    { label: "Affiliates",    href: "https://fomo.family/affiliates" },
  ],
  Social: [
    { label: "Discord",  href: "https://discord.com/invite/fomofamily"                                    },
    { label: "X",        href: "https://x.com/fomo"                                                       },
    { label: "YouTube",  href: "https://www.youtube.com/channel/UCQAgxFZYn2GhYKrXG4ypnUg"               },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "https://fomo.family/privacy-policy" },
    { label: "Terms of Service", href: "https://fomo.family/terms"          },
  ],
} as const

export function V2Footer() {
  const rm = useReducedMotion()

  return (
    <footer className="border-t border-white/[0.05] px-5 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between"
        >
          {/* Brand + tagline + social icons */}
          <div className="shrink-0 space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <FomoLogo className="h-5 text-[#CBD0EB]" />
            </Link>
            <p className="max-w-[20ch] text-sm font-medium leading-relaxed text-[#D1D8FF70]">
              where traders become legends.
            </p>

            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#EAEDFF15] bg-[#EAEDFF06] text-[#D1D8FF70] transition-all duration-200 hover:border-[#606AF750] hover:bg-[#606AF718] hover:text-[#9BA4FA]"
                >
                  <svg viewBox={s.viewBox} className="h-[15px] w-[15px]" fill="none">
                    {s.icon}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
              ([section, links]) => (
                <div key={section}>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9BA4FA80]">
                    {section}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#D1D8FF70] transition-colors duration-200 hover:text-[#EAEDFF]"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </motion.div>

        <motion.div
          initial={rm ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEW}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
          className="mt-12 flex items-center justify-between border-t border-white/[0.05] pt-7"
        >
          <p className="text-sm font-medium text-[#D1D8FF50]">
            © {new Date().getFullYear()} fomo.family
          </p>
          <p className="text-xs text-[#D1D8FF35]">Powered by Solana</p>
        </motion.div>
      </div>
    </footer>
  )
}
