import { getSupabaseServer } from "./server"
import type { Lead } from "./types"

export async function getLeads(limit = 100, offset = 0) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching leads:", error)
    throw error
  }

  return data as Lead[]
}

export async function getLeadsByChannelId(channelId: string, limit = 100, offset = 0) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching leads for channel ${channelId}:`, error)
    throw error
  }

  return data as Lead[]
}

export async function getLead(id: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching lead ${id}:`, error)
    throw error
  }

  return data as Lead
}

export async function getLeadByEmail(email: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("leads").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching lead by email ${email}:`, error)
    throw error
  }

  return data as Lead | null
}

export async function getLeadByTelegramId(telegramId: string) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase.from("leads").select("*").eq("telegram_id", telegramId).single()

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error(`Error fetching lead by Telegram ID ${telegramId}:`, error)
    throw error
  }

  return data as Lead | null
}

export async function createLead(lead: Omit<Lead, "id" | "created_at" | "last_active">) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("leads")
    .insert({
      ...lead,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating lead:", error)
    throw error
  }

  return data as Lead
}

export async function updateLead(id: string, lead: Partial<Lead>) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("leads")
    .update({
      ...lead,
      last_active: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating lead ${id}:`, error)
    throw error
  }

  return data as Lead
}

export async function updateLeadStatus(id: string, status: "active" | "inactive" | "left") {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("leads")
    .update({
      status,
      last_active: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(`Error updating status for lead ${id}:`, error)
    throw error
  }

  return data as Lead
}

export async function deleteLead(id: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting lead ${id}:`, error)
    throw error
  }

  return true
}

export async function getLeadCount() {
  const supabase = getSupabaseServer()
  const { count, error } = await supabase.from("leads").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error counting leads:", error)
    throw error
  }

  return count
}

export async function getActiveLeadCount() {
  const supabase = getSupabaseServer()
  const { count, error } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  if (error) {
    console.error("Error counting active leads:", error)
    throw error
  }

  return count
}
