import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations with service role (admin operations)
// Make sure to use process.env.SUPABASE_SERVICE_ROLE_KEY for admin operations
export const getSupabaseServiceClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Admin operations may not work.');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
