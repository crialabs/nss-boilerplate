"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function EditChannelPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Channel updated successfully",
        description: "Your channel configuration has been updated.",
      })
      router.push("/dashboard/channels")
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Channel: Marketing Channel</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="welcome">Welcome Message</TabsTrigger>
          <TabsTrigger value="tracking">Lead Tracking</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger asChild>
            <Link href={`/dashboard/channels/${params.id}/edit/tracking`}>Script Generator</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Channel Information</CardTitle>
                <CardDescription>Update the basic information for this channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Channel Name</Label>
                  <Input id="name" defaultValue="Marketing Channel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Channel Username</Label>
                  <Input id="username" defaultValue="@marketing_channel" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bot">Associated Bot</Label>
                  <Input id="bot" defaultValue="Marketing Bot" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Main marketing channel for product announcements and promotions"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard/channels")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="welcome">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Welcome Message</CardTitle>
                <CardDescription>Configure the welcome message for new members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="welcome-enabled" defaultChecked />
                  <Label htmlFor="welcome-enabled">Enable welcome message</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    rows={6}
                    defaultValue="👋 Welcome to our Marketing Channel! Here you'll find the latest updates on our products and promotions. Feel free to ask any questions!"
                  />
                  <p className="text-sm text-muted-foreground">
                    You can use markdown formatting and include variables like {"{name}"} for personalization
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="welcome-delay">Delay (seconds)</Label>
                  <Input id="welcome-delay" type="number" defaultValue="5" min="0" max="300" />
                  <p className="text-sm text-muted-foreground">How long to wait before sending the welcome message</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard/channels")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="tracking">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Lead Tracking</CardTitle>
                <CardDescription>Configure lead tracking settings for this channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="tracking-enabled" defaultChecked />
                  <Label htmlFor="tracking-enabled">Enable lead tracking</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking-source">Default Source</Label>
                  <Input id="tracking-source" defaultValue="website" />
                  <p className="text-sm text-muted-foreground">
                    The default source to use when not specified in the tracking link
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking-params">Tracking Parameters</Label>
                  <Input id="tracking-params" defaultValue="utm_source,utm_medium,utm_campaign" />
                  <p className="text-sm text-muted-foreground">Comma-separated list of URL parameters to track</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tracking-pixel">Facebook Pixel ID</Label>
                  <Input id="tracking-pixel" defaultValue="123456789012345" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard/channels")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Configure third-party integrations for this channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Facebook Events API</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="fb-events-enabled" defaultChecked />
                    <Label htmlFor="fb-events-enabled">Enable Facebook Events API</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fb-app-id">Facebook App ID</Label>
                    <Input id="fb-app-id" defaultValue="123456789012345" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fb-app-secret">Facebook App Secret</Label>
                    <Input id="fb-app-secret" type="password" defaultValue="••••••••••••••••" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Google Tag Manager</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="gtm-enabled" defaultChecked />
                    <Label htmlFor="gtm-enabled">Enable Google Tag Manager</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gtm-id">GTM Container ID</Label>
                    <Input id="gtm-id" defaultValue="GTM-XXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gtm-server">GTM Server URL</Label>
                    <Input id="gtm-server" defaultValue="https://gtm.example.com" />
                    <p className="text-sm text-muted-foreground">
                      Optional: URL to your GTM server for server-side tracking
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard/channels")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
