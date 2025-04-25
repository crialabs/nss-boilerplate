import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getChannel, getBot } from "@/lib/supabase"
import { ScriptGenerator } from "@/components/tracking/script-generator"

export default async function ChannelTrackingPage({ params }: { params: { id: string } }) {
  try {
    const channel = await getChannel(params.id)

    if (!channel) {
      notFound()
    }

    const bot = await getBot(channel.bot_id)

    if (!bot) {
      notFound()
    }

    const defaultInviteLink = `https://t.me/${channel.username.replace("@", "")}`

    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tracking: {channel.name}</h2>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Configuration</CardTitle>
              <CardDescription>Generate tracking scripts and manage tracking settings for this channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ScriptGenerator
                channelId={channel.id}
                channelName={channel.name}
                channelUsername={channel.username}
                botUsername={bot.username}
                defaultInviteLink={defaultInviteLink}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Error loading channel tracking page for ${params.id}:`, error)
    notFound()
  }
}
