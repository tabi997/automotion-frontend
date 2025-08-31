import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testOrderLeads() {
  try {
    console.log('🧪 Testing getOrderLeads functionality...\n');
    
    // 1. Test direct query to lead_order table
    console.log('1. Testing direct query to lead_order table...');
    const { data: directData, error: directError } = await supabase
      .from('lead_order')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (directError) {
      console.log(`❌ Direct query failed: ${directError.message}`);
      return;
    }
    
    console.log(`✅ Direct query successful: ${directData?.length || 0} leads found`);
    
    if (directData && directData.length > 0) {
      console.log('📋 Sample lead data:');
      console.log(JSON.stringify(directData[0], null, 2));
    }
    
    // 2. Test if we can access specific fields
    console.log('\n2. Testing field access...');
    if (directData && directData.length > 0) {
      const lead = directData[0];
      console.log('✅ Fields accessible:');
      console.log(`  - id: ${lead.id}`);
      console.log(`  - marca: ${lead.marca}`);
      console.log(`  - nume: ${lead.nume}`);
      console.log(`  - email: ${lead.email}`);
      console.log(`  - telefon: ${lead.telefon}`);
      console.log(`  - status: ${lead.status}`);
      console.log(`  - created_at: ${lead.created_at}`);
    }
    
    // 3. Test count query (like in dashboard)
    console.log('\n3. Testing count query...');
    const { count, error: countError } = await supabase
      .from('lead_order')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log(`❌ Count query failed: ${countError.message}`);
    } else {
      console.log(`✅ Count query successful: ${count || 0} leads total`);
    }
    
    console.log('\n🎉 Order leads functionality test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOrderLeads();
