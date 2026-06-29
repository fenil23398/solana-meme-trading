"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "motion/react"

import { DownloadButton } from "@/components/landing/v2/download-button"

const EASE = [0.22, 1, 0.36, 1] as const
const VIEW = { once: true, amount: 0.25 } as const

export function V2Cta() {
  const rm = useReducedMotion()

  return (
    <section className="relative flex items-center justify-center py-40 lg:py-0">
      {/* Background */}
      <Image
        src="/images/fomo/legends.webp"
        alt=""
        fill
        loading="lazy"
        className="object-cover"
        aria-hidden
      />

      {/* Fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080404] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#080404] to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-[80vw] px-8">
        <div className="relative flex aspect-square flex-col items-center justify-center">

          {/* Text + CTAs */}
          <div className="relative z-10 flex w-[70vw] max-w-2xl flex-col items-center gap-4 text-center lg:gap-6">
            <motion.h2
              initial={rm ? false : { opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.75, ease: EASE }}
              className="font-heading text-[2.5rem] font-bold leading-[1.0] tracking-tighter text-white lg:text-[3.75rem]"
            >
              a trading app
              <br />
              for the rest of us
            </motion.h2>

            <motion.p
              initial={rm ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="text-sm leading-snug tracking-tight text-white/60 lg:text-[1.375rem]"
            >
              join 500,000 traders making their name on ChadWallet
            </motion.p>

            <motion.div
              initial={rm ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.55, delay: 0.22, ease: EASE }}
              className="pt-3"
            >
              {/* Mobile */}
              <div className="flex gap-2 lg:hidden">
                <DownloadButton />
              </div>

              {/* Desktop */}
              <div className="hidden gap-3 lg:flex">
                <Link
                  href="/trade"
                  className="flex h-12 min-w-[11rem] items-center justify-center rounded-xl border border-white/[0.15] bg-[#606AF7]/50 text-[15px] font-bold text-white backdrop-blur-md transition-colors hover:bg-[#606AF7]/80"
                >
                  Start trading
                </Link>
                <DownloadButton />
              </div>
            </motion.div>
          </div>

          {/* Spinning circles */}
          <Image
            src="/images/fomo/inner-circle.webp"
            alt=""
            width={600}
            height={600}
            loading="lazy"
            aria-hidden
            className="absolute inset-0 z-[1] m-auto w-[35vw] animate-[ctaSpin_30s_linear_infinite_reverse] lg:w-[30vw]"
          />
          <Image
            src="/images/fomo/outer-circle.webp"
            alt=""
            width={1200}
            height={1200}
            loading="lazy"
            aria-hidden
            className="absolute inset-0 z-[1] m-auto w-screen max-w-[68rem] animate-[ctaSpin_45s_linear_infinite] lg:w-[55vw]"
          />
        </div>
      </div>

      <style>{`
        @keyframes ctaSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
