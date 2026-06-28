"use client"

import { useMemo } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useQuery } from "@tanstack/react-query"

function getSolanaWalletAddress(
  linkedAccounts: { type: string; chainType?: string; address?: string }[]
) {
  for (const account of linkedAccounts) {
    if (account.type === "wallet" && account.chainType === "solana" && account.address) {
      return account.address
    }
  }

  return undefined
}

async function fetchWalletTokenBalance(wallet: string, mint: string) {
  const response = await fetch(`/api/trading/wallet/${wallet}/balance/${mint}`)

  if (!response.ok) {
    throw new Error("Failed to fetch wallet balance")
  }

  const data = (await response.json()) as { balance: number }
  return data.balance
}

export function useWalletTokenBalance(tokenMint: string | undefined) {
  const { authenticated, user } = usePrivy()

  const walletAddress = useMemo(
    () => getSolanaWalletAddress(user?.linkedAccounts ?? []),
    [user?.linkedAccounts]
  )

  const query = useQuery({
    queryKey: ["wallet-token-balance", walletAddress, tokenMint],
    queryFn: () => fetchWalletTokenBalance(walletAddress!, tokenMint!),
    enabled: authenticated && Boolean(walletAddress && tokenMint),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  })

  return {
    walletAddress,
    balance: query.data ?? 0,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
  }
}
