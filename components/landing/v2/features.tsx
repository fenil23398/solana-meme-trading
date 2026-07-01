"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const
const VIEW = { once: true, amount: 0.12 } as const

const FEATURES = [
  {
    tag: "LEADERBOARD",
    title: "become a legend, top the leaderboard",
    img: "/images/fomo/leaderboard.webp",
    imgClass: "object-contain object-bottom",
    glow: "#606AF7",
  },
  {
    tag: "FEED",
    title: "discover and follow top traders",
    img: "/images/fomo/social-static.webp",
    imgClass: "object-contain",
    glow: "#8B6CF7",
  },
  {
    tag: "ALERTS",
    title: "real time notifications for what the best are buying",
    img: "/images/fomo/alerts-static.webp",
    imgClass: "object-cover pb-8",
    glow: "#606AF7",
  },
  {
    tag: "EASY ONBOARDING",
    title: "create an account in an instant",
    img: "/images/fomo/sign-in-static.webp",
    imgClass: "object-contain object-bottom",
    glow: "#9B6AF7",
  },
  {
    tag: "ZERO COMPLEXITY",
    title: "Solana-native & gasless trading",
    img: "/images/fomo/assets-static.webp",
    imgClass: "object-cover",
    glow: "#606AF7",
  },
  {
    tag: "ONE CLICK TO BUY",
    title: "fund with Apple Pay",
    img: "/images/fomo/apple-pay-static.webp",
    imgClass: "object-contain pb-8",
    glow: "#7B6AF7",
  },
] as const

const cardVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const rowVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.02 },
  },
}

export function V2Features() {
  const rm = useReducedMotion()

  return (
    <section className="px-3 py-8 lg:px-20 lg:py-2">
      {/* Section header — desktop */}
      <motion.div
        initial={rm ? false : { opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.65, ease: EASE }}
        className="mb-6 hidden flex-col gap-3 lg:flex"
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#606AF7]">
          Features
        </p>
        <h2 className="text-[3.75rem] font-bold leading-[1.0] tracking-[-0.04em] text-[#EAEDFF]">
          never miss out again
        </h2>
        <p className="text-[1.75rem] font-medium leading-snug tracking-tight text-[#D1D8FF50]">
          the only social-first trading app
        </p>
      </motion.div>

      {/* Section header — mobile */}
      <motion.div
        initial={rm ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-6 lg:hidden"
      >
        <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#606AF7]">
          Features
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-[#EAEDFF]">
          never miss out again
        </h2>
        <p className="mt-2 text-base font-medium text-[#D1D8FF55]">
          the only social-first trading app
        </p>
      </motion.div>

      {/* Cards — 2 rows, each row staggered with directional entrance */}
      <div className="flex flex-col gap-3 lg:gap-6">
        {[FEATURES.slice(0, 3), FEATURES.slice(3)].map((row, rowIdx) => (
          <motion.div
            key={rowIdx}
            variants={rm ? undefined : rowVariants}
            initial="hidden"
            whileInView="show"
            viewport={VIEW}
            className="flex flex-col gap-3 lg:flex-row lg:gap-6"
          >
            {row.map((f) => (
              <FeatureCard key={f.tag} rm={!!rm} {...f} />
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FeatureCard({
  tag,
  title,
  img,
  imgClass,
  glow,
  rm,
}: {
  tag: string
  title: string
  img: string
  imgClass: string
  glow: string
  rm: boolean
}) {
  return (
    <motion.div
      variants={rm ? undefined : cardVariants}
      className="group relative flex aspect-square flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[#0d0b1a] pb-0 pt-8 transition-all duration-300 hover:border-[#606AF730]"
      style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset" }}
    >
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -top-12 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
        aria-hidden
      />

      <p className="relative px-7 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#606AF7] lg:px-8 lg:text-[12px]">
        {tag}
      </p>
      <h3 className="relative mt-2 px-7 text-[1.4rem] font-bold leading-[1.2] tracking-tight text-[#EAEDFF] lg:px-8 lg:text-[2.1rem] lg:leading-[1.12]">
        {title}
      </h3>
      <div className="relative min-h-0 flex-1">
        <Image
          src={img}
          alt=""
          width={600}
          height={600}
          loading="lazy"
          aria-hidden
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${imgClass}`}
        />
      </div>
    </motion.div>
  )
}
