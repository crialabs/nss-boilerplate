import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { getLeads, getChannels } from "@/lib/supabase"
import { RealtimeLeadsTable } from "@/components/dashboard/realtime-leads-table"

export default async function LeadsPage() {
  const [leads, channels] = await Promise.all([getLeads(100), getChannels()])

  // Create a map of channel IDs to channel names for easier lookup
  const channelMap = channels.reduce(
    (acc, channel) => {
      acc[channel.id] = channel.name
      return acc
    },
    {} as Record<string, string>,
  )

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
          <CardDescription>View and manage leads tracked across your channels</CardDescription>
        </CardHeader>
        <CardContent>
          <RealtimeLeadsTable initialLeads={leads} channelMap={channelMap} />
        </CardContent>
      </Card>
    </div>
  )
}
