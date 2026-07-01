export const APP_LINKS = {
  android:
    "https://play.google.com/store/apps/details?id=xyz.chadwallet.www",
  ios: "https://apps.apple.com/us/app/chadwallet/id6757367474",
} as const

export const SOCIAL_LINKS = {
  twitter: "https://x.com/fomo",
  discord: "https://discord.com/invite/fomofamily",
  telegram: "https://t.me/fomofamily",
  youtube: "https://www.youtube.com/channel/UCQAgxFZYn2GhYKrXG4ypnUg",
} as const

export type TickerToken = {
  symbol: string
  change: string
  positive: boolean
  address?: string
  icon?: string
}

export const TICKER_TOKENS: TickerToken[] = [
  { symbol: "JTVO", change: "-12.88%", positive: false },
  { symbol: "ASTEROID", change: "-18.25%", positive: false },
  { symbol: "Jotchua", change: "-28.6%", positive: false },
  { symbol: "KINS", change: "-16.58%", positive: false },
  { symbol: "ZERO", change: "-25.92%", positive: false },
  { symbol: "QUEST", change: "+81.28X", positive: true },
  { symbol: "MrAsteroid", change: "+159.4X", positive: true },
  { symbol: "three", change: "+32.37%", positive: true },
  { symbol: "EITHER", change: "+3.49%", positive: true },
  { symbol: "RO", change: "+33.83X", positive: true },
]

export const WHY_CHADWALLET = [
  {
    title: "Social Trading",
    description: "See what top traders are buying in real time.",
    icon: "users" as const,
  },
  {
    title: "Trade Instantly",
    description: "Buy trending tokens in seconds.",
    icon: "zap" as const,
  },
  {
    title: "Research Smarter",
    description:
      "Built-in trading analytics, detailed profit tracking, buy top tokens when they launch.",
    icon: "chart" as const,
  },
] as const

export const OUTRUN_BOTS = [
  {
    title: "Snipe memecoins at lightning speed",
    description:
      "Execute trades in under a second on every chain. Beat the bots to every launch.",
    icon: "zap" as const,
  },
  {
    title: "Copy the wallets that are printing",
    description:
      "Follow top performers and mirror their moves in real time. Alpha on autopilot.",
    icon: "copy" as const,
  },
  {
    title: "Earn points on every fill",
    description:
      "Get rewarded every time you trade. Stack points and unlock exclusive perks.",
    icon: "coins" as const,
  },
] as const
