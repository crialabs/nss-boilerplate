// Real Telegram Bot API implementation
const TELEGRAM_API_BASE = "https://api.telegram.org/bot"

interface TelegramResponse<T> {
  ok: boolean
  result?: T
  description?: string
}

/**
 * Makes a request to the Telegram Bot API
 */
async function makeRequest<T>(token: string, method: string, params: Record<string, any> = {}): Promise<T> {
  const url = `${TELEGRAM_API_BASE}${token}/${method}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  })

  const data: TelegramResponse<T> = await response.json()

  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description || "Unknown error"}`)
  }

  return data.result as T
}

/**
 * Sets the webhook URL for a bot
 */
export async function setWebhook(token: string, url: string) {
  try {
    await makeRequest(token, "setWebhook", {
      url,
      allowed_updates: ["message", "callback_query", "chat_member"],
    })

    return { success: true }
  } catch (error) {
    console.error("Error setting webhook:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets information about the webhook
 */
export async function getWebhookInfo(token: string) {
  try {
    const info = await makeRequest<any>(token, "getWebhookInfo")
    return { success: true, info }
  } catch (error) {
    console.error("Error getting webhook info:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Sends a message to a chat
 */
export async function sendMessage(token: string, chatId: string, text: string, options: Record<string, any> = {}) {
  try {
    const message = await makeRequest(token, "sendMessage", {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...options,
    })

    return { success: true, message }
  } catch (error) {
    console.error("Error sending message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets information about a chat
 */
export async function getChat(token: string, chatId: string) {
  try {
    const chat = await makeRequest<any>(token, "getChat", {
      chat_id: chatId,
    })

    return { success: true, chat }
  } catch (error) {
    console.error("Error getting chat info:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets the number of members in a chat
 */
export async function getChatMemberCount(token: string, chatId: string) {
  try {
    const count = await makeRequest<number>(token, "getChatMemberCount", {
      chat_id: chatId,
    })

    return { success: true, count }
  } catch (error) {
    console.error("Error getting chat member count:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      count: 0,
    }
  }
}

/**
 * Sends a welcome message to a new chat member
 */
export async function sendWelcomeMessage(chatId: string, userId: string, channelId: string) {
  try {
    // Get channel info from database
    const { getChannel, getBot, getLeadByTelegramId, getChannelSetting } = await import("@/lib/supabase")

    const channel = await getChannel(channelId)

    if (!channel || !channel.welcome_enabled || !channel.welcome_message) {
      return { success: false, error: "Welcome message not enabled or not set" }
    }

    // Get bot info
    const bot = await getBot(channel.bot_id)

    if (!bot) {
      return { success: false, error: "Bot not found" }
    }

    // Get user info
    const lead = await getLeadByTelegramId(userId)

    if (!lead) {
      return { success: false, error: "Lead not found" }
    }

    // Personalize welcome message
    let welcomeMessage = channel.welcome_message
    welcomeMessage = welcomeMessage.replace(/{name}/g, lead.first_name || "")
    welcomeMessage = welcomeMessage.replace(/{channel}/g, channel.name)

    // Send the welcome message
    return await sendMessage(bot.token, chatId, welcomeMessage)
  } catch (error) {
    console.error("Error sending welcome message:", error)
    return { success: false, error: "Internal server error" }
  }
}

export { makeRequest }
