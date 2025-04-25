"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Copy, Download } from "lucide-react"

interface ScriptGeneratorProps {
  channelId: string
  channelName: string
  channelUsername: string
  botUsername: string
  defaultInviteLink?: string
}

export function ScriptGenerator({
  channelId,
  channelName,
  channelUsername,
  botUsername,
  defaultInviteLink,
}: ScriptGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [script, setScript] = useState("")
  const [wordpressPlugin, setWordpressPlugin] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [options, setOptions] = useState({
    includePixel: true,
    includeLeadTracking: true,
    includeClickTracking: true,
    pixelId: "",
    redirectDelay: 5,
  })

  const handleGenerateScript = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/channels/${channelId}/tracking/script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()

      if (data.success) {
        setScript(data.script)
        setApiKey(data.apiKey)
        toast({
          title: "Script generated",
          description: "Your tracking script has been generated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate script",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateWordPressPlugin = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/channels/${channelId}/tracking/wordpress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      const data = await response.json()

      if (data.success) {
        setWordpressPlugin(data.plugin)
        setApiKey(data.apiKey)
        toast({
          title: "WordPress plugin generated",
          description: "Your WordPress plugin has been generated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate WordPress plugin",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script)
    toast({
      title: "Copied",
      description: "The tracking script has been copied to your clipboard.",
    })
  }

  const handleCopyWordPressPlugin = () => {
    navigator.clipboard.writeText(wordpressPlugin)
    toast({
      title: "Copied",
      description: "The WordPress plugin has been copied to your clipboard.",
    })
  }

  const handleDownloadScript = () => {
    const blob = new Blob([script], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `teletracker-${channelUsername.replace("@", "")}.js`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadWordPressPlugin = () => {
    const blob = new Blob([wordpressPlugin], { type: "text/php" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `teletracker-${channelUsername.replace("@", "")}.php`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Script Generator</CardTitle>
        <CardDescription>
          Generate tracking scripts for your Telegram channel {channelName} ({channelUsername})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="options">
          <TabsList>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="script" disabled={!script}>
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="wordpress" disabled={!wordpressPlugin}>
              WordPress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="lead-tracking"
                  checked={options.includeLeadTracking}
                  onCheckedChange={(checked) => setOptions({ ...options, includeLeadTracking: checked })}
                />
                <Label htmlFor="lead-tracking">Include Lead Tracking</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="click-tracking"
                  checked={options.includeClickTracking}
                  onCheckedChange={(checked) => setOptions({ ...options, includeClickTracking: checked })}
                />
                <Label htmlFor="click-tracking">Include Click Tracking</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="pixel-tracking"
                  checked={options.includePixel}
                  onCheckedChange={(checked) => setOptions({ ...options, includePixel: checked })}
                />
                <Label htmlFor="pixel-tracking">Include Facebook Pixel</Label>
              </div>

              {options.includePixel && (
                <div className="space-y-2">
                  <Label htmlFor="pixel-id">Facebook Pixel ID</Label>
                  <Input
                    id="pixel-id"
                    value={options.pixelId}
                    onChange={(e) => setOptions({ ...options, pixelId: e.target.value })}
                    placeholder="Enter your Facebook Pixel ID"
                  />
                </div>
              )}

              {options.includeClickTracking && (
                <div className="space-y-2">
                  <Label htmlFor="redirect-delay">Redirect Delay (seconds)</Label>
                  <Input
                    id="redirect-delay"
                    type="number"
                    min="1"
                    max="30"
                    value={options.redirectDelay}
                    onChange={(e) => setOptions({ ...options, redirectDelay: Number.parseInt(e.target.value) || 5 })}
                  />
                </div>
              )}

              <div className="pt-4 flex space-x-2">
                <Button onClick={handleGenerateScript} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate JavaScript"}
                </Button>
                <Button onClick={handleGenerateWordPressPlugin} disabled={isLoading} variant="outline">
                  {isLoading ? "Generating..." : "Generate WordPress Plugin"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="script" className="space-y-4 pt-4">
            {script && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">JavaScript Tracking Script</h3>
                    <p className="text-sm text-muted-foreground">
                      Add this script to your website to track visitors and leads.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyScript}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadScript}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Textarea value={script} readOnly rows={15} className="font-mono text-xs" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    This API key is used to authenticate tracking requests. Keep it secure.
                  </p>
                  <Input value={apiKey} readOnly />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">HTML Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Add this code to your HTML to include the tracking script.
                  </p>
                  <Textarea
                    value={`<script>
${script}
</script>`}
                    readOnly
                    rows={5}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Tracking Button</h3>
                  <p className="text-sm text-muted-foreground">
                    Add this HTML to create a tracking button that redirects to your Telegram channel.
                  </p>
                  <Textarea
                    value={`<a href="#" class="teletracker" data-action="join" data-label="homepage">Join Our Telegram Channel</a>`}
                    readOnly
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="wordpress" className="space-y-4 pt-4">
            {wordpressPlugin && (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">WordPress Plugin</h3>
                    <p className="text-sm text-muted-foreground">
                      Download this plugin and install it on your WordPress site.
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCopyWordPressPlugin}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadWordPressPlugin}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Textarea value={wordpressPlugin} readOnly rows={15} className="font-mono text-xs" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Installation Instructions</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Download the plugin file</li>
                    <li>Log in to your WordPress admin panel</li>
                    <li>Go to Plugins > Add New > Upload Plugin</li>
                    <li>Choose the downloaded file and click "Install Now"</li>
                    <li>Activate the plugin</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Shortcode Usage</h3>
                  <p className="text-sm text-muted-foreground">
                    Use this shortcode to add a tracking button to your pages or posts:
                  </p>
                  <Textarea
                    value={`[teletracker text="Join Our Telegram Channel" action="join" label="homepage"]`}
                    readOnly
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">API Key: {apiKey || "Not generated yet"}</p>
      </CardFooter>
    </Card>
  )
}
