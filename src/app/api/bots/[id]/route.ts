import { NextResponse } from "next/server"
import { getBot } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const bot = await getBot(params.id)
    return NextResponse.json(bot)
  } catch (error) {
    console.error(`Error fetching bot ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch bot" }, { status: 500 })
  }
}
