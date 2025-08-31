// Script to set up Supabase storage bucket and RLS policies
// Run this with: node scripts/setup-storage.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Read environment variables from .env file
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
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  try {
    console.log('🔧 Setting up Supabase storage...');
    console.log('📍 URL:', supabaseUrl);
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      return;
    }
    
    const imagesBucket = buckets.find(b => b.name === 'images');
    
    if (imagesBucket) {
      console.log('✅ Images bucket already exists');
    } else {
      console.log('📦 Creating images bucket...');
      
      // Create the bucket
      const { data: bucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
      });
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError.message);
        return;
      }
      
      console.log('✅ Images bucket created successfully');
    }
    
    // Create folders structure
    console.log('📁 Creating folder structure...');
    
    const folders = ['vehicles', 'profiles', 'temp'];
    
    for (const folder of folders) {
      try {
        // Create a dummy file to establish the folder
        const dummyContent = new Blob([''], { type: 'text/plain' });
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(`${folder}/.keep`, dummyContent);
        
        if (uploadError && !uploadError.message.includes('already exists')) {
          console.log(`⚠️ Could not create ${folder} folder:`, uploadError.message);
        } else {
          console.log(`✅ ${folder} folder ready`);
        }
        
        // Remove the dummy file
        await supabase.storage
          .from('images')
          .remove([`${folder}/.keep`]);
        
      } catch (err) {
        console.log(`⚠️ ${folder} folder setup:`, err.message);
      }
    }
    
    console.log('\n🎉 Storage setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard > Storage > Policies');
    console.log('2. Add the following RLS policies for the images bucket:');
    console.log('\n   -- Allow authenticated users to upload to vehicles folder');
    console.log('   CREATE POLICY "Allow authenticated uploads to vehicles" ON storage.objects');
    console.log('   FOR INSERT WITH CHECK (');
    console.log('     bucket_id = \'images\' AND');
    console.log('     auth.role() = \'authenticated\' AND');
    console.log('     (storage.foldername(name))[1] = \'vehicles\'');
    console.log('   );');
    console.log('\n   -- Allow public read access to images');
    console.log('   CREATE POLICY "Allow public read access" ON storage.objects');
    console.log('   FOR SELECT USING (bucket_id = \'images\');');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

setupStorage();
