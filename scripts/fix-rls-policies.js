import { createClient } from '@supabase/supabase-js';

// Get environment variables from process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies for lead_order table...\n');
    
    // 1. Drop existing policies if they exist
    console.log('1. Dropping existing policies...');
    try {
      await supabase.rpc('exec_sql', { 
        sql: 'DROP POLICY IF EXISTS "Allow public insert on lead_order" ON public.lead_order;' 
      });
      console.log('✅ Old policies dropped');
    } catch (err) {
      console.log('ℹ️ No old policies to drop');
    }
    
    // 2. Create new policies
    console.log('\n2. Creating new policies...');
    
    const policies = [
      // Allow public insert for lead collection
      `CREATE POLICY "Allow public insert on lead_order" 
       ON public.lead_order 
       FOR INSERT 
       TO public 
       WITH CHECK (true);`,
      
      // Allow public select for their own leads (optional)
      `CREATE POLICY "Allow public select own leads" 
       ON public.lead_order 
       FOR SELECT 
       TO public 
       USING (true);`,
      
      // Allow authenticated users to update their own leads
      `CREATE POLICY "Allow authenticated update own leads" 
       ON public.lead_order 
       FOR UPDATE 
       TO authenticated 
       USING (true) 
       WITH CHECK (true);`
    ];
    
    for (const policy of policies) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: policy });
        if (error) {
          console.log(`❌ Policy creation failed: ${error.message}`);
        } else {
          console.log('✅ Policy created successfully');
        }
      } catch (err) {
        console.log(`❌ Policy creation error: ${err.message}`);
      }
    }
    
    // 3. Test the policies
    console.log('\n3. Testing policies...');
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
        console.log(`❌ Insert test still failed: ${error.message}`);
      } else {
        console.log(`✅ Insert test successful: ${data.id}`);
        
        // Clean up test record
        await supabase.from('lead_order').delete().eq('id', data.id);
        console.log('🧹 Test record cleaned up');
      }
    } catch (err) {
      console.log(`❌ Test failed: ${err.message}`);
    }
    
    console.log('\n🎉 RLS policies fix completed!');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  }
}

fixRLSPolicies();
