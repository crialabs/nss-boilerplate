import { getSupabaseServer } from "./server"
import type { Channel } from "./types"

export async function getChannels() {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("channels").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching channels:", error)
    throw error
  }

  return data as Channel[]
}

export async function getChannelsByBotId(botId: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("bot_id", botId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching channels for bot ${botId}:`, error)
    throw error
  }

  return data as Channel[]
}

export async function getChannel(id: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("channels").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching channel ${id}:`, error)
    throw error
  }

  return data as Channel
}

export async function getChannelByTelegramId(telegramId: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("channels").select("*").eq("telegram_id", telegramId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching channel by Telegram ID ${telegramId}:`, error)
    throw error
  }

  return data as Channel | null
}

export async function createChannel(channel: Omit<Channel, "id" | "created_at" | "updated_at">) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("channels").insert(channel).select().single()

  if (error) {
    console.error("Error creating channel:", error)
    throw error
  }

  return data as Channel
}

export async function updateChannel(id: string, channel: Partial<Channel>) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("channels")
    .update({
      ...channel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating channel ${id}:`, error)
    throw error
  }

  return data as Channel
}

export async function deleteChannel(id: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("channels").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting channel ${id}:`, error)
    throw error
  }

  return true
}

export async function updateMemberCount(id: string, count: number) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("channels")
    .update({
      member_count: count,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating member count for channel ${id}:`, error)
    throw error
  }

  return data as Channel
}
