"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data - in a real app, this would come from the database
const dailyData = [
  { date: "Apr 1", leads: 45, joins: 32, leaves: 5 },
  { date: "Apr 2", leads: 52, joins: 38, leaves: 7 },
  { date: "Apr 3", leads: 48, joins: 35, leaves: 4 },
  { date: "Apr 4", leads: 70, joins: 55, leaves: 8 },
  { date: "Apr 5", leads: 61, joins: 49, leaves: 6 },
  { date: "Apr 6", leads: 65, joins: 52, leaves: 9 },
  { date: "Apr 7", leads: 75, joins: 60, leaves: 11 },
]

const weeklyData = [
  { date: "Week 1", leads: 320, joins: 240, leaves: 35 },
  { date: "Week 2", leads: 350, joins: 270, leaves: 42 },
  { date: "Week 3", leads: 380, joins: 290, leaves: 38 },
  { date: "Week 4", leads: 420, joins: 330, leaves: 45 },
]

const monthlyData = [
  { date: "Jan", leads: 1200, joins: 950, leaves: 150 },
  { date: "Feb", leads: 1350, joins: 1050, leaves: 180 },
  { date: "Mar", leads: 1450, joins: 1150, leaves: 200 },
  { date: "Apr", leads: 1600, joins: 1250, leaves: 220 },
]

const sourceData = [
  { source: "Landing Page", leads: 450, conversion: 75 },
  { source: "Facebook", leads: 380, conversion: 62 },
  { source: "Instagram", leads: 320, conversion: 58 },
  { source: "Google", leads: 280, conversion: 70 },
  { source: "Email", leads: 220, conversion: 85 },
  { source: "Referral", leads: 180, conversion: 90 },
]

export function AnalyticsOverview() {
  const [timeframe, setTimeframe] = useState("daily")

  const data = timeframe === "daily" ? dailyData : timeframe === "weekly" ? weeklyData : monthlyData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
        <CardDescription>Track your leads, joins, and channel activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <div className="flex justify-end">
              <TabsList>
                <TabsTrigger
                  value="daily"
                  onClick={() => setTimeframe("daily")}
                  className={timeframe === "daily" ? "bg-primary text-primary-foreground" : ""}
                >
                  Daily
                </TabsTrigger>
                <TabsTrigger
                  value="weekly"
                  onClick={() => setTimeframe("weekly")}
                  className={timeframe === "weekly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Weekly
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  onClick={() => setTimeframe("monthly")}
                  className={timeframe === "monthly" ? "bg-primary text-primary-foreground" : ""}
                >
                  Monthly
                </TabsTrigger>
              </TabsList>
            </div>

            <ChartContainer
              config={{
                leads: {
                  label: "New Leads",
                  color: "hsl(var(--chart-1))",
                },
                joins: {
                  label: "Channel Joins",
                  color: "hsl(var(--chart-2))",
                },
                leaves: {
                  label: "Channel Leaves",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="leads" fill="var(--color-leads)" name="New Leads" />
                  <Bar dataKey="joins" fill="var(--color-joins)" name="Channel Joins" />
                  <Bar dataKey="leaves" fill="var(--color-leaves)" name="Channel Leaves" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="sources">
            <ChartContainer
              config={{
                leads: {
                  label: "Leads",
                  color: "hsl(var(--chart-1))",
                },
                conversion: {
                  label: "Conversion Rate (%)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="leads" fill="var(--color-leads)" name="Leads" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="conversion"
                    stroke="var(--color-conversion)"
                    name="Conversion Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="conversion">
            <ChartContainer
              config={{
                leads: {
                  label: "New Leads",
                  color: "hsl(var(--chart-1))",
                },
                joins: {
                  label: "Channel Joins",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[350px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="var(--color-leads)" name="New Leads" />
                  <Line type="monotone" dataKey="joins" stroke="var(--color-joins)" name="Channel Joins" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
