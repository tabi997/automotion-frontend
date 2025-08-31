-- Storage RLS Policies for images bucket
-- Run these in your Supabase SQL editor after creating the bucket

-- First, create the bucket manually in Supabase dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "Create a new bucket"
-- 3. Name it "images"
-- 4. Set it as public
-- 5. Enable RLS

-- Then run these policies:

-- Allow authenticated users to upload to vehicles folder
CREATE POLICY "Allow authenticated uploads to vehicles" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'vehicles'
);

-- Allow authenticated users to upload to profiles folder
CREATE POLICY "Allow authenticated uploads to profiles" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'profiles'
);

-- Allow authenticated users to upload to temp folder
CREATE POLICY "Allow authenticated uploads to temp" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'temp'
);

-- Allow public read access to all images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow users to delete their own uploads (optional)
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Allow users to update their own uploads (optional)
CREATE POLICY "Allow users to update own uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);

-- Disable RLS temporarily for bucket creation (run this first if needed)
-- ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS after bucket creation
-- ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
