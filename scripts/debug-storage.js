// Debug script to check Supabase authentication and storage access

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

async function debugStorage() {
  try {
    console.log('🔍 Debugging Supabase storage access...');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key length:', supabaseKey.length);
    console.log('📦 Configured bucket:', env.VITE_STORAGE_BUCKET);
    
    // Test basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else {
      console.log('✅ Auth connection successful');
      console.log('👤 User:', user ? user.id : 'Not authenticated');
    }
    
    // Test storage access
    console.log('\n2️⃣ Testing storage access...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Storage list error:', listError.message);
      console.log('🔍 Error details:', JSON.stringify(listError, null, 2));
    } else {
      console.log('✅ Storage access successful');
      console.log('📦 All buckets:', buckets.map(b => ({ name: b.name, public: b.public })));
      
      if (buckets.length === 0) {
        console.log('⚠️ No buckets found - this might indicate a permissions issue');
      }
    }
    
    // Test specific bucket access
    console.log('\n3️⃣ Testing specific bucket access...');
    const targetBucket = env.VITE_STORAGE_BUCKET || 'vehicle-images';
    
    try {
      const { data: files, error: bucketError } = await supabase.storage
        .from(targetBucket)
        .list('', { limit: 1 });
      
      if (bucketError) {
        console.log(`❌ Cannot access bucket '${targetBucket}':`, bucketError.message);
      } else {
        console.log(`✅ Successfully accessed bucket '${targetBucket}'`);
        console.log(`📁 Files in bucket:`, files.length);
      }
    } catch (err) {
      console.log(`❌ Exception accessing bucket '${targetBucket}':`, err.message);
    }
    
    // Test bucket creation (this will fail if bucket exists, which is expected)
    console.log('\n4️⃣ Testing bucket creation (expected to fail if exists)...');
    try {
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('test-bucket-debug', {
        public: true
      });
      
      if (createError) {
        console.log('❌ Bucket creation failed (expected):', createError.message);
      } else {
        console.log('✅ Test bucket created (unexpected):', newBucket);
        // Clean up test bucket
        await supabase.storage.removeBucket('test-bucket-debug');
      }
    } catch (err) {
      console.log('❌ Exception during bucket creation test:', err.message);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error('🔍 Full error:', err);
  }
}

debugStorage();
