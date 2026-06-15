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

CREATE POLICY "Allow service role to manage content"
  ON site_content
  FOR ALL
  USING (true)
  WITH CHECK (true)
  TO authenticated;

CREATE POLICY "Allow public to read content"
  ON site_content
  FOR SELECT
  USING (true)
  TO anon;

COMMENT ON TABLE site_content IS 'Stores website content editable via admin panel. Single record (id=main) contains all site content.';
```

Alternatively, you can use the Supabase CLI:
```bash
supabase db push
```

### 2. Verify Environment Variables

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

## Troubleshooting

If you see "ENOENT: no such file or directory":
- Ensure the migration SQL has been run in Supabase
- Check that `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel environment variables

If saves aren't persisting:
- Check browser console for detailed error messages
- Verify Supabase credentials in Vercel environment settings
- Check Supabase dashboard for any RLS policy issues
