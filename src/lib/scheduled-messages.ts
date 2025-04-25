import { getBot, getChannel, createEvent } from "@/lib/supabase"
import { sendMessage } from "@/lib/telegram-api"

export interface ScheduledMessage {
  id: string
  bot_id: string
  channel_id: string
  message: string
  scheduled_time: string
  repeat_type: "once" | "daily" | "weekly" | "monthly"
  repeat_days?: number[] // 0-6 for weekly (Sunday-Saturday)
  repeat_time?: string // HH:MM format
  status: "pending" | "sent" | "failed"
  created_at: string
  updated_at: string
  last_sent?: string
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2"
  disable_web_page_preview?: boolean
  disable_notification?: boolean
}

/**
 * Schedules a message to be sent at a specific time
 */
export async function scheduleMessage(message: Omit<ScheduledMessage, "id" | "created_at" | "updated_at" | "status">) {
  try {
    const supabase = (await import("@/lib/supabase")).getSupabaseServer()

    // Validate bot and channel
    const [bot, channel] = await Promise.all([getBot(message.bot_id), getChannel(message.channel_id)])

    if (!bot) {
      throw new Error(`Bot with ID ${message.bot_id} not found`)
    }

    if (!channel) {
      throw new Error(`Channel with ID ${message.channel_id} not found`)
    }

    if (!channel.telegram_id) {
      throw new Error(`Channel ${message.channel_id} does not have a Telegram ID`)
    }

    // Insert scheduled message
    const { data, error } = await supabase
      .from("scheduled_messages")
      .insert({
        ...message,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return { success: true, message: data }
  } catch (error) {
    console.error("Error scheduling message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets all scheduled messages
 */
export async function getScheduledMessages(filters?: {
  bot_id?: string
  channel_id?: string
  status?: "pending" | "sent" | "failed"
}) {
  try {
    const supabase = (await import("@/lib/supabase")).getSupabaseServer()

    let query = supabase.from("scheduled_messages").select("*")

    if (filters?.bot_id) {
      query = query.eq("bot_id", filters.bot_id)
    }

    if (filters?.channel_id) {
      query = query.eq("channel_id", filters.channel_id)
    }

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }

    const { data, error } = await query.order("scheduled_time", { ascending: true })

    if (error) {
      throw error
    }

    return { success: true, messages: data }
  } catch (error) {
    console.error("Error getting scheduled messages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Sends a scheduled message
 */
export async function sendScheduledMessage(messageId: string) {
  try {
    const supabase = (await import("@/lib/supabase")).getSupabaseServer()

    // Get scheduled message
    const { data: message, error } = await supabase.from("scheduled_messages").select("*").eq("id", messageId).single()

    if (error) {
      throw error
    }

    if (!message) {
      throw new Error(`Scheduled message with ID ${messageId} not found`)
    }

    // Get bot and channel
    const [bot, channel] = await Promise.all([getBot(message.bot_id), getChannel(message.channel_id)])

    if (!bot) {
      throw new Error(`Bot with ID ${message.bot_id} not found`)
    }

    if (!channel) {
      throw new Error(`Channel with ID ${message.channel_id} not found`)
    }

    if (!channel.telegram_id) {
      throw new Error(`Channel ${message.channel_id} does not have a Telegram ID`)
    }

    // Send message
    const result = await sendMessage(bot.token, channel.telegram_id, message.message, {
      parse_mode: message.parse_mode,
      disable_web_page_preview: message.disable_web_page_preview,
      disable_notification: message.disable_notification,
    })

    if (!result.success) {
      // Update message status to failed
      await supabase
        .from("scheduled_messages")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
          last_sent: new Date().toISOString(),
        })
        .eq("id", messageId)

      return { success: false, error: result.error }
    }

    // Update message status
    await supabase
      .from("scheduled_messages")
      .update({
        status: message.repeat_type === "once" ? "sent" : "pending",
        updated_at: new Date().toISOString(),
        last_sent: new Date().toISOString(),
      })
      .eq("id", messageId)

    // Create event
    await createEvent({
      lead_id: "system",
      event_type: "scheduled_message_sent",
      event_data: {
        message_id: messageId,
        bot_id: message.bot_id,
        channel_id: message.channel_id,
        telegram_message_id: result.message?.message_id,
      },
    })

    return { success: true, result }
  } catch (error) {
    console.error(`Error sending scheduled message ${messageId}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Processes pending scheduled messages
 * This should be called by a cron job every minute
 */
export async function processScheduledMessages() {
  try {
    const supabase = (await import("@/lib/supabase")).getSupabaseServer()

    // Get pending messages that are due
    const now = new Date()
    const { data: messages, error } = await supabase
      .from("scheduled_messages")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_time", now.toISOString())

    if (error) {
      throw error
    }

    if (!messages || messages.length === 0) {
      return { success: true, processed: 0 }
    }

    // Process each message
    const results = await Promise.all(
      messages.map(async (message) => {
        // For repeating messages, check if it should be sent now
        if (message.repeat_type !== "once" && message.last_sent) {
          const lastSent = new Date(message.last_sent)
          const shouldSend = shouldSendRepeatingMessage(message, lastSent, now)

          if (!shouldSend) {
            return { id: message.id, success: false, skipped: true }
          }
        }

        // Send the message
        const result = await sendScheduledMessage(message.id)
        return { id: message.id, success: result.success, error: result.error }
      }),
    )

    return {
      success: true,
      processed: results.length,
      results,
    }
  } catch (error) {
    console.error("Error processing scheduled messages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Checks if a repeating message should be sent based on its schedule
 */
function shouldSendRepeatingMessage(message: ScheduledMessage, lastSent: Date, now: Date): boolean {
  // Get the time components
  const repeatTime = message.repeat_time ? message.repeat_time.split(":") : null
  const targetHour = repeatTime ? Number.parseInt(repeatTime[0], 10) : now.getHours()
  const targetMinute = repeatTime ? Number.parseInt(repeatTime[1], 10) : now.getMinutes()

  // Current time components
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  // Check if current time matches target time (within the same minute)
  const timeMatches = currentHour === targetHour && currentMinute === targetMinute

  switch (message.repeat_type) {
    case "daily":
      // For daily, just check if it's the right time and it hasn't been sent today
      return (
        timeMatches &&
        (lastSent.getDate() !== now.getDate() ||
          lastSent.getMonth() !== now.getMonth() ||
          lastSent.getFullYear() !== now.getFullYear())
      )

    case "weekly":
      // For weekly, check if it's the right day and time
      const currentDay = now.getDay() // 0-6, Sunday-Saturday
      return (
        timeMatches &&
        message.repeat_days?.includes(currentDay) &&
        now.getTime() - lastSent.getTime() >= 24 * 60 * 60 * 1000
      ) // At least 24 hours since last sent

    case "monthly":
      // For monthly, check if it's the same day of month and right time
      return (
        timeMatches &&
        now.getDate() === new Date(message.scheduled_time).getDate() &&
        (now.getMonth() !== lastSent.getMonth() || now.getFullYear() !== lastSent.getFullYear())
      )

    default:
      return false
  }
}
