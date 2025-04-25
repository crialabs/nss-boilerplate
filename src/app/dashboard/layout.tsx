import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { RealtimeNotification } from "@/components/realtime-notification"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
        <RealtimeNotification />
      </div>
    </div>
  )
}
