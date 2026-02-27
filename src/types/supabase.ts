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
          created_at?: string;
          updated_at?: string;
        };
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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types cho sử dụng trong components
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
