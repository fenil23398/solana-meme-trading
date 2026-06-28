export type TokenDetail = {
  address: string
  symbol: string
  name: string
  price: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  marketCap: number
  totalSupply?: number
  holderCount?: number
  icon?: string
}

export type OhlcvCandle = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type TokenHolder = {
  address: string
  amount: number
  percentage: number
}

export type TokenTrade = {
  txHash: string
  side: "buy" | "sell"
  tokenAmount: number
  priceUsd: number
  volumeUsd: number
  trader: string
  time: number
}

export type LivePriceUpdate = {
  type: "price"
  price: number
  priceChange24h: number
  marketCap: number
  volume24h: number
  liquidity: number
  holderCount?: number
}

export type LiveTradeUpdate = {
  type: "trade"
  trade: TokenTrade
}

export type LiveStreamEvent = LivePriceUpdate | LiveTradeUpdate
