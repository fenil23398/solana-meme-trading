"use client"

import { useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { queryKeys } from "@/lib/queries/keys"
import { dedupeTrades, tradeId } from "@/lib/trading/trade-id"
import type { LiveStreamEvent } from "@/lib/types/trading"
import type { TokenBundle } from "@/lib/token-cache"

export function useTokenLiveStream() {
  const params = useParams<{ address: string }>()
  const address = params.address
  const queryClient = useQueryClient()
  const [isLive, setIsLive] = useState(false)
  const sourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!address || address.startsWith("fallback-")) return

    function connect() {
      sourceRef.current?.close()

      const source = new EventSource(`/api/trading/token/${address}/live`)
      sourceRef.current = source

      source.onopen = () => setIsLive(true)
      source.onerror = () => setIsLive(false)

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as LiveStreamEvent

          queryClient.setQueryData<TokenBundle>(
            queryKeys.trading.token(address),
            (current) => {
              if (!current) return current

              if (data.type === "price") {
                return {
                  ...current,
                  overview: {
                    ...current.overview,
                    price: data.price,
                    priceChange24h: data.priceChange24h,
                    marketCap: data.marketCap,
                    volume24h: data.volume24h,
                    liquidity: data.liquidity,
                    holderCount: data.holderCount ?? current.overview.holderCount,
                  },
                }
              }

              if (data.type === "trade") {
                const id = tradeId(data.trade)
                if (current.trades.some((trade) => tradeId(trade) === id)) {
                  return current
                }

                return {
                  ...current,
                  trades: dedupeTrades([data.trade, ...current.trades]).slice(0, 50),
                }
              }

              return current
            }
          )

          if (data.type === "price") {
            queryClient.setQueryData(
              queryKeys.trading.trending(),
              (tokens: { address: string; price: number; priceChange24h: number }[] | undefined) => {
                if (!tokens) return tokens
                return tokens.map((token) =>
                  token.address === address
                    ? {
                        ...token,
                        price: data.price,
                        priceChange24h: data.priceChange24h,
                      }
                    : token
                )
              }
            )
          }
        } catch {
          // Ignore malformed events
        }
      }
    }

    function reconnect() {
      if (document.visibilityState !== "visible") return
      connect()
      void queryClient.refetchQueries({
        queryKey: queryKeys.trading.token(address),
        type: "active",
      })
    }

    connect()

    document.addEventListener("visibilitychange", reconnect)
    window.addEventListener("pageshow", reconnect)

    return () => {
      document.removeEventListener("visibilitychange", reconnect)
      window.removeEventListener("pageshow", reconnect)
      sourceRef.current?.close()
      sourceRef.current = null
      setIsLive(false)
    }
  }, [address, queryClient])

  return { isLive }
}
