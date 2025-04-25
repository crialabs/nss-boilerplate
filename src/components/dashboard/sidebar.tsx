"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, LayoutDashboard, MessageSquare, Settings, Users, LogOut } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6" />
            <span>TeleTracker</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2">
          <div className="flex flex-col gap-1 py-2">
            <Link href="/dashboard" passHref>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === "/dashboard" && "bg-muted")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/bots" passHref>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.startsWith("/dashboard/bots") && "bg-muted")}
              >
                <Bot className="mr-2 h-4 w-4" />
                Bots
              </Button>
            </Link>
            <Link href="/dashboard/channels" passHref>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.startsWith("/dashboard/channels") && "bg-muted")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Channels
              </Button>
            </Link>
            <Link href="/dashboard/leads" passHref>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.startsWith("/dashboard/leads") && "bg-muted")}
              >
                <Users className="mr-2 h-4 w-4" />
                Leads
              </Button>
            </Link>
            <Link href="/dashboard/settings" passHref>
              <Button
                variant="ghost"
                className={cn("w-full justify-start", pathname?.startsWith("/dashboard/settings") && "bg-muted")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </ScrollArea>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
