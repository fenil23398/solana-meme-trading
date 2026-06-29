"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import { DownloadButton } from "@/components/landing/v2/download-button"

const EASE = [0.22, 1, 0.36, 1] as const

export function V2Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-16 text-center sm:pt-20">
      {/* Space background */}
      <Image
        src="/images/fomo/space-bg.webp"
        alt=""
        fill
        priority
        className="-z-10 object-cover object-top"
        aria-hidden
      />

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col items-center gap-3"
      >
        <h1 className="font-heading text-[1.6rem] font-bold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.6rem]">
          where traders become legends.
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-white/60 sm:max-w-md sm:text-lg">
          From memecoins to viral tokens, trade Solana in seconds.
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        className="mt-6 flex gap-2 sm:gap-3"
      >
        {/* Mobile only: just download */}
        <div className="lg:hidden">
          <DownloadButton />
        </div>

        {/* Desktop: start trading + download */}
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

      {/* Astronaut — floating animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="-mt-4 w-full max-w-2xl"
      >
        <picture>
          <source srcSet="/images/fomo/astronaut.webp" media="(min-width: 800px)" />
          <Image
            src="/images/fomo/astronaut-mobile.webp"
            alt=""
            width={1080}
            height={1190}
            priority
            className="h-auto w-full animate-[float_4s_ease-in-out_infinite]"
            aria-hidden
          />
        </picture>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
      `}</style>
    </section>
  )
}
