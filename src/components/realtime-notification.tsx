"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
}

export function RealtimeNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Add a notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 10)) // Keep only the last 10 notifications
    setIsOpen(true)
  }

  // Remove a notification
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Auto-close the notification panel after 5 seconds of inactivity
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, notifications])

  // Listen for custom events
  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent) => {
      addNotification(event.detail)
    }

    window.addEventListener("realtime-notification" as any, handleCustomEvent as EventListener)
    return () => {
      window.removeEventListener("realtime-notification" as any, handleCustomEvent as EventListener)
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-2"
          >
            <Card className="w-80 p-4 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Recent Updates</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-2 rounded-md text-sm ${
                      notification.type === "success"
                        ? "bg-green-100 text-green-800"
                        : notification.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : notification.type === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div>{notification.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12 bg-background shadow-lg relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>
    </div>
  )
}

// Helper function to dispatch notification events
export function showNotification(notification: Omit<Notification, "id" | "timestamp">) {
  const event = new CustomEvent("realtime-notification", {
    detail: notification,
  })
  window.dispatchEvent(event)
}
