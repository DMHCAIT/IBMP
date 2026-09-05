-- COPY ALL THIS SQL AND RUN IT IN SUPABASE DASHBOARD
-- Go to: https://supabase.com/dashboard
-- Select IBMP project -> SQL Editor -> + New Query -> Paste this -> Run
-- All tables will be created together in one batch

CREATE TABLE IF NOT EXISTS assessment_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  enrollment_id TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  exam_type TEXT DEFAULT 'Pain Medicine',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
  enrollment_id TEXT NOT NULL,
  started_at TIMESTAMP DEFAULT now(),
  submitted_at TIMESTAMP,
  status TEXT DEFAULT 'in-progress',
  total_score FLOAT,
  passing_score FLOAT DEFAULT 50,
  result TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_type TEXT,
  question_text TEXT,
  response_text TEXT,
  response_json JSONB,
  is_correct BOOLEAN,
  marks_obtained FLOAT DEFAULT 0,
  max_marks FLOAT DEFAULT 1,
  is_flagged BOOLEAN DEFAULT FALSE,
  reviewer_notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'mcq',
  module TEXT NOT NULL DEFAULT 'Module 1',
  stem TEXT NOT NULL,
  marks INTEGER DEFAULT 1,
  options JSONB,
  correct_answer TEXT,
  image_url TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_question_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path VARCHAR(255),
  file_size INTEGER,
  mime_type VARCHAR(50),
  uploaded_by VARCHAR(255),
  image_title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER DEFAULT 120,
  total_questions INTEGER DEFAULT 60,
  total_marks FLOAT DEFAULT 80,
  passing_marks FLOAT DEFAULT 50,
  passing_percentage FLOAT DEFAULT 62.5,
  description TEXT,
  max_attempts INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id ON assessment_responses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_question_number ON assessment_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_is_active ON assessment_questions(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id ON assessment_question_images(question_id);

ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_candidates_all" ON assessment_candidates FOR ALL USING (true);
CREATE POLICY "assessment_attempts_all" ON assessment_attempts FOR ALL USING (true);
CREATE POLICY "assessment_responses_all" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "assessment_questions_all" ON assessment_questions FOR ALL USING (true);
CREATE POLICY "assessment_question_images_all" ON assessment_question_images FOR ALL USING (true);
CREATE POLICY "assessment_settings_all" ON assessment_settings FOR ALL USING (true);

INSERT INTO assessment_settings (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description)
VALUES ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes')
ON CONFLICT (exam_type) DO NOTHING;
