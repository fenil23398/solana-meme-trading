"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"

import { DownloadButton } from "@/components/landing/v2/download-button"

const EASE = [0.22, 1, 0.36, 1] as const

const STATS = [
  { value: "500K+", label: "traders" },
  { value: "#1", label: "Solana app" },
  { value: "24/7", label: "live trading" },
  { value: "$2B+", label: "volume" },
]

export function V2Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-14 text-center sm:pt-18">
      {/* Decorative twinkling star dots */}
      <div className="pointer-events-none absolute inset-0 -z-[4]" aria-hidden>
        {([
          { x: "14%",  y: "18%", s: 2,   d: 0   },
          { x: "83%",  y: "12%", s: 1.5, d: 0.7 },
          { x: "72%",  y: "32%", s: 2.5, d: 1.1 },
          { x: "23%",  y: "42%", s: 1.5, d: 0.3 },
          { x: "91%",  y: "52%", s: 2,   d: 1.5 },
          { x: "6%",   y: "62%", s: 1,   d: 0.9 },
          { x: "59%",  y: "7%",  s: 2,   d: 0.4 },
          { x: "38%",  y: "72%", s: 1,   d: 1.8 },
          { x: "47%",  y: "16%", s: 1.5, d: 0.6 },
          { x: "78%",  y: "68%", s: 2,   d: 1.3 },
        ] as { x: string; y: string; s: number; d: number }[]).map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: star.s,
              height: star.s,
              animation: `twinkle ${3.5 + i * 0.4}s ease-in-out ${star.d}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col items-center gap-4"
      >
        <h1 className="max-w-2xl text-[2rem] font-bold leading-[1.08] tracking-[-0.04em] text-[#EAEDFF] sm:text-5xl lg:text-[3.75rem]">
          where traders
          <br />
          <span className="bg-gradient-to-r from-[#EAEDFF] via-[#9BA4FA] to-[#606AF7] bg-clip-text text-transparent">
            become legends.
          </span>
        </h1>
        <p className="max-w-sm text-[15px] leading-relaxed text-[#D1D8FF80] sm:max-w-md sm:text-[1.1rem]">
          Hunt every memecoin on Solana. Trade in seconds, climb the leaderboard,
          become a name everyone knows.
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
        className="mt-7 flex gap-2.5 sm:gap-3"
      >
        <div className="lg:hidden">
          <DownloadButton />
        </div>
        <div className="hidden gap-3 lg:flex">
          <Link
            href="/trade"
            className="relative flex h-12 min-w-[11rem] items-center justify-center overflow-hidden rounded-xl text-[15px] font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #606AF7 0%, #8B6CF7 50%, #A56BF7 100%)",
              boxShadow: "0 0 32px 0 #606AF740, 0 4px 16px 0 #606AF730",
            }}
          >
            Start trading
          </Link>
          <DownloadButton />
        </div>
      </motion.div>

      {/* Stats strip — intentionally muted so text stays hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 sm:gap-x-10"
      >
        {STATS.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[1.1rem] font-semibold tracking-tight text-[#D1D8FF55] sm:text-xl">
              {s.value}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#D1D8FF30]">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── Astronaut + flanking social-proof cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="relative mt-2 w-full max-w-5xl"
      >
        {/* Soft glow halo under astronaut */}
        <div
          className="pointer-events-none absolute bottom-[18%] left-1/2 -z-10 h-48 w-[55%] -translate-x-1/2 rounded-full opacity-20 blur-[60px]"
          style={{ background: "radial-gradient(ellipse, #606AF7, #9B6AF7)" }}
          aria-hidden
        />

        {/* Left card — Trending token */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.55, ease: EASE }}
          className="absolute left-1 top-[22%] z-10 hidden animate-[floatCard_5s_ease-in-out_infinite] xl:block"
        >
          <div
            className="rounded-2xl border border-[#606AF728] p-4 backdrop-blur-xl"
            style={{
              background: "rgba(13,11,26,0.82)",
              boxShadow: "0 8px 32px 0 rgba(96,106,247,0.12), 0 1px 0 0 rgba(255,255,255,0.04) inset",
            }}
          >
            <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#606AF7]">
              🔥 Trending now
            </p>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gradient-to-br from-[#FF9900] to-[#FF4500]" />
              <div>
                <p className="text-sm font-bold leading-none text-[#EAEDFF]">$BONK</p>
                <p className="mt-0.5 text-xs font-semibold text-[#4ade80]">+42.1% ↑</p>
              </div>
            </div>
            <p className="mt-2.5 text-[10px] text-[#D1D8FF35]">1,234 traders watching</p>
          </div>
        </motion.div>

        {/* Right card — Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.65, ease: EASE }}
          className="absolute right-1 top-[12%] z-10 hidden animate-[floatCard_6s_ease-in-out_0.8s_infinite] xl:block"
        >
          <div
            className="rounded-2xl border border-[#606AF728] p-4 backdrop-blur-xl"
            style={{
              background: "rgba(13,11,26,0.82)",
              boxShadow: "0 8px 32px 0 rgba(96,106,247,0.12), 0 1px 0 0 rgba(255,255,255,0.04) inset",
            }}
          >
            <p className="mb-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-[#606AF7]">
              👑 Top trader
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#606AF7] to-[#A56BF7] text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-[#EAEDFF]">@degen_alpha</p>
                <p className="mt-0.5 text-xs font-semibold text-[#4ade80]">+$12,450 today</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom-right — Recent trade notification */}
        <motion.div
          initial={{ opacity: 0, x: 20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.85, delay: 0.8, ease: EASE }}
          className="absolute bottom-[28%] right-3 z-10 hidden animate-[floatCard_7s_ease-in-out_1.2s_infinite] xl:block"
        >
          <div
            className="rounded-xl border border-[#606AF728] px-3 py-2.5 backdrop-blur-xl"
            style={{
              background: "rgba(13,11,26,0.82)",
              boxShadow: "0 8px 32px 0 rgba(96,106,247,0.10), 0 1px 0 0 rgba(255,255,255,0.04) inset",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4ade8025] text-[10px]">✅</span>
              <div>
                <p className="text-[11px] font-semibold text-[#EAEDFF]">Bought 1,000 WIF</p>
                <p className="text-[9px] text-[#D1D8FF40]">@whale_master · just now</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Astronaut image */}
        <div className="mx-auto w-full max-w-2xl">
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
        </div>
      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50%       { opacity: 0.65; transform: scale(1.4); }
        }
      `}</style>
    </section>
  )
}
