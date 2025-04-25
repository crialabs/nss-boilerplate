export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bots: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          token: string
          updated_at: string | null
          username: string
          webhook_last_updated: string | null
          webhook_status: string | null
          webhook_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          token: string
          updated_at?: string | null
          username: string
          webhook_last_updated?: string | null
          webhook_status?: string | null
          webhook_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          token?: string
          updated_at?: string | null
          username?: string
          webhook_last_updated?: string | null
          webhook_status?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      channel_settings: {
        Row: {
          channel_id: string | null
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_settings_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          bot_id: string | null
          created_at: string | null
          id: string
          member_count: number | null
          name: string
          telegram_id: string | null
          tracking_enabled: boolean | null
          updated_at: string | null
          username: string
          welcome_enabled: boolean | null
          welcome_message: string | null
        }
        Insert: {
          bot_id?: string | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          name: string
          telegram_id?: string | null
          tracking_enabled?: boolean | null
          updated_at?: string | null
          username: string
          welcome_enabled?: boolean | null
          welcome_message?: string | null
        }
        Update: {
          bot_id?: string | null
          created_at?: string | null
          id?: string
          member_count?: number | null
          name?: string
          telegram_id?: string | null
          tracking_enabled?: boolean | null
          updated_at?: string | null
          username?: string
          welcome_enabled?: boolean | null
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channels_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          lead_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          lead_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          channel_id: string | null
          config: Json | null
          created_at: string | null
          enabled: boolean | null
          id: string
          integration_type: string
          updated_at: string | null
        }
        Insert: {
          channel_id?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          integration_type: string
          updated_at?: string | null
        }
        Update: {
          channel_id?: string | null
          config?: Json | null
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          integration_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "integrations_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          channel_id: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          joined_at: string | null
          last_active: string | null
          last_name: string | null
          source: string | null
          status: string | null
          telegram_id: string | null
          username: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          joined_at?: string | null
          last_active?: string | null
          last_name?: string | null
          source?: string | null
          status?: string | null
          telegram_id?: string | null
          username?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          joined_at?: string | null
          last_active?: string | null
          last_name?: string | null
          source?: string | null
          status?: string | null
          telegram_id?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_messages: {
        Row: {
          bot_id: string
          channel_id: string
          created_at: string
          disable_notification: boolean | null
          disable_web_page_preview: boolean | null
          id: string
          last_sent: string | null
          message: string
          parse_mode: string | null
          repeat_days: number[] | null
          repeat_time: string | null
          repeat_type: string
          scheduled_time: string
          status: string
          updated_at: string
        }
        Insert: {
          bot_id: string
          channel_id: string
          created_at?: string
          disable_notification?: boolean | null
          disable_web_page_preview?: boolean | null
          id?: string
          last_sent?: string | null
          message: string
          parse_mode?: string | null
          repeat_days?: number[] | null
          repeat_time?: string | null
          repeat_type: string
          scheduled_time: string
          status: string
          updated_at?: string
        }
        Update: {
          bot_id?: string
          channel_id?: string
          created_at?: string
          disable_notification?: boolean | null
          disable_web_page_preview?: boolean | null
          id?: string
          last_sent?: string | null
          message?: string
          parse_mode?: string | null
          repeat_days?: number[] | null
          repeat_time?: string | null
          repeat_type?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_messages_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_api_keys: {
        Row: {
          api_key: string
          channel_id: string
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          api_key: string
          channel_id: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          channel_id?: string
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_api_keys_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_queue: {
        Row: {
          channel_id: string
          chat_id: string
          created_at: string
          id: string
          scheduled_time: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel_id: string
          chat_id: string
          created_at?: string
          id?: string
          scheduled_time: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel_id?: string
          chat_id?: string
          created_at?: string
          id?: string
          scheduled_time?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "welcome_queue_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
      welcome_templates: {
        Row: {
          channel_id: string
          created_at: string
          delay_seconds: number
          disable_notification: boolean | null
          disable_web_page_preview: boolean | null
          enabled: boolean
          id: string
          message: string
          parse_mode: string | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          delay_seconds?: number
          disable_notification?: boolean | null
          disable_web_page_preview?: boolean | null
          enabled?: boolean
          id?: string
          message: string
          parse_mode?: string | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          delay_seconds?: number
          disable_notification?: boolean | null
          disable_web_page_preview?: boolean | null
          enabled?: boolean
          id?: string
          message?: string
          parse_mode?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "welcome_templates_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: true
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
