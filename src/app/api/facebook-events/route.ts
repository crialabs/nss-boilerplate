import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getLeadByEmail, createEvent } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { event_name, event_data } = await request.json()
    const cookieStore = cookies()

    // Get lead info from cookies
    const leadEmail = cookieStore.get("lead_email")?.value

    if (!leadEmail) {
      return NextResponse.json({ success: false, error: "Lead not found" })
    }

    // Find lead in database
    const lead = await getLeadByEmail(leadEmail)

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found in database" })
    }

    // Track Facebook event
    await createEvent({
      lead_id: lead.id,
      event_type: `fb_${event_name}`,
      event_data,
    })

    // In a real implementation, you would also send the event to Facebook
    // using the Facebook Events API
    console.log(`Sending event ${event_name} to Facebook for lead ${leadEmail}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending Facebook event:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
