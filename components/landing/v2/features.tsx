"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const
const VIEW = { once: true, amount: 0.1 } as const

const FEATURES = [
  {
    tag: "LEADERBOARD",
    title: "become a legend, top the leaderboard",
    img: "/images/fomo/leaderboard.webp",
    imgClass: "object-contain object-bottom",
  },
  {
    tag: "FEED",
    title: "discover and follow top traders",
    img: "/images/fomo/social-static.webp",
    imgClass: "object-contain",
  },
  {
    tag: "ALERTS",
    title: "real time notifications for what the best are buying",
    img: "/images/fomo/alerts-static.webp",
    imgClass: "object-cover pb-8",
  },
  {
    tag: "EASY ONBOARDING",
    title: "create an account in an instant",
    img: "/images/fomo/sign-in-static.webp",
    imgClass: "object-contain object-bottom",
  },
  {
    tag: "ZERO COMPLEXITY",
    title: "Solana-native & gasless trading",
    img: "/images/fomo/assets-static.webp",
    imgClass: "object-cover",
  },
  {
    tag: "ONE CLICK TO BUY",
    title: "fund with Apple Pay",
    img: "/images/fomo/apple-pay-static.webp",
    imgClass: "object-contain pb-8",
  },
] as const

const rowVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
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
        <h2 className="font-heading text-[3.75rem] font-bold leading-[1.0] tracking-tighter text-white">
          never miss out again
        </h2>
        <p className="text-[1.75rem] leading-snug text-white/60">
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
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white">
          never miss out again
        </h2>
        <p className="mt-2 text-base text-white/55">
          the only social-first trading app
        </p>
      </motion.div>

      {/* Cards — 2 rows, each row staggered */}
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
  rm,
}: {
  tag: string
  title: string
  img: string
  imgClass: string
  rm: boolean
}) {
  return (
    <motion.div
      variants={rm ? undefined : cardVariants}
      className="group flex aspect-square flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#0e0e0e] pb-0 pt-8 transition-colors duration-300 hover:border-white/[0.14]"
    >
      <p className="px-7 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand lg:px-8 lg:text-[13px]">
        {tag}
      </p>
      <h3 className="mt-2 px-7 font-heading text-[1.4rem] font-bold leading-[1.2] tracking-tight text-white lg:px-8 lg:text-[2.25rem] lg:leading-[1.1]">
        {title}
      </h3>
      <div className="min-h-0 flex-1">
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
