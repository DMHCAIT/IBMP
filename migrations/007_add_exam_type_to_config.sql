-- Migration: Add exam_type and exam_title to assessment_config table
-- This allows admins to customize the exam type/title

ALTER TABLE assessment_config ADD COLUMN IF NOT EXISTS exam_type TEXT DEFAULT 'Pain Medicine';
ALTER TABLE assessment_config ADD COLUMN IF NOT EXISTS exam_title TEXT DEFAULT 'Pain Medicine (Set A)';

-- Update the default record with initial values
UPDATE assessment_config 
SET 
  exam_type = 'Pain Medicine',
  exam_title = 'Pain Medicine (Set A)',
  updated_at = NOW()
WHERE id = 'default';
