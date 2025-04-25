import { NextResponse } from "next/server"
import { generateTrackingScript } from "@/lib/tracking-script-generator"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const options = await request.json()

    const result = await generateTrackingScript(params.id, options)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      script: result.script,
      apiKey: result.apiKey,
    })
  } catch (error) {
    console.error(`Error generating tracking script for channel ${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
