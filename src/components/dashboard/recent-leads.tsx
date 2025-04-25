
import type { Lead } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

interface RecentLeadsProps {
  leads: Lead[]
}

export function RecentLeads({ leads }: RecentLeadsProps) {
  return (
    <div className="space-y-8">
      {leads.map((lead) => (
        <div key={lead.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {lead.first_name ? lead.first_name.charAt(0) : ""}
              {lead.last_name ? lead.last_name.charAt(0) : ""}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {lead.first_name} {lead.last_name}
            </p>
            <p className="text-sm text-muted-foreground">
              {lead.channel_id ? "Channel ID: " + lead.channel_id.substring(0, 8) : "No channel"} •
              {lead.joined_at
                ? " joined " + formatDistanceToNow(new Date(lead.joined_at), { addSuffix: true })
                : " created " + formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
            </p>
          </div>
          <div className="ml-auto font-medium">{lead.source || "Unknown"}</div>
        </div>
      ))}

      {leads.length === 0 && <div className="text-center py-4 text-muted-foreground">No leads found</div>}
    </div>
  )
}
