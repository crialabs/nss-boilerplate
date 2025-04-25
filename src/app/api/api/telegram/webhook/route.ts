import { NextResponse } from "next/server"
import {
  getChannelByTelegramId,
  getBot,
  getLeadByTelegramId,
  createLead,
  updateLead,
  updateLeadStatus,
  createEvent,
  getChannelSetting,
  updateMemberCount,
} from "@/lib/supabase"
import { sendWelcomeMessage, getChatMemberCount } from "@/lib/telegram-api"

export async function POST(request: Request) {
  try {
    const update = await request.json()
    console.log("Received Telegram update:", JSON.stringify(update))

    // Handle new chat members
    if (update.message?.new_chat_members) {
      const chatId = update.message.chat.id.toString()

      // Get channel info
      const channel = await getChannelByTelegramId(chatId)

      if (!channel) {
        console.log(`Channel not found for chat ID: ${chatId}`)
        return NextResponse.json({ success: false, error: "Channel not found" })
      }

      // Get bot info
      const bot = await getBot(channel.bot_id)

      if (!bot) {
        console.log(`Bot not found for channel: ${channel.id}`)
        return NextResponse.json({ success: false, error: "Bot not found" })
      }

      // Update member count
      const memberCountResult = await getChatMemberCount(bot.token, chatId)
      if (memberCountResult.success) {
        await updateMemberCount(channel.id, memberCountResult.count)
      }

      // Process each new member
      for (const member of update.message.new_chat_members) {
        // Skip if the new member is a bot
        if (member.is_bot) continue

        const telegramId = member.id.toString()

        // Check if we have this user in our leads database
        const existingLead = await getLeadByTelegramId(telegramId)

        let leadId: string

        if (existingLead) {
          // Update existing lead
          const updatedLead = await updateLead(existingLead.id, {
            channel_id: channel.id,
            joined_at: new Date().toISOString(),
            status: "active",
            first_name: member.first_name,
            last_name: member.last_name || "",
            username: member.username || "",
          })

          leadId = updatedLead.id
        } else {
          // Create new lead from Telegram data
          const newLead = await createLead({
            telegram_id: telegramId,
            first_name: member.first_name,
            last_name: member.last_name || "",
            username: member.username || "",
            channel_id: channel.id,
            source: "telegram",
            joined_at: new Date().toISOString(),
            status: "active",
          })

          leadId = newLead.id
        }

        // Track join event
        await createEvent({
          lead_id: leadId,
          event_type: "channel_join",
          event_data: {
            channel_id: channel.id,
            channel_name: channel.name,
          },
        })

        // Send welcome message if enabled
        if (channel.welcome_enabled && channel.welcome_message) {
          // Get welcome delay setting
          const welcomeDelaySetting = await getChannelSetting(channel.id, "welcome_delay")
          const welcomeDelay = welcomeDelaySetting?.setting_value
            ? Number.parseInt(welcomeDelaySetting.setting_value, 10) * 1000
            : 0

          // Wait for the specified delay
          if (welcomeDelay > 0) {
            setTimeout(() => {
              sendWelcomeMessage(chatId, telegramId, channel.id)
            }, welcomeDelay)
          } else {
            await sendWelcomeMessage(chatId, telegramId, channel.id)
          }
        }
      }

      return NextResponse.json({ success: true })
    }

    // Handle left chat member
    if (update.message?.left_chat_member) {
      const chatId = update.message.chat.id.toString()
      const member = update.message.left_chat_member

      // Skip if the left member is a bot
      if (member.is_bot) {
        return NextResponse.json({ success: true })
      }

      // Get channel info
      const channel = await getChannelByTelegramId(chatId)

      if (!channel) {
        console.log(`Channel not found for chat ID: ${chatId}`)
        return NextResponse.json({ success: false, error: "Channel not found" })
      }

      // Get bot info
      const bot = await getBot(channel.bot_id)

      if (bot) {
        // Update member count
        const memberCountResult = await getChatMemberCount(bot.token, chatId)
        if (memberCountResult.success) {
          await updateMemberCount(channel.id, memberCountResult.count)
        }
      }

      // Update lead status
      const lead = await getLeadByTelegramId(member.id.toString())

      if (lead) {
        await updateLeadStatus(lead.id, "left")

        // Track leave event
        await createEvent({
          lead_id: lead.id,
          event_type: "channel_leave",
          event_data: {
            channel_id: channel.id,
            channel_name: channel.name,
          },
        })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing Telegram webhook:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
