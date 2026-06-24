import Image from "next/image"
import Link from "next/link"

import { APP_LINKS } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function AppStoreButtons({
  className,
  size = "default",
}: {
  className?: string
  size?: "default" | "large"
}) {
  const imageClass =
    size === "large" ? "h-12 w-auto sm:h-[52px]" : "h-11 w-auto sm:h-11"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-start",
        className
      )}
    >
      <Link
        href={APP_LINKS.ios}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/app-store.png"
          alt="Download on the App Store"
          width={162}
          height={44}
          className={imageClass}
        />
      </Link>
      <Link
        href={APP_LINKS.android}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        <Image
          src="/images/google-play.png"
          alt="Get it on Google Play"
          width={180}
          height={44}
          className={imageClass}
        />
      </Link>
    </div>
  )
}
