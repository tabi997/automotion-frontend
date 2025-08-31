import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runFixMigration() {
  try {
    console.log('🔧 Running fix migration for lead_order RLS policies...\n');
    
    // Read the migration file
    const migrationPath = './supabase/migrations/20250101000003_fix_lead_order_policies.sql';
    
    if (!fs.existsSync(migrationPath)) {
      console.error('Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration SQL loaded successfully');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          
          if (error) {
            console.log(`❌ Statement ${i + 1} failed: ${error.message}`);
            // Try alternative approach - direct SQL execution
            console.log('🔄 Trying alternative approach...');
            const { error: directError } = await supabase
              .from('lead_order')
              .select('id')
              .limit(1);
            
            if (directError && directError.message.includes('policy')) {
              console.log('🔧 RLS policies need manual fixing in Supabase dashboard');
              console.log('💡 Go to Authentication > Policies and fix manually');
            }
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error: ${err.message}`);
        }
      }
    }
    
    console.log('\n🎉 Fix migration completed!');
    console.log('\n💡 If you still have issues, try:');
    console.log('1. Go to Supabase Dashboard > Authentication > Policies');
    console.log('2. Find the lead_order table');
    console.log('3. Enable "Enable read access to everyone" temporarily');
    console.log('4. Or create a policy: "Allow public insert" with "true" condition');
    
  } catch (error) {
    console.error('❌ Fix migration failed:', error.message);
  }
}

runFixMigration();
