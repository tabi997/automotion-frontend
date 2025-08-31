// Script to create Supabase storage bucket using REST API
// This bypasses client-side RLS restrictions

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

async function createBucketViaAPI() {
  try {
    console.log('🔧 Creating images bucket via REST API...');
    console.log('📍 URL:', supabaseUrl);
    
    // Extract project ID from URL
    const projectId = supabaseUrl.split('//')[1].split('.')[0];
    console.log('🆔 Project ID:', projectId);
    
    // Create bucket via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/storage/buckets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'X-Client-Info': 'supabase-js/2.0.0'
      },
      body: JSON.stringify({
        id: 'images',
        name: 'images',
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Bucket created successfully:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', response.status, errorText);
      
      if (response.status === 409) {
        console.log('✅ Bucket already exists (409 Conflict)');
      } else {
        console.log('\n💡 Manual creation required:');
        console.log('1. Go to your Supabase dashboard');
        console.log('2. Navigate to Storage');
        console.log('3. Click "Create a new bucket"');
        console.log('4. Name it "images"');
        console.log('5. Set it as public');
        console.log('6. Run the SQL policies from supabase/storage-policies.sql');
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.log('\n💡 Manual creation required:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to Storage');
    console.log('3. Click "Create a new bucket"');
    console.log('4. Name it "images"');
    console.log('5. Set it as public');
    console.log('6. Run the SQL policies from supabase/storage-policies.sql');
  }
}

createBucketViaAPI();
