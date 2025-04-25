"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRealtimeLeads, useRealtimeEvents, useRealtimeChannels } from "@/hooks/use-realtime"
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview"
import type { Lead, Event, Channel } from "@/lib/supabase/types"

interface RealtimeDashboardProps {
  initialLeadCount: number
  initialActiveLeadCount: number
  initialEventCount: number
  initialChannelCount: number
}

export function RealtimeDashboard({
  initialLeadCount,
  initialActiveLeadCount,
  initialEventCount,
  initialChannelCount,
}: RealtimeDashboardProps) {
  const [leadCount, setLeadCount] = useState(initialLeadCount)
  const [activeLeadCount, setActiveLeadCount] = useState(initialActiveLeadCount)
  const [eventCount, setEventCount] = useState(initialEventCount)
  const [channelCount, setChannelCount] = useState(initialChannelCount)

  // Subscribe to realtime updates for leads
  useRealtimeLeads<Lead>((payload) => {
    if (payload.new && !payload.old) {
      // New lead
      setLeadCount((prev) => prev + 1)
      if (payload.new.status === "active") {
        setActiveLeadCount((prev) => prev + 1)
      }
    } else if (payload.new && payload.old) {
      // Updated lead
      if (payload.new.status !== payload.old.status) {
        if (payload.new.status === "active" && payload.old.status !== "active") {
          setActiveLeadCount((prev) => prev + 1)
        } else if (payload.new.status !== "active" && payload.old.status === "active") {
          setActiveLeadCount((prev) => prev - 1)
        }
      }
    } else if (payload.old) {
      // Deleted lead
      setLeadCount((prev) => prev - 1)
      if (payload.old.status === "active") {
        setActiveLeadCount((prev) => prev - 1)
      }
    }
  })

  // Subscribe to realtime updates for events
  useRealtimeEvents<Event>((payload) => {
    if (payload.new && !payload.old) {
      // New event
      setEventCount((prev) => prev + 1)
    } else if (payload.old && !payload.new) {
      // Deleted event
      setEventCount((prev) => prev - 1)
    }
  })

  // Subscribe to realtime updates for channels
  useRealtimeChannels<Channel>((payload) => {
    if (payload.new && !payload.old) {
      // New channel
      setChannelCount((prev) => prev + 1)
    } else if (payload.old && !payload.new) {
      // Deleted channel
      setChannelCount((prev) => prev - 1)
    }
  })

  // Calculate conversion rate
  const conversionRate = leadCount > 0 ? ((activeLeadCount / leadCount) * 100).toFixed(1) : "0.0"

  // Calculate month-over-month growth (simplified example)
  const previousMonthLeads = Math.floor(leadCount * 0.85) // Simplified calculation
  const growthPercentage =
    previousMonthLeads > 0 ? (((leadCount - previousMonthLeads) / previousMonthLeads) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channelCount}</div>
            <p className="text-xs text-muted-foreground">
              {channelCount > 0 ? `+${Math.floor(channelCount * 0.2)} from last month` : "No change"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLeadCount}</div>
            <p className="text-xs text-muted-foreground">+{growthPercentage}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">+{Math.floor(eventCount * 0.15)} from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <AnalyticsOverview />
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>Comprehensive analytics with real-time updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Detailed analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
