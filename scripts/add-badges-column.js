import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBadgesColumn() {
  console.log('🚀 Adding badges column to stock table...');
  
  try {
    // Add the badges column using SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.stock 
        ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
        
        COMMENT ON COLUMN public.stock.badges IS 'Array of badge objects with structure: [{"id": "string", "text": "string", "type": "success|warning|info|urgent"}]';
      `
    });
    
    if (error) {
      console.error('❌ Error adding badges column:', error);
      
      // Try alternative approach - check if column exists
      console.log('🔍 Checking if badges column already exists...');
      const { data: columns, error: checkError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'stock')
        .eq('table_schema', 'public');
      
      if (checkError) {
        console.error('❌ Error checking columns:', checkError);
      } else {
        const hasBadges = columns?.some(col => col.column_name === 'badges');
        if (hasBadges) {
          console.log('✅ Badges column already exists');
        } else {
          console.log('❌ Badges column does not exist and could not be added');
          console.log('💡 You may need to run the migration manually in your Supabase dashboard');
        }
      }
    } else {
      console.log('✅ Badges column added successfully');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addBadgesColumn();
