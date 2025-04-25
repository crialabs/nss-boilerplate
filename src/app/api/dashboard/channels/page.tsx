import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Settings, Trash2 } from "lucide-react"
import { getChannels, getBots } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default async function ChannelsPage() {
  const [channels, bots] = await Promise.all([getChannels(), getBots()])

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
        <h2 className="text-3xl font-bold tracking-tight">Channels</h2>
        <Link href="/dashboard/channels/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Channel
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{channel.name}</CardTitle>
                  <CardDescription>{channel.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bot:</span>
                  <span className="font-medium">{botMap[channel.bot_id] || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members:</span>
                  <span className="font-medium">{channel.member_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(channel.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <div className="flex gap-1">
                    {channel.welcome_enabled && <Badge variant="outline">Welcome</Badge>}
                    {channel.tracking_enabled && <Badge variant="outline">Tracking</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/dashboard/channels/${channel.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </Link>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </CardFooter>
          </Card>
        ))}

        {channels.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No channels found</h3>
            <p className="mt-2 text-muted-foreground">Add your first channel to get started</p>
            <Link href="/dashboard/channels/create" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Channel
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
