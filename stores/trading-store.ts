import { create } from "zustand"

type TradingUiState = {
  tradeSide: "buy" | "sell"
  tradeAmount: string
  setTradeSide: (side: "buy" | "sell") => void
  setTradeAmount: (amount: string) => void
}

export const useTradingStore = create<TradingUiState>((set) => ({
  tradeSide: "buy",
  tradeAmount: "",
  setTradeSide: (side) => set({ tradeSide: side }),
  setTradeAmount: (amount) => set({ tradeAmount: amount }),
}))
