import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, MessageSquare, Activity } from "lucide-react"
import { getLead, getEventsByLeadId, getChannel } from "@/lib/supabase"
import { formatDistanceToNow, format } from "date-fns"
import { RealtimeEvents } from "@/components/dashboard/realtime-events"

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  try {
    const lead = await getLead(params.id)
    const events = await getEventsByLeadId(params.id)

    let channel = null
    if (lead.channel_id) {
      channel = await getChannel(lead.channel_id)
    }

    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/leads">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Lead Details</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
              <CardDescription>Details about this lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {lead.first_name} {lead.last_name}
                  </h3>
                  {lead.username && <p className="text-sm text-muted-foreground">@{lead.username}</p>}
                </div>
                <Badge
                  className={
                    lead.status === "active"
                      ? "bg-green-500 ml-auto"
                      : lead.status === "inactive"
                        ? "bg-yellow-500 ml-auto"
                        : "bg-red-500 ml-auto"
                  }
                >
                  {lead.status}
                </Badge>
              </div>

              <div className="space-y-2">
                {lead.email && (
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Email</div>
                    <div className="col-span-2">{lead.email}</div>
                  </div>
                )}
                {lead.telegram_id && (
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Telegram ID</div>
                    <div className="col-span-2">{lead.telegram_id}</div>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Source</div>
                  <div className="col-span-2">{lead.source || "Unknown"}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Created</div>
                  <div className="col-span-2">
                    {format(new Date(lead.created_at), "PPP")}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })})
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="font-medium">Last Active</div>
                  <div className="col-span-2">
                    {format(new Date(lead.last_active), "PPP")}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formatDistanceToNow(new Date(lead.last_active), { addSuffix: true })})
                    </span>
                  </div>
                </div>
                {lead.joined_at && (
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="font-medium">Joined Channel</div>
                    <div className="col-span-2">
                      {format(new Date(lead.joined_at), "PPP")}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({formatDistanceToNow(new Date(lead.joined_at), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Channel Information</CardTitle>
              <CardDescription>Channel this lead is associated with</CardDescription>
            </CardHeader>
            <CardContent>
              {channel ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium">Telegram ID</div>
                      <div className="col-span-2">{channel.telegram_id || "Not set"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium">Member Count</div>
                      <div className="col-span-2">{channel.member_count}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium">Welcome Message</div>
                      <div className="col-span-2">{channel.welcome_enabled ? "Enabled" : "Disabled"}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="font-medium">Tracking</div>
                      <div className="col-span-2">{channel.tracking_enabled ? "Enabled" : "Disabled"}</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link href={`/dashboard/channels/${channel.id}`}>
                      <Button>View Channel Details</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No channel associated</h3>
                  <p className="mt-2 text-muted-foreground">This lead is not associated with any channel</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-7">
            <CardHeader>
              <CardTitle>Lead Activity</CardTitle>
              <CardDescription>Track all events associated with this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline">
                <TabsList>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="timeline" className="pt-4">
                  <RealtimeEvents initialEvents={events} leadId={params.id} />
                </TabsContent>
                <TabsContent value="analytics" className="pt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Activity className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Analytics coming soon</h3>
                    <p className="mt-2 text-muted-foreground">
                      Detailed analytics for this lead will be available soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading lead:", error)
    notFound()
  }
}
