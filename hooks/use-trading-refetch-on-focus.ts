"use client"

import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"

import { queryKeys } from "@/lib/queries/keys"

function refetchInBackground(
  queryClient: ReturnType<typeof useQueryClient>,
  address?: string
) {
  const tasks = [
    queryClient.refetchQueries({
      queryKey: queryKeys.trading.trending(),
      type: "active",
    }),
  ]

  if (address && !address.startsWith("fallback-")) {
    tasks.push(
      queryClient.refetchQueries({
        queryKey: queryKeys.trading.token(address),
        type: "active",
      }),
      queryClient.refetchQueries({
        queryKey: queryKeys.trading.chartPair(address),
        type: "active",
      })
    )
  }

  void Promise.all(tasks)
}

export function useTradingRefetchOnFocus() {
  const queryClient = useQueryClient()
  const params = useParams<{ address: string }>()
  const isRefreshingRef = useRef(false)

  useEffect(() => {
    function onReturn(event: Event) {
      const pageEvent = event as PageTransitionEvent
      if (!pageEvent.persisted) return
      if (document.visibilityState !== "visible" || isRefreshingRef.current) return

      isRefreshingRef.current = true
      refetchInBackground(queryClient, params.address)
      window.setTimeout(() => {
        isRefreshingRef.current = false
      }, 500)
    }

    window.addEventListener("pageshow", onReturn)

    return () => {
      window.removeEventListener("pageshow", onReturn)
    }
  }, [params.address, queryClient])
}
