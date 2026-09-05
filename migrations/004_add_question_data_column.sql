-- Add question_data JSONB column to store complete question structure from exam.seed.json
ALTER TABLE assessment_questions
ADD COLUMN IF NOT EXISTS question_data JSONB DEFAULT NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_questions_data ON assessment_questions USING GIN (question_data);

-- Update RLS policy to allow access to the new column
-- The existing policies should automatically apply
