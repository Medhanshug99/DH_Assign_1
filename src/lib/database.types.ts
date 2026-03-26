export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          subscription_status: 'none' | 'monthly' | 'yearly'
          subscription_period_end: string | null
          selected_charity_id: string | null
          contribution_percentage: number | null
          is_admin: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          subscription_status?: 'none' | 'monthly' | 'yearly'
        }
        Update: {
          subscription_status?: 'none' | 'monthly' | 'yearly'
          selected_charity_id?: string | null
          contribution_percentage?: number | null
        }
      }
      scores: {
        Row: {
          id: string
          user_id: string
          score: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          date?: string
          created_at?: string
        }
        Update: {
          score?: number
          date?: string
        }
      }
      charities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          created_at: string
        }
      }
      draws: {
        Row: {
          id: string
          month_year: string
          numbers: number[]
          executed_at: string
          status: string
        }
      }
      draw_results: {
        Row: {
          id: string
          draw_id: string
          user_id: string
          matches_count: number
          won_amount: number | null
          verified: boolean | null
          created_at: string
        }
      }
    }
  }
}
