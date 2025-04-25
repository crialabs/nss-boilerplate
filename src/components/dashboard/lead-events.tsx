import { format } from "date-fns"
import { LogIn, LogOut, MousePointer, Eye, ShoppingCart, Activity } from "lucide-react"
import type { Event } from "@/lib/supabase/types"

interface LeadEventsProps {
  events: Event[]
}

export function LeadEvents({ events }: LeadEventsProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Activity className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No events found</h3>
        <p className="mt-2 text-muted-foreground">This lead has no recorded events</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {events.map((event) => (
        <div key={event.id} className="relative pl-8 pb-8 border-l-2 border-muted last:border-0">
          <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary" />
          <div className="flex items-start">
            <div className="mr-4 mt-1">{getEventIcon(event.event_type)}</div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{getEventTitle(event.event_type)}</p>
                <time className="text-xs text-muted-foreground">{format(new Date(event.created_at), "PPp")}</time>
              </div>
              <p className="text-sm text-muted-foreground">{getEventDescription(event)}</p>
              {event.event_data && Object.keys(event.event_data).length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <pre className="text-xs overflow-auto">{JSON.stringify(event.event_data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case "channel_join":
      return <LogIn className="h-5 w-5 text-green-500" />
    case "channel_leave":
      return <LogOut className="h-5 w-5 text-red-500" />
    case "page_view":
      return <Eye className="h-5 w-5 text-blue-500" />
    case "button_click":
      return <MousePointer className="h-5 w-5 text-yellow-500" />
    case "purchase":
      return <ShoppingCart className="h-5 w-5 text-purple-500" />
    default:
      if (eventType.startsWith("fb_")) {
        return <Activity className="h-5 w-5 text-orange-500" />
      }
      return <Activity className="h-5 w-5 text-gray-500" />
  }
}

function getEventTitle(eventType: string) {
  switch (eventType) {
    case "channel_join":
      return "Joined Channel"
    case "channel_leave":
      return "Left Channel"
    case "page_view":
      return "Page View"
    case "button_click":
      return "Button Click"
    case "purchase":
      return "Purchase"
    default:
      if (eventType.startsWith("fb_")) {
        return `Facebook Event: ${eventType.substring(3)}`
      }
      return eventType
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  }
}

function getEventDescription(event: Event) {
  const { event_type, event_data } = event

  switch (event_type) {
    case "channel_join":
      return `Joined the ${event_data?.channel_name || "channel"}`
    case "channel_leave":
      return `Left the ${event_data?.channel_name || "channel"}`
    case "page_view":
      return `Viewed ${event_data?.page || "a page"}${event_data?.referrer ? ` from ${event_data.referrer}` : ""}`
    case "button_click":
      return `Clicked ${event_data?.button || "a button"} on ${event_data?.page || "a page"}`
    case "purchase":
      return `Made a purchase of ${event_data?.amount ? `$${event_data.amount}` : "an item"}`
    default:
      if (event_data?.description) {
        return event_data.description
      }
      return "Event recorded"
  }
}
