# Supabase Storage Setup Guide

## Problem
The image and video upload feature requires a properly configured Supabase storage bucket. If uploads are failing, it's likely because:
1. The `public` bucket doesn't exist
2. The bucket isn't set to public access
3. Bucket policies don't allow public uploads

## Solution: Create and Configure Public Bucket

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **IBMP** (URL: https://app.supabase.com/project/nfpvilygpjosfujdpcdg)
3. Go to **Storage** section in the left sidebar

### Step 2: Create Public Bucket (if it doesn't exist)
1. Click **Create Bucket** button
2. Enter bucket name: `public`
3. **IMPORTANT**: Enable **"Public bucket"** toggle/checkbox
4. Click **Create Bucket**

### Step 3: Configure Bucket Policies
After creating the bucket, you need to set up access policies:

1. Click on the `public` bucket to open it
2. Go to **Policies** tab
3. Add the following policies:

#### Policy 1: Allow Anonymous Select (Read)
```
-- Allow public read access
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public');
```

#### Policy 2: Allow Authenticated Insert (Upload)
```
-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'public' AND auth.role() = 'authenticated');
```

#### Policy 3: Allow Service Role (Admin Upload)
```
-- Allow service role to upload
CREATE POLICY "Allow service role upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'public' AND auth.role() = 'service_role');
```

**OR** (Simpler option) - Allow all uploads:
```
-- Allow all uploads
CREATE POLICY "Allow all upload" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'public');
```

### Step 4: Verify via Supabase Dashboard

In Supabase Dashboard > Storage:
- [ ] Bucket named `public` exists
- [ ] Bucket shows as "Public" (public icon visible)
- [ ] Upload a test file to verify it works
- [ ] Copy the public URL and verify it's accessible in browser

## Testing the Setup

### Manual Upload Test
1. Go to Supabase Dashboard > Storage > public bucket
2. Click **Upload File**
3. Select a test image (JPG, PNG, etc.)
4. After upload, right-click the file and "Copy public URL"
5. Paste URL in browser - image should display

### Via Admin Panel
1. Go to http://localhost:3000/admin/courses
2. Click Edit on any course
3. Scroll to Image field
4. Click **Upload** button
5. Select a test image
6. Should see success and URL in the field
7. Click **Save Changes**

## Troubleshooting

### "Project not found" or 404 errors
- Verify Supabase URL is correct: `https://nfpvilygpjosfujdpcdg.supabase.co`
- Check that .env.local has correct NEXT_PUBLIC_SUPABASE_URL

### "Bucket does not exist"
- Go to Supabase Dashboard > Storage
- Create the `public` bucket if it doesn't exist
- Ensure "Public bucket" toggle is enabled

### "401 Unauthorized"
- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local is correct
- The key should start with `eyJhbGci...`

### "Permission denied"
- In Supabase Dashboard, check bucket policies
- Add policies that allow public read + authenticated upload

### Upload works but file not accessible
- Check that bucket is marked as "Public"
- Verify public URL format is: `https://nfpvilygpjosfujdpcdg.supabase.co/storage/v1/object/public/public/filename`
- Test the URL directly in browser

## Supabase Project Details

- **Project ID**: `nfpvilygpjosfujdpcdg`
- **Project URL**: `https://nfpvilygpjosfujdpcdg.supabase.co`
- **Storage Base Path**: `/storage/v1/object/public/`
- **Bucket Name**: `public`

## Quick Copy-Paste Setup

If the manual setup didn't work, try this SQL in Supabase SQL Editor:

```sql
-- First, create the public bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Update existing bucket to be public
UPDATE storage.buckets SET public = true WHERE id = 'public';

-- Add public read policy
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'public');

-- Add public upload policy  
CREATE POLICY "Public Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public');
```

Run this SQL:
1. Supabase Dashboard > SQL Editor
2. Paste the SQL above
3. Click **Run**

## Verify Installation

After setup, run this test:

```javascript
// In browser console on admin page
const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
const supabase = createClient(
  'https://nfpvilygpjosfujdpcdg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNjg1MzAsImV4cCI6MjA4NjY0NDUzMH0.KWRtvmlHRUDUDXwGvKM-YUT9z6hHY3SFWfMcCABP6vo'
);

// Test list files
const { data, error } = await supabase.storage.from('public').list();
console.log('List result:', { data, error });

// Try upload a test file
const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
const { error: uploadErr } = await supabase.storage.from('public').upload('test-' + Date.now() + '.txt', testFile);
console.log('Upload result:', { uploadErr });
```

## Support

If issues persist:
1. Check Supabase status page: https://status.supabase.com
2. Review .env.local credentials
3. Check browser console for detailed error messages
4. Check Supabase logs: Dashboard > Logs > API
