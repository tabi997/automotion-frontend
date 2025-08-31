// Simple script to create Supabase storage bucket
// This bypasses RLS for bucket creation

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

function loadEnv() {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim().replace(/"/g, '');
      }
    });
    
    return env;
  } catch (err) {
    console.error('❌ Could not read .env file:', err.message);
    return {};
  }
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  try {
    console.log('🔧 Creating images bucket...');
    console.log('📍 URL:', supabaseUrl);
    
    // Try to create the bucket
    const { data, error } = await supabase.storage.createBucket('images', {
      public: true
    });
    
    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Images bucket already exists');
      } else {
        console.error('❌ Error creating bucket:', error.message);
        console.log('\n💡 Manual steps required:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Storage');
        console.log('3. Click "Create a new bucket"');
        console.log('4. Name it "images"');
        console.log('5. Set it as public');
        console.log('6. Run the SQL policies from supabase/storage-policies.sql');
        return;
      }
    } else {
      console.log('✅ Images bucket created successfully');
    }
    
    // Verify bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const imagesBucket = buckets.find(b => b.name === 'images');
    
    if (imagesBucket) {
      console.log('✅ Bucket verification successful');
      console.log('📋 Next: Run the SQL policies from supabase/storage-policies.sql');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

createBucket();
