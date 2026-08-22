// Supabase-compatible JSON type for JSONB columns
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
      menu_items: {
        Row: {
          id: string;
          title: string;
          category: string;
          price: number;
          description: string | null;
          image_url: string | null;
          is_available: boolean;
          ingredients: Json;  // JSONB - Ingredient[]
          food_cost: number;
          food_cost_percentage: number;  // generated column, read-only
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          price: number;
          description?: string | null;
          image_url?: string | null;
          is_available?: boolean;
          ingredients?: Json;
          food_cost?: number;
          // food_cost_percentage is generated, cannot insert
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          price?: number;
          description?: string | null;
          image_url?: string | null;
          is_available?: boolean;
          ingredients?: Json;
          food_cost?: number;
          // food_cost_percentage is generated, cannot update
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          main_image_url: string | null;
          gallery: string[] | null;
          published_at: string | null;
          author: string;
          category: string | null;
          guest_count: number | null;
          location: string | null;
          body: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          main_image_url?: string | null;
          gallery?: string[] | null;
          published_at?: string | null;
          author?: string;
          category?: string | null;
          guest_count?: number | null;
          location?: string | null;
          body?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          main_image_url?: string | null;
          gallery?: string[] | null;
          published_at?: string | null;
          author?: string;
          category?: string | null;
          guest_count?: number | null;
          location?: string | null;
          body?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: 'owner' | 'staff';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: 'owner' | 'staff';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: 'owner' | 'staff';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types cho sử dụng trong components
export type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Keep legacy alias
export type MenuItem = MenuItemRow;
