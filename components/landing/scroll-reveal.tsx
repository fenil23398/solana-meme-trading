"use client"

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

type ScrollRevealProps = HTMLMotionProps<"div"> & {
  delay?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "-60px 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

export function ScrollStagger({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: "-40px 0px" }}
      variants={reduceMotion ? undefined : staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScrollStaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={reduceMotion ? undefined : staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

type HeroRevealProps = HTMLMotionProps<"div"> & {
  delay?: number
  direction?: "up" | "left" | "right"
}

export function HeroReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  ...props
}: HeroRevealProps) {
  const reduceMotion = useReducedMotion()

  const offset = {
    up: { x: 0, y: 32 },
    left: { x: -32, y: 0 },
    right: { x: 32, y: 0 },
  }[direction]

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, ...offset }}
      animate={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
