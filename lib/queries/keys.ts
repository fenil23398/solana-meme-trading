export const queryKeys = {
  ticker: {
    trending: () => ["ticker", "trending"] as const,
  },
  trading: {
    trending: () => ["trading", "trending"] as const,
    token: (address: string) => ["trading", "token", address] as const,
    chartPair: (address: string) => ["trading", "chart-pair", address] as const,
  },
} as const
