"use client"

import { useCallback, useState } from "react"
import { useLogin, usePrivy } from "@privy-io/react-auth"

const AUTH_SETUP_HINT =
  "Enable Google and Apple under Privy Dashboard → Login methods, and add http://localhost:3000 to Allowed origins."

function formatPrivyLoginError(error: string) {
  switch (error) {
    case "allowlist_rejected":
      return "This account is not on the allowlist."
    case "too_many_requests":
      return "Too many attempts. Please wait and try again."
    case "invalid_origin":
    case "missing_origin":
      return `Sign in failed due to app configuration. ${AUTH_SETUP_HINT}`
    case "oauth_account_suspended":
      return "This account is suspended."
    case "disallowed_login_method":
      return "This sign-in method is not enabled."
    default:
      return error ? `Sign in failed (${error.replaceAll("_", " ")})` : "Sign in failed"
  }
}

export function useAuthLogin() {
  const { ready, authenticated, user, logout } = usePrivy()
  const [authError, setAuthError] = useState<string | null>(null)

  const { login } = useLogin({
    onError: (error) => {
      const message = formatPrivyLoginError(String(error))
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
