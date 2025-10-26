import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          name: string;
          description: string;
          fields: any;
          global_rules: any;
          submit_action: any;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          is_published: boolean;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          fields: any;
          global_rules?: any;
          submit_action?: any;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          is_published?: boolean;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          fields?: any;
          global_rules?: any;
          submit_action?: any;
          updated_at?: string;
          user_id?: string | null;
          is_published?: boolean;
          slug?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          submission_data: any;
          submitted_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          form_id: string;
          submission_data: any;
          submitted_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
      };
    };
  };
}
