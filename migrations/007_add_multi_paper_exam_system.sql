-- Multi-Paper Exam System Database Schema
-- This migration enables support for multiple exam papers with different questions

-- 1. Create assessment_exam_papers table to store paper metadata
CREATE TABLE IF NOT EXISTS assessment_exam_papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  duration_minutes INTEGER DEFAULT 120,
  total_questions INTEGER DEFAULT 60,
  total_marks FLOAT DEFAULT 80,
  passing_marks FLOAT DEFAULT 50,
  passing_percentage FLOAT DEFAULT 62.5,
  exam_type TEXT DEFAULT 'Standard',
  max_attempts INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. Update assessment_candidates table to include paper_id
ALTER TABLE assessment_candidates
ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

-- 3. Update assessment_questions to include paper_id
ALTER TABLE assessment_questions
ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

-- 4. Update assessment_attempts to track which paper was attempted
ALTER TABLE assessment_attempts
ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

-- 5. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);

-- 6. Enable RLS on new table
ALTER TABLE assessment_exam_papers ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for assessment_exam_papers
CREATE POLICY "exam_papers_are_public" ON assessment_exam_papers
  FOR SELECT USING (is_active = true);

CREATE POLICY "exam_papers_admin_all" ON assessment_exam_papers
  FOR ALL USING (TRUE);

-- Add comments for documentation
COMMENT ON TABLE assessment_exam_papers IS 'Stores metadata for different exam papers (Pain Management, Clinical Cardiology, etc.)';
COMMENT ON COLUMN assessment_exam_papers.slug IS 'URL-friendly identifier (e.g., "pain-management", "clinical-cardiology")';
COMMENT ON COLUMN assessment_exam_papers.name IS 'Display name of the paper (e.g., "Pain Management")';
COMMENT ON COLUMN assessment_candidates.paper_id IS 'Reference to the exam paper this candidate will attempt';
COMMENT ON COLUMN assessment_questions.paper_id IS 'Reference to which paper this question belongs to';
COMMENT ON COLUMN assessment_attempts.paper_id IS 'Reference to which paper was attempted in this attempt';
