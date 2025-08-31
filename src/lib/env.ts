import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  VITE_ENABLE_UPLOAD: z.string().transform(val => val === 'true').default('true'),
  VITE_BYPASS_ADMIN_FOR_UPLOAD: z.string().transform(val => val === 'true').default('false'),
  VITE_STORAGE_BUCKET: z.string().default('images'),
});

export const env = envSchema.parse(import.meta.env);

// Runtime validation warnings
export function validateEnv() {
  const missingVars: string[] = [];
  
  if (!env.VITE_SUPABASE_URL) {
    missingVars.push('VITE_SUPABASE_URL');
  }
  
  if (!env.VITE_SUPABASE_ANON_KEY) {
    missingVars.push('VITE_SUPABASE_ANON_KEY');
  }
  
  if (missingVars.length > 0) {
    console.warn('🚨 Missing required environment variables:', missingVars.join(', '));
    console.warn('Upload functionality may not work properly.');
  }
  
  if (!env.VITE_ENABLE_UPLOAD) {
    console.warn('⚠️ Upload functionality is disabled (VITE_ENABLE_UPLOAD=false)');
  }
  
  return {
    isUploadEnabled: env.VITE_ENABLE_UPLOAD,
    bypassAdminCheck: env.VITE_BYPASS_ADMIN_FOR_UPLOAD,
    storageBucket: env.VITE_STORAGE_BUCKET,
    hasValidSupabase: !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY),
  };
}

// Call validation on module load
validateEnv();
