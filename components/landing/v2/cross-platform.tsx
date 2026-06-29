"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

const VIEW = { once: true, amount: 0.2 } as const

export function V2CrossPlatform() {
  const rm = useReducedMotion()

  return (
    <>
      {/* ── Desktop ── */}
      <section className="hidden flex-col items-center gap-3 overflow-hidden px-8 py-10 lg:flex">
        {/* Heading */}
        <motion.h2
          initial={rm ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center font-heading text-[3.75rem] font-bold leading-[0.95] tracking-tight text-white"
        >
          trade from anywhere.
          <br />
          never lose a beat.
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={rm ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="text-center text-[1.375rem] leading-snug tracking-tight text-white/60"
        >
          Open a trade on your phone, close it on your desktop — all in one app.
        </motion.p>

        {/* App screenshots */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="relative -mt-8 w-full max-w-5xl"
        >
          <Image
            src="/images/fomo/fomo-desktop.webp"
            alt="ChadWallet desktop app"
            width={2889}
            height={2783}
            className="w-full"
            loading="lazy"
          />
          <Image
            src="/images/fomo/fomo-desktop-phone.webp"
            alt=""
            width={2825}
            height={3251}
            loading="lazy"
            aria-hidden
            className="absolute -right-[8%] bottom-[12%] w-[28%] animate-[float_4s_ease-in-out_infinite]"
          />
        </motion.div>
      </section>

      {/* ── Mobile ── */}
      <section className="relative flex overflow-hidden text-center lg:hidden">
        <motion.div
          initial={rm ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEW}
          transition={{ duration: 0.7, ease: EASE }}
          className="w-full"
        >
          <Image
            src="/images/fomo/fomo-mobile-app.webp"
            alt="ChadWallet mobile app"
            width={1197}
            height={1164}
            loading="lazy"
            className="w-full"
          />
        </motion.div>

        <motion.div
          initial={rm ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEW}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          className="absolute bottom-0 flex flex-col gap-3 px-8 pb-6"
        >
          <h2 className="font-heading text-[2.25rem] font-bold leading-none tracking-tighter text-white">
            trade from anywhere.
            <br />
            never lose a beat.
          </h2>
          <p className="leading-snug tracking-tight text-white/60">
            Pick up a trade on your phone, close it on your desktop — all in one
            app.
          </p>
        </motion.div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </>
  )
}
