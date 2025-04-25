import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Channel } from "@/lib/supabase"

interface ChannelStatsProps {
  channels: Channel[]
}

export function ChannelStats({ channels }: ChannelStatsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Channel</TableHead>
          <TableHead>Bot ID</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Welcome</TableHead>
          <TableHead>Tracking</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {channels.map((channel) => (
          <TableRow key={channel.id}>
            <TableCell className="font-medium">{channel.name}</TableCell>
            <TableCell>{channel.bot_id.substring(0, 8)}</TableCell>
            <TableCell>{channel.member_count}</TableCell>
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
  )
}
