"use client"

import { useCallback, useState } from "react"
import { useLogin, usePrivy } from "@privy-io/react-auth"

const AUTH_SETUP_HINT =
  "Enable Google and Apple under Privy Dashboard → Login methods, and add http://localhost:3000 to Allowed origins."

export function useAuthLogin() {
  const { ready, authenticated, user, logout } = usePrivy()
  const [authError, setAuthError] = useState<string | null>(null)

  const { login } = useLogin({
    onError: (error) => {
      const message = error?.message ?? "Sign in failed"
      setAuthError(message)
      console.error("[Privy auth]", message, error)
    },
    onComplete: () => {
      setAuthError(null)
    },
  })

  const signIn = useCallback(() => {
    setAuthError(null)

    if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
      setAuthError(`Privy is not configured. Add NEXT_PUBLIC_PRIVY_APP_ID to .env.local. ${AUTH_SETUP_HINT}`)
      return
    }

    login()
  }, [login])

  return {
    ready,
    authenticated,
    user,
    logout,
    signIn,
    authError,
    clearAuthError: () => setAuthError(null),
    authSetupHint: AUTH_SETUP_HINT,
  }
}
