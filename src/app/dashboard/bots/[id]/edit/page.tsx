"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { updateBotAction } from "../../actions"

interface BotEditPageProps {
  params: { id: string }
}

export default function BotEditPage({ params }: BotEditPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bot, setBot] = useState<any>(null)

  useEffect(() => {
    async function fetchBot() {
      try {
        const response = await fetch(`/api/bots/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch bot")
        }
        const data = await response.json()
        setBot(data)
      } catch (err) {
        console.error("Error fetching bot:", err)
        toast({
          title: "Error",
          description: "Failed to load bot data",
          variant: "destructive",
        })
      }
    }

    fetchBot()
  }, [params.id])

  async function handleAction(formData: FormData) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateBotAction(params.id, formData)

      if (result.success) {
        toast({
          title: "Bot updated successfully",
          description: "Your bot has been updated.",
        })
        router.push(`/dashboard/bots/${params.id}`)
      } else {
        setError(result.error || "Failed to update bot")
        toast({
          title: "Error updating bot",
          description: result.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast({
        title: "Error updating bot",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!bot) {
    return (
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Edit Bot</h2>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="flex justify-center">
              <p>Loading bot data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Bot: {bot.name}</h2>
      </div>
      <Card>
        <form action={handleAction}>
          <CardHeader>
            <CardTitle>Bot Information</CardTitle>
            <CardDescription>Update the details for this Telegram bot</CardDescription>
            {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Bot Name</Label>
              <Input id="name" name="name" defaultValue={bot.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Bot Username</Label>
              <Input id="username" name="username" defaultValue={bot.username} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Bot Token</Label>
              <Input id="token" name="token" defaultValue={bot.token} placeholder="Leave blank to keep current token" />
              <p className="text-sm text-muted-foreground">Only fill this if you want to update the token</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={bot.description || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={bot.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/bots/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
