import { NextResponse } from "next/server"

import { getWalletTokenBalance } from "@/lib/solana/token-balance"

export async function GET(
  _request: Request,
  context: { params: Promise<{ wallet: string; mint: string }> }
) {
  const { wallet, mint } = await context.params

  try {
    const balance = await getWalletTokenBalance(wallet, mint)
    return NextResponse.json({ balance })
  } catch {
    return NextResponse.json({ balance: 0 })
  }
}
