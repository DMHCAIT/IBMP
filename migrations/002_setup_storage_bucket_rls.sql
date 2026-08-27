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
