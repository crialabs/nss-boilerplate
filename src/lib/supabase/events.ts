import { getSupabaseServer } from "./server"
import type { Event } from "./types"

export async function getEvents(limit = 100, offset = 0) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching events:", error)
    throw error
  }

  return data as Event[]
}

export async function getEventsByLeadId(leadId: string, limit = 100, offset = 0) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching events for lead ${leadId}:`, error)
    throw error
  }

  return data as Event[]
}

export async function getEventsByType(eventType: string, limit = 100, offset = 0) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_type", eventType)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error(`Error fetching events of type ${eventType}:`, error)
    throw error
  }

  return data as Event[]
}

export async function createEvent(event: Omit<Event, "id" | "created_at">) {
  const supabase = getSupabaseServer()
  const { data, error } = await supabase
    .from("events")
    .insert({
      ...event,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    throw error
  }

  return data as Event
}

export async function deleteEvent(id: string) {
  const supabase = getSupabaseServer()
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting event ${id}:`, error)
    throw error
  }

  return true
}

export async function getEventCount() {
  const supabase = getSupabaseServer()
  const { count, error } = await supabase.from("events").select("*", { count: "exact", head: true })

  if (error) {
    console.error("Error counting events:", error)
    throw error
  }

  return count
}

export async function getEventCountByType(eventType: string) {
  const supabase = getSupabaseServer()
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", eventType)

  if (error) {
    console.error(`Error counting events of type ${eventType}:`, error)
    throw error
  }

  return count
}
