"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRealtimeChannels } from "@/hooks/use-realtime"
import { showNotification } from "@/components/realtime-notification"
import type { Channel } from "@/lib/supabase/types"

interface RealtimeChannelStatsProps {
  initialChannels: Channel[]
  botMap: Record<string, string>
}

export function RealtimeChannelStats({ initialChannels, botMap }: RealtimeChannelStatsProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [highlightedChannel, setHighlightedChannel] = useState<string | null>(null)

  // Subscribe to realtime updates
  const { isConnected } = useRealtimeChannels<Channel>((payload) => {
    if (payload.new && payload.new.id) {
      if (!payload.old) {
        // New channel
        setChannels((prevChannels) => [payload.new, ...prevChannels])
        setHighlightedChannel(payload.new.id)
        showNotification({
          title: "New Channel",
          message: `${payload.new.name} has been added`,
          type: "success",
        })
      } else {
        // Updated channel
        setChannels((prevChannels) =>
          prevChannels.map((channel) => (channel.id === payload.new.id ? payload.new : channel)),
        )
        setHighlightedChannel(payload.new.id)

        // Check if member count changed
        if (payload.old.member_count !== payload.new.member_count) {
          const diff = payload.new.member_count - payload.old.member_count
          showNotification({
            title: "Member Count Changed",
            message: `${payload.new.name} ${diff > 0 ? "gained" : "lost"} ${Math.abs(diff)} members`,
            type: diff > 0 ? "success" : "warning",
          })
        } else {
          showNotification({
            title: "Channel Updated",
            message: `${payload.new.name} has been updated`,
            type: "info",
          })
        }
      }

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedChannel(null)
      }, 3000)
    } else if (payload.old && payload.old.id) {
      // Deleted channel
      setChannels((prevChannels) => prevChannels.filter((channel) => channel.id !== payload.old!.id))
      showNotification({
        title: "Channel Deleted",
        message: `${payload.old.name} has been deleted`,
        type: "warning",
      })
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Channel Statistics</h3>
        <Badge variant="outline" className={isConnected ? "bg-green-100" : "bg-yellow-100"}>
          {isConnected ? "Live Updates" : "Connecting..."}
        </Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Bot</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Welcome</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => (
              <TableRow
                key={channel.id}
                className={`transition-colors duration-500 ${highlightedChannel === channel.id ? "bg-primary/10" : ""}`}
              >
                <TableCell className="font-medium">{channel.name}</TableCell>
                <TableCell>{botMap[channel.bot_id] || "Unknown"}</TableCell>
                <TableCell>
                  <span className={highlightedChannel === channel.id ? "font-bold text-primary" : ""}>
                    {channel.member_count}
                  </span>
                </TableCell>
                <TableCell>{channel.welcome_enabled ? "Enabled" : "Disabled"}</TableCell>
                <TableCell>{channel.tracking_enabled ? "Enabled" : "Disabled"}</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Active</Badge>
                </TableCell>
              </TableRow>
            ))}

            {channels.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No channels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
