import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Using placeholder values during build/runtime.'
  );
}

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cache the service role client
let serviceRoleClient: ReturnType<typeof createClient> | null = null;

// For server-side operations with service role (admin operations)
// Bypasses Row Level Security (RLS) — use for admin API routes
export const getSupabaseServiceClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  console.log('[Supabase Client] Service Role Key check:');
  console.log('[Supabase Client] Key exists:', !!serviceRoleKey);
  console.log('[Supabase Client] Key is placeholder:', serviceRoleKey === 'REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY');
  console.log('[Supabase Client] Key length:', serviceRoleKey.length);
  
  if (!serviceRoleKey || serviceRoleKey === 'REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY') {
    // No valid service role key — fall back to anon client
    console.warn('SUPABASE_SERVICE_ROLE_KEY not set. Using anon key (may be blocked by RLS).');
    return supabase;
  }
  
  // Return cached client if available, otherwise create and cache
  if (!serviceRoleClient) {
    console.log('[Supabase Client] Creating client with service role key');
    serviceRoleClient = createClient(supabaseUrl, serviceRoleKey);
  } else {
    console.log('[Supabase Client] Using cached service role client');
  }
  
  return serviceRoleClient;
};
