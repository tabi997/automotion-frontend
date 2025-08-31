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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      stock: {
        Row: {
          id: string
          marca: string
          model: string
          an: number
          km: number
          pret: number
          combustibil: string
          transmisie: string
          caroserie: string
          culoare: string | null
          vin: string | null
          negociabil: boolean | null
          images: string[] | null
          descriere: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          marca: string
          model: string
          an: number
          km: number
          pret: number
          combustibil: string
          transmisie: string
          caroserie: string
          culoare?: string | null
          vin?: string | null
          negociabil?: boolean | null
          images?: string[] | null
          descriere?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          marca?: string
          model?: string
          an?: number
          km?: number
          pret?: number
          combustibil?: string
          transmisie?: string
          caroserie?: string
          culoare?: string | null
          vin?: string | null
          negociabil?: boolean | null
          images?: string[] | null
          descriere?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          gdpr: boolean
          id: string
          mesaj: string
          nume: string
          subiect: string
          telefon: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          gdpr?: boolean
          id?: string
          mesaj: string
          nume: string
          subiect: string
          telefon?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          gdpr?: boolean
          id?: string
          mesaj?: string
          nume?: string
          subiect?: string
          telefon?: string | null
          status?: string
        }
        Relationships: []
      }
      lead_finance: {
        Row: {
          avans: number
          created_at: string
          dobanda: number
          email: string
          id: string
          istoric_creditare: string | null
          link_stoc: string | null
          mesaj: string | null
          nume: string
          perioada: number
          pret: number
          telefon: string
          tip_contract: string | null
          venit_lunar: number | null
          status: string
        }
        Insert: {
          avans?: number
          created_at?: string
          dobanda: number
          email: string
          id?: string
          istoric_creditare?: string | null
          link_stoc?: string | null
          mesaj?: string | null
          nume: string
          perioada: number
          pret: number
          telefon: string
          tip_contract?: string | null
          venit_lunar?: number | null
          status?: string
        }
        Update: {
          avans?: number
          created_at?: string
          dobanda?: number
          email?: string
          id?: string
          istoric_creditare?: string | null
          link_stoc?: string | null
          mesaj?: string | null
          nume?: string
          perioada?: number
          pret?: number
          telefon?: string
          tip_contract?: string | null
          venit_lunar?: number | null
          status?: string
        }
        Relationships: []
      }
      lead_sell: {
        Row: {
          an: number
          caroserie: string
          combustibil: string
          created_at: string
          culoare: string | null
          email: string
          gdpr: boolean
          id: string
          images: string[] | null
          interval_orar: string | null
          judet: string
          km: number
          marca: string
          model: string
          negociabil: boolean | null
          nume: string
          oras: string
          preferinta_contact: string | null
          pret: number | null
          telefon: string
          transmisie: string
          vin: string | null
          status: string
        }
        Insert: {
          an: number
          caroserie: string
          combustibil: string
          created_at?: string
          culoare?: string | null
          email: string
          gdpr?: boolean
          id?: string
          images?: string[] | null
          interval_orar?: string | null
          judet: string
          km: number
          marca: string
          model: string
          negociabil?: boolean | null
          nume: string
          oras: string
          preferinta_contact?: string | null
          pret?: number | null
          telefon: string
          transmisie: string
          vin?: string | null
          status?: string
        }
        Update: {
          an?: number
          caroserie?: string
          combustibil?: string
          created_at?: string
          culoare?: string | null
          email?: string
          gdpr?: boolean
          id?: string
          images?: string[] | null
          interval_orar?: string | null
          judet?: string
          km?: number
          marca?: string
          model?: string
          negociabil?: boolean | null
          nume?: string
          oras?: string
          preferinta_contact?: string | null
          pret?: number | null
          telefon?: string
          transmisie?: string
          vin?: string | null
          status?: string
        }
        Relationships: []
      }
      lead_order: {
        Row: {
          id: string
          created_at: string
          marca: string
          model: string | null
          an_min: number | null
          an_max: number | null
          km_max: number | null
          combustibil: string | null
          transmisie: string | null
          caroserie: string | null
          culoare: string | null
          pret_max: number | null
          pret_min: number | null
          caracteristici_speciale: string[] | null
          urgent: boolean
          observatii: string | null
          nume: string
          telefon: string
          email: string
          preferinta_contact: string | null
          interval_orar: string | null
          gdpr: boolean
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          marca: string
          model?: string | null
          an_min?: number | null
          an_max?: number | null
          km_max?: number | null
          combustibil?: string | null
          transmisie?: string | null
          caroserie?: string | null
          culoare?: string | null
          pret_max?: number | null
          pret_min?: number | null
          caracteristici_speciale?: string[] | null
          urgent?: boolean
          observatii?: string | null
          nume: string
          telefon: string
          email: string
          preferinta_contact?: string | null
          interval_orar?: string | null
          gdpr?: boolean
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          marca?: string
          model?: string | null
          an_min?: number | null
          an_max?: number | null
          km_max?: number | null
          combustibil?: string | null
          transmisie?: string | null
          caroserie?: string | null
          culoare?: string | null
          pret_max?: number | null
          pret_min?: number | null
          caracteristici_speciale?: string[] | null
          urgent?: boolean
          observatii?: string | null
          nume?: string
          telefon?: string
          email?: string
          preferinta_contact?: string | null
          interval_orar?: string | null
          gdpr?: boolean
          status?: string
        }
        Relationships: []
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
