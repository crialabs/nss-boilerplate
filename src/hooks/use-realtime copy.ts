"use client"

import { useEffect, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { getSupabaseClient } from "@/lib/supabase"

type SubscriptionCallback<T> = (payload: { new: T; old: T | null }) => void

export function useRealtimeSubscription<T>(
  table: string,
  event: "INSERT" | "UPDATE" | "DELETE" | "*" = "*",
  callback?: SubscriptionCallback<T>,
  filter?: { column: string; value: string },
) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [lastEvent, setLastEvent] = useState<{ new: T; old: T | null } | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Create a unique channel name
    const channelName = filter ? `${table}:${filter.column}:${filter.value}:${event}` : `${table}:${event}`

    // Create the subscription
    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: event,
          schema: "public",
          table: table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
        },
        (payload) => {
          setLastEvent(payload as { new: T; old: T | null })
          if (callback) {
            callback(payload as { new: T; old: T | null })
          }
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    setChannel(subscription)

    // Cleanup function
    return () => {
      subscription.unsubscribe()
    }
  }, [table, event, callback, filter])

  return { channel, lastEvent, isConnected }
}

// Specialized hooks for common tables
export function useRealtimeLeads<T>(callback?: SubscriptionCallback<T>, filter?: { column: string; value: string }) {
  return useRealtimeSubscription<T>("leads", "*", callback, filter)
}

export function useRealtimeEvents<T>(callback?: SubscriptionCallback<T>, filter?: { column: string; value: string }) {
  return useRealtimeSubscription<T>("events", "*", callback, filter)
}

export function useRealtimeChannels<T>(callback?: SubscriptionCallback<T>, filter?: { column: string; value: string }) {
  return useRealtimeSubscription<T>("channels", "*", callback, filter)
}

export function useRealtimeBots<T>(callback?: SubscriptionCallback<T>, filter?: { column: string; value: string }) {
  return useRealtimeSubscription<T>("bots", "*", callback, filter)
}
