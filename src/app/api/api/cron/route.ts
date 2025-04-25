import { NextResponse } from "next/server"
import { processScheduledMessages } from "@/lib/scheduled-messages"
import { processWelcomeQueue } from "@/lib/welcome-messages"

export async function GET(request: Request) {
  try {
    // Check for authorization (in a real implementation, you would use a secret key)
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // In a real implementation, you would validate the token
    // For now, we'll just check if it's not empty
    if (!token) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    // Process scheduled messages
    const scheduledResult = await processScheduledMessages()

    // Process welcome queue
    const welcomeResult = await processWelcomeQueue()

    return NextResponse.json({
      success: true,
      scheduled: scheduledResult,
      welcome: welcomeResult,
    })
  } catch (error) {
    console.error("Error processing cron job:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
