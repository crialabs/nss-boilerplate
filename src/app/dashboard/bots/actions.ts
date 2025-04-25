"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createBot, updateBot, deleteBot, getBot } from "@/lib/supabase"
import { setWebhook } from "@/lib/telegram-api"

export async function createBotAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const token = formData.get("token") as string
    const description = formData.get("description") as string

    if (!name || !username || !token) {
      return {
        success: false,
        error: "Name, username, and token are required",
      }
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith("@") ? username : `@${username}`

    // Create bot in database
    const bot = await createBot({
      name,
      username: cleanUsername,
      token,
      description,
      status: "active",
    })

    // Set up webhook for the bot
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

    const webhookUrl = `${baseUrl}/api/telegram/webhook`
    await setWebhook(token, webhookUrl)

    revalidatePath("/dashboard/bots")
    return { success: true, botId: bot.id }
  } catch (error) {
    console.error("Error creating bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function updateBotAction(botId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const token = formData.get("token") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as string

    if (!name || !username) {
      return {
        success: false,
        error: "Name and username are required",
      }
    }

    // Clean up username (remove @ if present)
    const cleanUsername = username.startsWith("@") ? username : `@${username}`

    // Get current bot data
    const currentBot = await getBot(botId)

    // Update bot in database
    const bot = await updateBot(botId, {
      name,
      username: cleanUsername,
      token: token || currentBot.token,
      description,
      status: (status as "active" | "inactive") || "active",
    })

    // If token changed, update webhook
    if (token && token !== currentBot.token) {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

      const webhookUrl = `${baseUrl}/api/telegram/webhook`
      await setWebhook(token, webhookUrl)
    }

    revalidatePath("/dashboard/bots")
    revalidatePath(`/dashboard/bots/${botId}`)
    return { success: true, botId: bot.id }
  } catch (error) {
    console.error("Error updating bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

export async function deleteBotAction(botId: string) {
  try {
    await deleteBot(botId)
    revalidatePath("/dashboard/bots")
    redirect("/dashboard/bots")
  } catch (error) {
    console.error("Error deleting bot:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
