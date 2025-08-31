// Test script to check environment variable loading

import { readFileSync } from 'fs';

console.log('🔍 Testing environment variable loading...');

// Method 1: Direct file reading
try {
  const envContent = readFileSync('.env', 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim().replace(/"/g, '');
    }
  });
  
  console.log('📁 Direct file reading:');
  console.log('  VITE_STORAGE_BUCKET:', env.VITE_STORAGE_BUCKET);
  console.log('  VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('  VITE_ENABLE_UPLOAD:', env.VITE_ENABLE_UPLOAD);
} catch (err) {
  console.error('❌ Error reading .env file:', err.message);
}

// Method 2: Process env
console.log('\n📁 Process.env:');
console.log('  VITE_STORAGE_BUCKET:', process.env.VITE_STORAGE_BUCKET);
console.log('  VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('  VITE_ENABLE_UPLOAD:', process.env.VITE_ENABLE_UPLOAD);

// Method 3: Import meta env (Vite)
console.log('\n📁 Import.meta.env (Vite):');
try {
  // This will only work in Vite context
  console.log('  Note: This script runs in Node.js, not Vite');
  console.log('  In Vite, import.meta.env would contain the variables');
} catch (err) {
  console.log('  ❌ import.meta.env not available in Node.js context');
}

console.log('\n💡 If VITE_STORAGE_BUCKET is missing, Vite might not be loading .env correctly');
console.log('   Try restarting the dev server after modifying .env');
