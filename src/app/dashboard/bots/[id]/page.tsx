import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Edit, MessageSquare, BarChart3 } from "lucide-react"
import { getBot, getChannelsByBotId } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { DeleteBotButton } from "@/components/dashboard/delete-bot-button"

export default async function BotDetailPage({ params }: { params: { id: string } }) {
  try {
    const [bot, channels] = await Promise.all([getBot(params.id), getChannelsByBotId(params.id)])

    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{bot.name}</h2>
          <div className="flex space-x-2">
            <Link href={`/dashboard/bots/${params.id}/edit`}>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <DeleteBotButton id={params.id} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bot Information</CardTitle>
              <CardDescription>Details about this Telegram bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Bot className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">{bot.name}</h3>
                  <p className="text-sm text-muted-foreground">{bot.username}</p>
                </div>
                <Badge className={bot.status === "active" ? "bg-green-500 ml-auto" : "bg-yellow-500 ml-auto"}>
                  {bot.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Token</div>
                  <div className="col-span-2 font-mono text-sm">{bot.token.substring(0, 8)}...</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Created</div>
                  <div className="col-span-2">{formatDistanceToNow(new Date(bot.created_at), { addSuffix: true })}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Last Updated</div>
                  <div className="col-span-2">{formatDistanceToNow(new Date(bot.updated_at), { addSuffix: true })}</div>
                </div>
                {bot.description && (
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Description</div>
                    <div className="col-span-2">{bot.description}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connected Channels</CardTitle>
              <CardDescription>Channels using this bot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.length > 0 ? (
                  channels.map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-sm text-muted-foreground">{channel.username}</p>
                        </div>
                      </div>
                      <Link href={`/dashboard/channels/${channel.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No channels connected</h3>
                    <p className="mt-2 text-muted-foreground">Add a channel to start using this bot</p>
                    <Link href="/dashboard/channels/create" className="mt-4">
                      <Button>Add Channel</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bot Analytics</CardTitle>
              <CardDescription>Performance metrics for this bot</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics coming soon</h3>
                <p className="mt-2 text-muted-foreground">Detailed analytics for this bot will be available soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading bot:", error)
    notFound()
  }
}
