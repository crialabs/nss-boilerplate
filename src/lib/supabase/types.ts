export type Bot = {
  id: string
  name: string
  username: string
  token: string
  description: string | null
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export type Channel = {
  id: string
  name: string
  username: string
  telegram_id: string | null
  bot_id: string
  member_count: number
  welcome_message: string | null
  welcome_enabled: boolean
  tracking_enabled: boolean
  created_at: string
  updated_at: string
}

export type Lead = {
  id: string
  email: string | null
  telegram_id: string | null
  first_name: string | null
  last_name: string | null
  username: string | null
  source: string | null
  channel_id: string | null
  joined_at: string | null
  created_at: string
  last_active: string
  status: "active" | "inactive" | "left"
}

export type Event = {
  id: string
  lead_id: string
  event_type: string
  event_data: any
  created_at: string
}

export type ChannelSetting = {
  id: string
  channel_id: string
  setting_key: string
  setting_value: string | null
  created_at: string
  updated_at: string
}

export type Integration = {
  id: string
  channel_id: string
  integration_type: string
  config: any
  enabled: boolean
  created_at: string
  updated_at: string
}
