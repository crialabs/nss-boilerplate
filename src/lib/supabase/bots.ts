import { getSupabaseServer } from "./server"
import type { Bot } from "./types"

export async function getBots() {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("bots").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bots:", error)
    throw error
  }

  return data as Bot[]
}

export async function getBot(id: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("bots").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching bot ${id}:`, error)
    throw error
  }

  return data as Bot
}

export async function createBot(bot: Omit<Bot, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("bots").insert(bot).select().single()

  if (error) {
    console.error("Error creating bot:", error)
    throw error
  }

  return data as Bot
}

export async function updateBot(id: string, bot: Partial<Bot>) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("bots")
    .update({
      ...bot,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating bot ${id}:`, error)
    throw error
  }

  return data as Bot
}

export async function deleteBot(id: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("bots").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting bot ${id}:`, error)
    throw error
  }

  return true
}
