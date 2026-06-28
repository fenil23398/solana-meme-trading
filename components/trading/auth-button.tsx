"use client"

import { buttonVariants } from "@/components/ui/button"
import { useAuthLogin } from "@/hooks/use-auth-login"
import { cn } from "@/lib/utils"

export function AuthButton({ className }: { className?: string }) {
  const { ready, authenticated, user, logout, signIn, authError } = useAuthLogin()

  if (!ready) {
    return (
      <div
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "pointer-events-none border-white/10 text-white/40",
          className
        )}
      >
        Loading…
      </div>
    )
  }

  if (authenticated) {
    const label =
      user?.email?.address ??
      user?.google?.email ??
      user?.apple?.email ??
      "Connected"

    return (
      <button
        type="button"
        onClick={logout}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "max-w-[180px] truncate border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]",
          className
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <div className={cn("flex flex-col items-end gap-2", className)}>
      <button
        type="button"
        onClick={signIn}
        className={cn(
          buttonVariants({ size: "sm" }),
          "bg-brand font-semibold text-black hover:bg-brand/90"
        )}
      >
        Sign in
      </button>
      {authError ? (
        <p className="max-w-[220px] text-right text-[11px] leading-relaxed text-red-400">
          {authError}
        </p>
      ) : null}
    </div>
  )
}
