-- Add image_data column to store actual image binary data in database
-- This migration allows storing images directly in the database instead of external storage

ALTER TABLE assessment_question_images
ADD COLUMN IF NOT EXISTS image_data BYTEA,
ADD COLUMN IF NOT EXISTS image_data_base64 TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assessment_question_images_with_data 
ON assessment_question_images(question_id) 
WHERE image_data IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN assessment_question_images.image_data IS 'Binary image data stored directly in database';
COMMENT ON COLUMN assessment_question_images.image_data_base64 IS 'Base64 encoded image data for easier transmission';
