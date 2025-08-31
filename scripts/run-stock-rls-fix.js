#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://naedfhnzuwywnltjsqgp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZWRmaG56dXd5d25sdGpzcWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2Mzg2NTMsImV4cCI6MjA3MjIxNDY1M30.htNLAlzpVtriz0MmTaNnv_9N5HOcR4PXSFbaEULc6KI';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runStockRLSFix() {
  console.log('🔧 Running Stock RLS Fix Migration...');
  console.log('📡 Connecting to:', supabaseUrl);

  try {
    // Run the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Fix stock table RLS policy to allow public viewing
        DROP POLICY IF EXISTS "Allow authenticated users to view stock" ON public.stock;
        
        CREATE POLICY "Allow public to view stock" ON public.stock
            FOR SELECT USING (true);
      `
    });

    if (error) {
      console.error('❌ Error running migration:', error);
      console.log('\n📝 Manual steps:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Run this SQL:');
      console.log(`
        DROP POLICY IF EXISTS "Allow authenticated users to view stock" ON public.stock;
        
        CREATE POLICY "Allow public to view stock" ON public.stock
            FOR SELECT USING (true);
      `);
    } else {
      console.log('✅ Stock RLS fix applied successfully!');
      console.log('🌐 Public users can now view stock vehicles');
    }

  } catch (err) {
    console.error('❌ Failed to run migration:', err);
    console.log('\n📝 Please run the migration manually in Supabase Dashboard > SQL Editor');
  }
}

runStockRLSFix();
