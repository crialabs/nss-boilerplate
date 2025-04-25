import { NextResponse } from "next/server"
import { getChannel, getBot, createEvent } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { api_key, channel_id, lead_id } = await request.json()

    if (!api_key || !channel_id) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 })
    }

    // Validate API key (in a real implementation, you would check this against the database)
    // For now, we'll just check if it contains the channel_id
    if (!api_key.includes(channel_id.substring(0, 8))) {
      return NextResponse.json({ success: false, error: "Invalid API key" }, { status: 401 })
    }

    // Get channel info
    const channel = await getChannel(channel_id)

    if (!channel) {
      return NextResponse.json({ success: false, error: "Channel not found" }, { status: 404 })
    }

    // Get bot info
    const bot = await getBot(channel.bot_id)

    if (!bot) {
      return NextResponse.json({ success: false, error: "Bot not found" }, { status: 404 })
    }

    // Generate invite link (in a real implementation, you would use the Telegram API)
    // For now, we'll just use the channel username
    const inviteLink = `https://t.me/${channel.username.replace("@", "")}`

    // Track event
    if (lead_id) {
      await createEvent({
        lead_id,
        event_type: "invite_link_generated",
        event_data: {
          channel_id,
          invite_link: inviteLink,
        },
      })
    }

    return NextResponse.json({
      success: true,
      invite_link: inviteLink,
    })
  } catch (error) {
    console.error("Error generating invite link:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
