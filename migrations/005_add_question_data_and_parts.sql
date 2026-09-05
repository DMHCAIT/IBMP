-- Add question_data and parts columns to assessment_questions table
-- This allows storing complete question structure from exam.seed.json including:
-- - parts (for image-based multi-part questions)
-- - scoring rubric with expected answers
-- - asset information

ALTER TABLE assessment_questions
ADD COLUMN IF NOT EXISTS question_data JSONB DEFAULT NULL;

-- Update RLS policy to allow access to the new column
-- The existing policies should automatically apply

-- Create index for better query performance on question_data
CREATE INDEX IF NOT EXISTS idx_assessment_questions_data ON assessment_questions USING GIN (question_data);

-- Add column to store expected answers for short-answer questions
ALTER TABLE assessment_responses
ADD COLUMN IF NOT EXISTS expected_answer TEXT DEFAULT NULL;

-- Add column to store admin's entered answer for scoring
ALTER TABLE assessment_responses
ADD COLUMN IF NOT EXISTS admin_answer TEXT DEFAULT NULL;

-- Add column to store admin's comments for manual scoring
ALTER TABLE assessment_responses
ADD COLUMN IF NOT EXISTS admin_notes TEXT DEFAULT NULL;

-- Create indexes for faster response lookups
CREATE INDEX IF NOT EXISTS idx_assessment_responses_question_type ON assessment_responses(question_type);
