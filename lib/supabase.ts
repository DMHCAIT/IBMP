import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations with service role (admin operations)
// Bypasses Row Level Security (RLS) — use for admin API routes
export const getSupabaseServiceClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!serviceRoleKey || serviceRoleKey === 'REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY') {
    // No valid service role key — fall back to anon client
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Using anon key (may be blocked by RLS).');
    return supabase;
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
