import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Plus, Settings, Trash2 } from "lucide-react"
import { getBots } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"

export default async function BotsPage() {
  const bots = await getBots()

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bots</h2>
        <Link href="/dashboard/bots/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Bot
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <Card key={bot.id}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bot className="h-8 w-8 text-primary" />
                <div>
                  <CardTitle>{bot.name}</CardTitle>
                  <CardDescription>{bot.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-medium ${bot.status === "active" ? "text-green-500" : "text-yellow-500"}`}>
                    {bot.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Token:</span>
                  <span className="font-medium">{bot.token.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {formatDistanceToNow(new Date(bot.created_at), { addSuffix: true })}
                  </span>
                </div>
                {bot.description && (
                  <div className="pt-2">
                    <span className="text-muted-foreground">Description:</span>
                    <p className="font-medium mt-1">{bot.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/dashboard/bots/${bot.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </Link>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}

        {bots.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No bots found</h3>
            <p className="mt-2 text-muted-foreground">Create your first bot to get started</p>
            <Link href="/dashboard/bots/create" className="mt-4 inline-block">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Bot
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
