"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createBotAction } from "../actions"

export default function CreateBotPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await createBotAction(formData)

      if (result.success) {
        toast({
          title: "Bot created successfully",
          description: "Your new bot has been created and is ready to use.",
        })
        router.push(`/dashboard/bots/${result.botId}`)
      } else {
        setError(result.error || "Failed to create bot")
        toast({
          title: "Error creating bot",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast({
        title: "Error creating bot",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Bot</h2>
      </div>
      <Card>
        <form action={handleAction}>
          <CardHeader>
            <CardTitle>Bot Information</CardTitle>
            <CardDescription>Enter the details for your new Telegram bot</CardDescription>
            {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input id="name" name="name" placeholder="Marketing Bot" required />
              <p className="text-sm text-muted-foreground">This is the display name for your bot in the dashboard</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Bot Token</Label>
              <Input id="token" name="token" placeholder="123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ" required />
              <p className="text-sm text-muted-foreground">You can get this from BotFather when creating a new bot</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Bot Username</Label>
              <Input id="username" name="username" placeholder="@marketing_tracker_bot" required />
              <p className="text-sm text-muted-foreground">The username of your bot on Telegram</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="A bot for tracking marketing campaigns" />
              <p className="text-sm text-muted-foreground">A brief description of what this bot will be used for</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/bots")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Bot"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
