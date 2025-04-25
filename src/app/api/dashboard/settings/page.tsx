"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings updated",
        description: "Your settings have been updated successfully.",
      })
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dark-mode" defaultChecked />
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="api">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>Manage your API keys and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" defaultValue="sk_live_51JGh..." readOnly className="flex-1" />
                    <Button variant="outline" type="button">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your API key has full access to your account. Keep it secure!
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" defaultValue="https://example.com/webhook" />
                  <p className="text-sm text-muted-foreground">We'll send events to this URL</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="api-enabled" defaultChecked />
                  <Label htmlFor="api-enabled">Enable API Access</Label>
                </div>
              </CardContent>
              <CardFooter>
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
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure global integration settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Facebook</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="fb-enabled" defaultChecked />
                    <Label htmlFor="fb-enabled">Enable Facebook Integration</Label>
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
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-new-lead" defaultChecked />
                    <Label htmlFor="email-new-lead">New lead notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-daily" defaultChecked />
                    <Label htmlFor="email-daily">Daily summary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="email-weekly" defaultChecked />
                    <Label htmlFor="email-weekly">Weekly report</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Telegram Notifications</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="tg-new-lead" defaultChecked />
                    <Label htmlFor="tg-new-lead">New lead notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tg-daily" defaultChecked />
                    <Label htmlFor="tg-daily">Daily summary</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tg-chat-id">Your Telegram Chat ID</Label>
                    <Input id="tg-chat-id" defaultValue="123456789" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
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
