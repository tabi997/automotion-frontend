// Script to check and create Supabase storage bucket
// Run this with: node scripts/check-storage.js

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

async function checkStorage() {
  try {
    console.log('🔍 Checking Supabase storage...');
    console.log('📍 URL:', supabaseUrl);
    
    // List all buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error listing buckets:', error.message);
      return;
    }
    
    console.log('📦 Existing buckets:', buckets.map(b => b.name));
    
    // Check if configured bucket exists
    const configuredBucket = env.VITE_STORAGE_BUCKET || 'vehicle-images';
    const targetBucket = buckets.find(b => b.name === configuredBucket);
    
    if (targetBucket) {
      console.log(`✅ Bucket '${configuredBucket}' already exists`);
      
      // List files in the bucket
      const { data: files, error: filesError } = await supabase.storage
        .from(configuredBucket)
        .list('', { limit: 100 });
      
      if (filesError) {
        console.log(`⚠️ Could not list files:`, filesError.message);
      } else {
        console.log(`📁 Files in ${configuredBucket} bucket:`, files.length);
      }
    } else {
      console.log(`❌ Bucket '${configuredBucket}' not found`);
      console.log('💡 You need to create the bucket manually in Supabase dashboard:');
      console.log(`   1. Go to Storage in your Supabase dashboard`);
      console.log(`   2. Click "Create a new bucket"`);
      console.log(`   3. Name it "${configuredBucket}"`);
      console.log(`   4. Set it as public`);
      console.log(`   5. Add RLS policies for authenticated uploads`);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

checkStorage();
