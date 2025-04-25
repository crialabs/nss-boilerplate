export * from "./supabase/client"
export * from "./supabase/server"
export * from "./supabase/types"
export * from "./supabase/bots"
export * from "./supabase/channels"
export * from "./supabase/leads"
export * from "./supabase/events"
export * from "./supabase/settings"
export * from "./supabase/integrations"

import { getChannelByTelegramId as getChannelByTelegramIdInternal } from "./supabase/channels"
import { getBot as getBotInternal } from "./supabase/bots"
import { getLeadByTelegramId as getLeadByTelegramIdInternal } from "./supabase/leads"
import { getChannel as getChannelInternal } from "./supabase/channels"
import { getLeadByEmail as getLeadByEmailInternal } from "./supabase/leads"
import { createEvent as createEventInternal } from "./supabase/events"
import { updateLead as updateLeadInternal } from "./supabase/leads"
import { getChannelSetting as getChannelSettingInternal } from "./supabase/settings"

export const getChannelByTelegramId = getChannelByTelegramIdInternal
export const getBot = getBotInternal
export const getLeadByTelegramId = getLeadByTelegramIdInternal
export const getChannel = getChannelInternal
export const getLeadByEmail = getLeadByEmailInternal
export const createEvent = createEventInternal
export const updateLead = updateLeadInternal
export const getChannelSetting = getChannelSettingInternal
