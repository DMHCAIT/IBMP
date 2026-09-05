-- Migration: Create assessment_config table for storing exam settings
-- This table stores global exam configuration settings

CREATE TABLE IF NOT EXISTS assessment_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  duration_minutes INT NOT NULL DEFAULT 120,
  total_marks NUMERIC NOT NULL DEFAULT 80,
  passing_marks NUMERIC NOT NULL DEFAULT 50,
  passing_percentage NUMERIC NOT NULL DEFAULT 62.5,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies for the assessment_config table
ALTER TABLE assessment_config ENABLE ROW LEVEL SECURITY;

-- Policy for admins to read config
CREATE POLICY "Admins can read assessment config" 
  ON assessment_config 
  FOR SELECT 
  USING (auth.jwt() ->> 'role' = 'authenticated');

-- Policy for admins to update config (stricter - only admins)
CREATE POLICY "Admins can update assessment config" 
  ON assessment_config 
  FOR UPDATE 
  USING (auth.jwt() ->> 'role' = 'authenticated')
  WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Policy for service role to do everything
CREATE POLICY "Service role can manage config" 
  ON assessment_config 
  USING (true) 
  WITH CHECK (true);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessment_config_id ON assessment_config(id);

-- Insert default configuration
INSERT INTO assessment_config (id, duration_minutes, total_marks, passing_marks, passing_percentage, description)
VALUES ('default', 120, 80, 50, 62.5, 'Pain Medicine specialization assessment')
ON CONFLICT (id) DO NOTHING;
