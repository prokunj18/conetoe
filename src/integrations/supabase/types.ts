export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bot_profiles: {
        Row: {
          avatar: string
          created_at: string | null
          difficulty: string
          id: string
          max_level: number
          min_level: number
          username: string
        }
        Insert: {
          avatar?: string
          created_at?: string | null
          difficulty: string
          id?: string
          max_level?: number
          min_level?: number
          username: string
        }
        Update: {
          avatar?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          max_level?: number
          min_level?: number
          username?: string
        }
        Relationships: []
      }
      game_history: {
        Row: {
          difficulty: string | null
          exp_gained: number
          game_mode: string
          id: string
          opponent_id: string | null
          played_at: string | null
          player_id: string
          result: string
          room_id: string | null
        }
        Insert: {
          difficulty?: string | null
          exp_gained?: number
          game_mode: string
          id?: string
          opponent_id?: string | null
          played_at?: string | null
          player_id: string
          result: string
          room_id?: string | null
        }
        Update: {
          difficulty?: string | null
          exp_gained?: number
          game_mode?: string
          id?: string
          opponent_id?: string | null
          played_at?: string | null
          player_id?: string
          result?: string
          room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_history_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_history_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_history_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          bet_amount: number
          bot_profile_id: string | null
          created_at: string | null
          finished_at: string | null
          game_state: Json | null
          guest_id: string | null
          host_id: string
          id: string
          is_bot_game: boolean
          room_code: string
          started_at: string | null
          status: string
          winner_id: string | null
        }
        Insert: {
          bet_amount?: number
          bot_profile_id?: string | null
          created_at?: string | null
          finished_at?: string | null
          game_state?: Json | null
          guest_id?: string | null
          host_id: string
          id?: string
          is_bot_game?: boolean
          room_code: string
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Update: {
          bet_amount?: number
          bot_profile_id?: string | null
          created_at?: string | null
          finished_at?: string | null
          game_state?: Json | null
          guest_id?: string | null
          host_id?: string
          id?: string
          is_bot_game?: boolean
          room_code?: string
          started_at?: string | null
          status?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_rooms_bot_profile_id_fkey"
            columns: ["bot_profile_id"]
            isOneToOne: false
            referencedRelation: "bot_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_rooms_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_rooms_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_rooms_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string
          coins: number
          created_at: string | null
          exp: number
          id: string
          last_activity: string | null
          level: number
          total_games: number
          total_wins: number
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar?: string
          coins?: number
          created_at?: string | null
          exp?: number
          id: string
          last_activity?: string | null
          level?: number
          total_games?: number
          total_wins?: number
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar?: string
          coins?: number
          created_at?: string | null
          exp?: number
          id?: string
          last_activity?: string | null
          level?: number
          total_games?: number
          total_wins?: number
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_exp_and_level_up: {
        Args: { exp_amount: number; user_id: string }
        Returns: Json
      }
      apply_exp_decay: {
        Args: { user_id: string }
        Returns: undefined
      }
      complete_game: {
        Args: { p_bet_amount: number; p_room_id: string; p_winner_id: string }
        Returns: undefined
      }
      generate_room_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
