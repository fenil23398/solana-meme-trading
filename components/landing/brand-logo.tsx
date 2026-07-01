import Image from "next/image"

import { cn } from "@/lib/utils"

const LOGO_SRC = "/images/logo.png"

export function BrandLogo({
  size = "md",
  showName = true,
  className,
}: {
  size?: "sm" | "md" | "lg"
  showName?: boolean
  className?: string
}) {
  const sizes = {
    sm: { image: 32, className: "h-8 w-8 rounded-lg" },
    md: { image: 40, className: "h-10 w-10 rounded-xl" },
    lg: { image: 56, className: "h-14 w-14 rounded-2xl" },
  } as const

  const { image, className: imageClass } = sizes[size]

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={LOGO_SRC}
        alt="fomo.family"
        width={image}
        height={image}
        className={cn("shrink-0", imageClass)}
        priority
      />
      {showName ? (
        <span className="font-heading text-[17px] font-semibold tracking-[-0.02em] text-white sm:text-lg">
          fomo.family
        </span>
      ) : null}
    </div>
  )
}

export function PhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] bg-black",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-3">
        <div className="h-1 w-14 rounded-full bg-white/15" />
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block h-auto w-full"
        poster={LOGO_SRC}
      >
        <source src="/images/chadwallet.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
