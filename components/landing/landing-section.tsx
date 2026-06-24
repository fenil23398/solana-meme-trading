import { cn } from "@/lib/utils"

const VARIANTS = {
  base: "bg-[#080404]",
  elevated: "bg-[#0e0e0e]",
  alt: "bg-[#121212]",
} as const

type LandingSectionProps = {
  id?: string
  variant?: keyof typeof VARIANTS
  bordered?: boolean
  className?: string
  containerClassName?: string
  children: React.ReactNode
}

export function LandingSection({
  id,
  variant = "base",
  bordered = true,
  className,
  containerClassName,
  children,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        VARIANTS[variant],
        bordered && "border-t border-white/[0.06]",
        "py-20 sm:py-24 lg:py-28",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-2 sm:px-6 lg:px-8",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  )
}
