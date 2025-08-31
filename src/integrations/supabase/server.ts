import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { env } from '@/lib/env';

// Server-side Supabase client (for server actions, API routes, etc.)
export const supabaseServer = createClient<Database>(
  env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Allowlist for CORS (if needed for server actions)
export const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://your-production-domain.com', // Replace with actual production domain
];
