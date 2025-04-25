import { NextResponse } from "next/server"
import { generateWordPressPlugin } from "@/lib/tracking-script-generator"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const options = await request.json()

    const result = await generateWordPressPlugin(params.id, options)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      plugin: result.plugin,
      apiKey: result.apiKey,
    })
  } catch (error) {
    console.error(`Error generating WordPress plugin for channel ${params.id}:`, error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
