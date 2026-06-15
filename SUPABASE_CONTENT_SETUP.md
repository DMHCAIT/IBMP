# Supabase Content Storage Setup

The content API has been migrated from filesystem storage to Supabase to work properly in serverless environments like Vercel.

## Setup Instructions

### 1. Create the `site_content` Table

Run the SQL migration in your Supabase dashboard:

1. Go to https://app.supabase.com/project/[your-project-id]/sql/new
2. Copy and paste the contents of `migrations/001_create_site_content_table.sql`
3. Click "Run"

**Or use this SQL directly:**

```sql
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_content_id ON site_content(id);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_content_all_access"
  ON site_content
  FOR ALL
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE site_content IS 'Stores website content editable via admin panel. Single record (id=main) contains all site content.';
```

### 2. Setup Storage Bucket RLS Policies

For image uploads to work, set up storage bucket permissions:

1. Go to https://app.supabase.com/project/[your-project-id]/sql/new
2. Copy and paste the contents of `migrations/002_setup_storage_bucket_rls.sql`
3. Click "Run"

**Or use this SQL directly:**

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload to public bucket
CREATE POLICY "Allow authenticated users to upload to public bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'public' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their own uploads in public bucket
CREATE POLICY "Allow authenticated users to update public bucket files"
  ON storage.objects
  FOR UPDATE
  WITH CHECK (
    bucket_id = 'public' 
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete their own uploads in public bucket
CREATE POLICY "Allow authenticated users to delete public bucket files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'public' 
    AND auth.role() = 'authenticated'
  );

-- Allow anyone to read from public bucket (public read)
CREATE POLICY "Allow public read access to public bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public');
```

### 3. Verify Environment Variables

Ensure your Vercel environment has these variables set:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin operations)

### 3. Test the Content API

After deployment, test by:
1. Navigating to your admin dashboard
2. Making changes to any page content
3. Clicking "Save"

## How It Works

- Content is stored in a `site_content` table with a single record (id='main')
- Reads are cached in-memory for 1 minute to reduce database queries
- Cache is invalidated on any write operation
- JSON serialization is sanitized to prevent non-serializable data from breaking saves
- Images are uploaded to the `public` storage bucket with proper RLS policies

## Troubleshooting

### "new row violates row-level security policy" when uploading images
- Run the storage bucket RLS migration: `migrations/002_setup_storage_bucket_rls.sql`
- Ensure the `public` bucket exists in Supabase Storage
- Verify RLS policies are set correctly in Supabase Dashboard → Storage → Policies

### "ENOENT: no such file or directory" error
- Ensure the `site_content` table migration has been run
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel environment variables

### If saves aren't persisting
- Check browser console for detailed error messages
- Visit `/api/content/health` endpoint to see Supabase connectivity status
- Verify Supabase credentials in Vercel environment settings
- Check Supabase dashboard for any RLS policy issues
