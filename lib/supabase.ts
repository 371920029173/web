import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          nickname: string
          nickname_color: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          nickname: string
          nickname_color?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          nickname?: string
          nickname_color?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
          likes_count: number
          favorites_count: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          favorites_count?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
          likes_count?: number
          favorites_count?: number
        }
      }
      comments: {
        Row: {
          id: string
          file_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          file_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          created_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          file_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          file_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          file_id?: string
          user_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          image_url?: string | null
          created_at?: string
        }
      }
      fortune_history: {
        Row: {
          id: string
          user_id: string
          fortune: string
          advice: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          fortune: string
          advice: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          fortune?: string
          advice?: string
          created_at?: string
        }
      }
    }
  }
} 