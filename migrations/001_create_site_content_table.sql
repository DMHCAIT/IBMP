-- Create site_content table for storing website content editable via admin panel
CREATE TABLE IF NOT EXISTS site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_content_id ON site_content(id);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (admin) to manage content
CREATE POLICY "Allow service role to manage content"
  ON site_content
  FOR ALL
  USING (true)
  WITH CHECK (true)
  ROLE authenticated;

-- Policy: Allow anon users to read content (if needed for frontend)
CREATE POLICY "Allow public to read content"
  ON site_content
  FOR SELECT
  USING (true)
  ROLE anon;

-- Add comment to table
COMMENT ON TABLE site_content IS 'Stores website content editable via admin panel. Single record (id=main) contains all site content.';
