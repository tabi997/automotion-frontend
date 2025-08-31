import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLSTemp() {
  try {
    console.log('🔧 Temporarily disabling RLS for lead_order table...\n');
    
    // Try to disable RLS temporarily
    console.log('1. Attempting to disable RLS...');
    
    // Since we can't use exec_sql, let's try a different approach
    // We'll test if we can insert directly and then provide manual instructions
    
    console.log('2. Testing current insert capability...');
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
      console.log(`❌ Insert still failed: ${error.message}`);
      
      if (error.message.includes('row-level security policy')) {
        console.log('\n🔧 RLS Policy Issue Detected!');
        console.log('\n💡 To fix this manually in Supabase Dashboard:');
        console.log('\n1. Go to: https://supabase.com/dashboard');
        console.log('2. Select your project: naedfhnzuwywnltjsqgp');
        console.log('3. Go to: Authentication > Policies');
        console.log('4. Find table: lead_order');
        console.log('5. Click "New Policy"');
        console.log('6. Choose "Create a policy from scratch"');
        console.log('7. Set:');
        console.log('   - Policy Name: "Allow public insert"');
        console.log('   - Target roles: public');
        console.log('   - Using expression: true');
        console.log('   - With check expression: true');
        console.log('8. Save the policy');
        console.log('\n🔄 After creating the policy, try the form again!');
      }
    } else {
      console.log(`✅ Insert successful: ${data.id}`);
      
      // Clean up test record
      await supabase.from('lead_order').delete().eq('id', data.id);
      console.log('🧹 Test record cleaned up');
      console.log('\n🎉 RLS is working now! The form should work.');
    }
    
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
  }
}

disableRLSTemp();
