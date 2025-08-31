import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', process.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'EXISTS' : 'MISSING');
  console.log('\n💡 Make sure you have a .env file with:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database structure...\n');
    
    // 1. Check if we can connect
    console.log('1. Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('stock')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }
    console.log('✅ Connection successful\n');
    
    // 2. Check existing tables
    console.log('2. Checking existing tables...');
    const tables = ['stock', 'lead_sell', 'lead_finance', 'contact_messages', 'lead_order'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: EXISTS`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
    
    // 3. Try to create a test lead_order record
    console.log('\n3. Testing lead_order table...');
    try {
      const testLead = {
        marca: 'BMW',
        nume: 'Test User',
        telefon: '+40123456789',
        email: 'test@example.com',
        gdpr: true,
        status: 'new'
      };
      
      const { data, error } = await supabase
        .from('lead_order')
        .insert([testLead])
        .select()
        .single();
      
      if (error) {
        console.log(`❌ Insert test failed: ${error.message}`);
        
        // Check if table exists by trying to get its structure
        if (error.message.includes('relation "lead_order" does not exist')) {
          console.log('🔧 Table lead_order does not exist. You need to run the migration first.');
          console.log('💡 Run: node scripts/run-migration.js');
        }
      } else {
        console.log(`✅ Insert test successful: ${data.id}`);
        
        // Clean up test record
        await supabase.from('lead_order').delete().eq('id', data.id);
        console.log('🧹 Test record cleaned up');
      }
    } catch (err) {
      console.log(`❌ Test failed: ${err.message}`);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugDatabase();
