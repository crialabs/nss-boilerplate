import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getLeadCount, getActiveLeadCount, getChannels, getBots, getLeads, getEventCount } from "@/lib/supabase"
import { RealtimeDashboard } from "@/components/dashboard/realtime-dashboard"
import { RecentLeads } from "@/components/dashboard/recent-leads"
import { RealtimeChannelStats } from "@/components/dashboard/realtime-channel-stats"

export default async function DashboardPage() {
  // Fetch data for dashboard
  const [totalLeads, activeLeads, channels, bots, recentLeads, eventCount] = await Promise.all([
    getLeadCount(),
    getActiveLeadCount(),
    getChannels(),
    getBots(),
    getLeads(5),
    getEventCount(),
  ])

  // Create a map of bot IDs to bot names for easier lookup
  const botMap = bots.reduce(
    (acc, bot) => {
      acc[bot.id] = bot.name
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <RealtimeDashboard
        initialLeadCount={totalLeads || 0}
        initialActiveLeadCount={activeLeads || 0}
        initialEventCount={eventCount || 0}
        initialChannelCount={channels.length}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Channel Statistics</CardTitle>
            <CardDescription>Performance metrics for all your channels</CardDescription>
          </CardHeader>
          <CardContent>
            <RealtimeChannelStats initialChannels={channels} botMap={botMap} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>Latest leads that joined your channels</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentLeads leads={recentLeads} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
