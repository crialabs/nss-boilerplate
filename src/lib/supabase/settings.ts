import { getSupabaseServer } from "./server"
import type { ChannelSetting } from "./types"

export async function getChannelSettings(channelId: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("channel_settings")
    .select("*")
    .eq("channel_id", channelId)
    .order("setting_key", { ascending: true })

  if (error) {
    console.error(`Error fetching settings for channel ${channelId}:`, error)
    throw error
  }

  return data as ChannelSetting[]
}

export async function getChannelSetting(channelId: string, key: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("channel_settings")
    .select("*")
    .eq("channel_id", channelId)
    .eq("setting_key", key)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching setting ${key} for channel ${channelId}:`, error)
    throw error
  }

  return data as ChannelSetting | null
}

export async function setChannelSetting(channelId: string, key: string, value: string) {
  const supabase = getSupabaseServer()

  // Check if setting exists
  const { data: existingSetting } = await supabase
    .from("channel_settings")
    .select("*")
    .eq("channel_id", channelId)
    .eq("setting_key", key)
    .single()

  if (existingSetting) {
    // Update existing setting
    const { data, error } = await supabase
      .from("channel_settings")
      .update({
        setting_value: value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSetting.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating setting ${key} for channel ${channelId}:`, error)
      throw error
    }

    return data as ChannelSetting
  } else {
    // Create new setting
    const { data, error } = await supabase
      .from("channel_settings")
      .insert({
        channel_id: channelId,
        setting_key: key,
        setting_value: value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error(`Error creating setting ${key} for channel ${channelId}:`, error)
      throw error
    }

    return data as ChannelSetting
  }
}

export async function deleteChannelSetting(channelId: string, key: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("channel_settings").delete().eq("channel_id", channelId).eq("setting_key", key)

  if (error) {
    console.error(`Error deleting setting ${key} for channel ${channelId}:`, error)
    throw error
  }

  return true
}
