import { NextResponse } from "next/server"

import { fetchTokenTrades } from "@/lib/birdeye"
import { fetchDexScreenerPairAddress } from "@/lib/dexscreener"
import { resolveTokenOverview } from "@/lib/token-market"
import { getCachedToken, mergeCachedToken } from "@/lib/token-cache"
import { tradeId } from "@/lib/trading/trade-id"
import type { LiveStreamEvent } from "@/lib/types/trading"

export const dynamic = "force-dynamic"

const POLL_INTERVAL_MS = 8_000

type RouteContext = {
  params: Promise<{ address: string }>
}

export async function GET(request: Request, context: RouteContext) {
  const { address } = await context.params

  if (!address || address.startsWith("fallback-")) {
    return NextResponse.json({ error: "Invalid token address" }, { status: 400 })
  }

  const encoder = new TextEncoder()
  let closed = false
  let lastTradeId: string | null = null
  let pollCount = 0

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: LiveStreamEvent) => {
        if (closed) return
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      const poll = async () => {
        if (closed) return

        pollCount += 1

        try {
          const cached = getCachedToken(address)
          const overview =
            (await resolveTokenOverview(address, { fresh: true })) ??
            cached?.overview ??
            null

          if (overview) {
            let trades = cached?.trades ?? []

            if (pollCount % 3 === 0) {
              const pairAddress = await fetchDexScreenerPairAddress(address).catch(
                () => null
              )
              const latestTrades = await fetchTokenTrades(address, {
                pairAddress,
                referencePrice: overview.price,
              }).catch(() => trades)
              if (latestTrades.length > 0) trades = latestTrades
            }

            mergeCachedToken(address, {
              overview,
              ohlcv: [],
              holders: cached?.holders ?? [],
              trades,
            })

            send({
              type: "price",
              price: overview.price,
              priceChange24h: overview.priceChange24h,
              marketCap: overview.marketCap,
              volume24h: overview.volume24h,
              liquidity: overview.liquidity,
              holderCount: overview.holderCount,
            })

            const latestTrade = trades[0]
            if (latestTrade) {
              const id = tradeId(latestTrade)
              if (id !== lastTradeId) {
                lastTradeId = id
                send({ type: "trade", trade: latestTrade })
              }
            }
          }
        } catch {
          // Keep stream alive on transient errors
        }
      }

      await poll()
      const interval = setInterval(poll, POLL_INTERVAL_MS)

      request.signal.addEventListener("abort", () => {
        closed = true
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
