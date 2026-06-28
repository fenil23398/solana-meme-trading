"use client"

import { PrivyProvider } from "@privy-io/react-auth"

import { QueryProvider } from "@/components/providers/query-provider"

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {appId ? (
        <PrivyProvider
          appId={appId}
          config={{
            loginMethods: ["google", "apple"],
            appearance: {
              theme: "dark",
              accentColor: "#ccff00",
              logo: "/images/logo.png",
            },
            embeddedWallets: {
              solana: {
                createOnLogin: "users-without-wallets",
              },
            },
          }}
        >
          {children}
        </PrivyProvider>
      ) : (
        children
      )}
    </QueryProvider>
  )
}
