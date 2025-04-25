import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getLeadByEmail, createLead, createEvent, getChannel } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { event, lead_id, channel_id, api_key, url, referrer, user_agent, timestamp, data: eventData } = data

    if (!event || !channel_id || !api_key) {
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

    if (!channel.tracking_enabled) {
      return NextResponse.json({ success: false, error: "Tracking is not enabled for this channel" }, { status: 403 })
    }

    // Get cookies
    const cookieStore = cookies()
    const leadEmail = cookieStore.get("lead_email")?.value
    const leadSource = cookieStore.get("lead_source")?.value || referrer || "unknown"

    // Determine lead ID
    let finalLeadId = lead_id

    // If we have an email in cookies but no lead_id, try to find the lead
    if (leadEmail && !finalLeadId) {
      const lead = await getLeadByEmail(leadEmail)

      if (lead) {
        finalLeadId = lead.id
      } else {
        // Create new lead
        const newLead = await createLead({
          email: leadEmail,
          source: leadSource,
          status: "active",
          channel_id,
        })

        finalLeadId = newLead.id
      }
    }

    // If we still don't have a lead ID, use a temporary one
    if (!finalLeadId) {
      finalLeadId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }

    // Track event
    await createEvent({
      lead_id: finalLeadId,
      event_type: event,
      event_data: {
        ...eventData,
        url,
        referrer,
        user_agent,
        timestamp,
        channel_id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking event:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
