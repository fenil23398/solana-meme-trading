"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { tokenBundleQueryOptions } from "@/lib/queries/token.client"

export function useTokenBundle() {
  const params = useParams<{ address: string }>()
  const address = params.address

  return useQuery(tokenBundleQueryOptions(address))
}
