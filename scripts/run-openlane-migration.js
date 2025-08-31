#!/usr/bin/env node

/**
 * Script pentru a rula migrația OpenLane
 * Adaugă coloana openlane_url în tabelul stock
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variabilele de mediu VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY sunt necesare');
  console.log('📋 Exemplu: VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key node scripts/run-openlane-migration.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runOpenLaneMigration() {
  console.log('🚀 Pornesc migrația OpenLane...');
  
  try {
    // Încearcă să adaugi direct coloana prin SQL
    const { data, error } = await supabase.rpc('sql', {
      query: `
        ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS openlane_url TEXT;
        
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'stock' AND column_name = 'openlane_url';
      `
    });

    if (error) {
      console.error('❌ Eroare la adăugarea coloanei openlane_url:', error);
      console.log('💡 Încearcă să rulezi manual SQL-ul din migrations/20250101000006_add_openlane_url.sql');
      return;
    }

    console.log('✅ Coloana openlane_url a fost adăugată cu succes în tabelul stock');
    console.log('📋 Rezultat:', data);
    
  } catch (error) {
    console.error('❌ Eroare neașteptată:', error);
    console.log('💡 Încearcă să adaugi manual coloana prin Supabase Dashboard:');
    console.log('   ALTER TABLE public.stock ADD COLUMN IF NOT EXISTS openlane_url TEXT;');
  }
}

// Rulează migrația
runOpenLaneMigration();
