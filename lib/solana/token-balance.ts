import { Connection, PublicKey } from "@solana/web3.js"

const DEFAULT_RPC = "https://api.mainnet-beta.solana.com"

function getConnection() {
  const rpcUrl = process.env.SOLANA_RPC_URL ?? DEFAULT_RPC
  return new Connection(rpcUrl, "confirmed")
}

export async function getWalletTokenBalance(
  walletAddress: string,
  tokenMint: string
): Promise<number> {
  const connection = getConnection()
  const owner = new PublicKey(walletAddress)
  const mint = new PublicKey(tokenMint)

  const accounts = await connection.getParsedTokenAccountsByOwner(owner, { mint })

  if (accounts.value.length === 0) return 0

  const amount =
    accounts.value[0]?.account.data.parsed?.info?.tokenAmount?.uiAmount

  return typeof amount === "number" && Number.isFinite(amount) ? amount : 0
}
