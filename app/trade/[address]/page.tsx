// import { TradingWorkspace } from "@/components/trading/trading-workspace"
// import { getQueryClient } from "@/lib/get-query-client"
// import { prefetchTokenQueries } from "@/lib/queries/prefetch-token"

// type TradePageProps = {
//   params: Promise<{ address: string }>
// }

// export default async function TradePage({ params }: TradePageProps) {
//   const { address } = await params

//   // Warm the client cache without blocking navigation between tokens.
//   prefetchTokenQueries(getQueryClient(), address)

//   return <TradingWorkspace />
// }

export default function TradePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8 text-center">
      <p className="text-white/40">Trading coming soon.</p>
    </div>
  )
}
