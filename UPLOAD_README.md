# Image Upload – Quickstart & Troubleshooting

## Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Upload Configuration
VITE_ENABLE_UPLOAD=true
VITE_BYPASS_ADMIN_FOR_UPLOAD=false

# Storage Configuration
VITE_STORAGE_BUCKET=images
```

## Storage Bucket Setup

1. **Create Storage Bucket**: In your Supabase dashboard, go to Storage and create a bucket named `images`
2. **Set RLS Policies**: Add the following RLS policy for the `images` bucket:

```sql
-- Allow authenticated users to upload to vehicles folder
CREATE POLICY "Allow authenticated uploads to vehicles" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = 'vehicles'
);

-- Allow public read access to images
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete own uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
```

## Quick Test

1. **Navigate to Test Page**: Go to `/admin/test-upload` in your admin panel
2. **Check Button Visibility**: The upload button should be visible with proper styling
3. **Verify Environment**: The page shows the current Supabase configuration status

## Common Issues & Solutions

### Button Not Visible

**Symptoms**: Upload button doesn't appear in the UI

**Possible Causes**:
- Environment variables not set correctly
- Upload functionality disabled (`VITE_ENABLE_UPLOAD=false`)
- Supabase configuration missing
- Admin role check failing
- CSS classes being purged by Tailwind

**Solutions**:
1. Check browser console for environment warnings
2. Verify `.env` file exists and variables are correct
3. Set `VITE_BYPASS_ADMIN_FOR_UPLOAD=true` temporarily for debugging
4. Ensure button uses stable Tailwind classes (e.g., `variant="default"`)

### Upload Fails

**Symptoms**: Button visible but upload doesn't work

**Possible Causes**:
- Storage bucket doesn't exist
- RLS policies too restrictive
- File validation failing
- Network/CORS issues

**Solutions**:
1. Verify storage bucket exists in Supabase dashboard
2. Check RLS policies allow authenticated uploads
3. Ensure file size < 10MB and type is image
4. Check browser network tab for errors

### Admin Access Denied

**Symptoms**: "Access restricted to admins" message

**Possible Causes**:
- User not authenticated
- User doesn't have admin role
- Profiles table missing or misconfigured

**Solutions**:
1. Ensure user is logged in
2. Check user role in `profiles` table
3. Set `VITE_BYPASS_ADMIN_FOR_UPLOAD=true` for testing
4. Verify profiles table structure

## Component Usage

```tsx
import { UploadGallery } from "@/components/forms/UploadGallery";

<UploadGallery
  onImagesChange={(imageUrls) => console.log(imageUrls)}
  minImages={3}
  maxImages={10}
/>
```

## File Validation

- **Supported Types**: JPEG, PNG, WebP, GIF
- **Max File Size**: 10MB
- **Max Files**: 10 (configurable)
- **Storage Path**: `images/vehicles/{timestamp}_{random}.{ext}`

## Debug Mode

Set `VITE_BYPASS_ADMIN_FOR_UPLOAD=true` to bypass admin checks for debugging upload functionality.

## Testing

Run the Playwright tests to verify upload button visibility:

```bash
npm run test:e2e
```

The tests verify:
- Button visibility on test page
- Proper error handling for disabled uploads
- Supabase configuration validation
- File input functionality
