import { getSupabaseServer } from "./server"
import type { Integration } from "./types"

export async function getIntegrations(channelId: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("channel_id", channelId)
    .order("integration_type", { ascending: true })

  if (error) {
    console.error(`Error fetching integrations for channel ${channelId}:`, error)
    throw error
  }

  return data as Integration[]
}

export async function getIntegration(channelId: string, integrationType: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("channel_id", channelId)
    .eq("integration_type", integrationType)
    .single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching integration ${integrationType} for channel ${channelId}:`, error)
    throw error
  }

  return data as Integration | null
}

export async function createOrUpdateIntegration(
  channelId: string,
  integrationType: string,
  config: any,
  enabled = true,
) {
  const supabase = getSupabaseServer()

  // Check if integration exists
  const { data: existingIntegration } = await supabase
    .from("integrations")
    .select("*")
    .eq("channel_id", channelId)
    .eq("integration_type", integrationType)
    .single()

  if (existingIntegration) {
    // Update existing integration
    const { data, error } = await supabase
      .from("integrations")
      .update({
        config,
        enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingIntegration.id)
      .select()
      .single()

    if (error) {
      console.error(`Error updating integration ${integrationType} for channel ${channelId}:`, error)
      throw error
    }

    return data as Integration
  } else {
    // Create new integration
    const { data, error } = await supabase
      .from("integrations")
      .insert({
        channel_id: channelId,
        integration_type: integrationType,
        config,
        enabled,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error(`Error creating integration ${integrationType} for channel ${channelId}:`, error)
      throw error
    }

    return data as Integration
  }
}

export async function enableIntegration(channelId: string, integrationType: string, enabled: boolean) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("integrations")
    .update({
      enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("channel_id", channelId)
    .eq("integration_type", integrationType)
    .select()
    .single()

  if (error) {
    console.error(
      `Error ${enabled ? "enabling" : "disabling"} integration ${integrationType} for channel ${channelId}:`,
      error,
    )
    throw error
  }

  return data as Integration
}

export async function deleteIntegration(channelId: string, integrationType: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase
    .from("integrations")
    .delete()
    .eq("channel_id", channelId)
    .eq("integration_type", integrationType)

  if (error) {
    console.error(`Error deleting integration ${integrationType} for channel ${channelId}:`, error)
    throw error
  }

  return true
}
