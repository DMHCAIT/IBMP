-- Assessment Candidates Table
-- Stores candidate information and their assessment access details
CREATE TABLE IF NOT EXISTS assessment_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  enrollment_id TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  exam_type TEXT DEFAULT 'Pain Medicine (Set A)',
  status TEXT DEFAULT 'active', -- active, inactive, completed
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Assessment Attempts Table
-- Tracks each time a candidate attempts an assessment
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
  enrollment_id TEXT NOT NULL,
  started_at TIMESTAMP DEFAULT now(),
  submitted_at TIMESTAMP,
  status TEXT DEFAULT 'in-progress', -- in-progress, completed
  total_score FLOAT,
  passing_score FLOAT DEFAULT 50,
  result TEXT, -- passed, failed
  created_at TIMESTAMP DEFAULT now()
);

-- Assessment Responses Table
-- Stores individual question responses from candidates
CREATE TABLE IF NOT EXISTS assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_type TEXT, -- mcq, image, short-answer
  response_text TEXT,
  response_json JSONB, -- for complex responses like image-based parts
  is_correct BOOLEAN,
  marks_obtained FLOAT,
  max_marks FLOAT,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Assessment Settings Table
-- Stores exam settings (duration, passing score, etc.)
CREATE TABLE IF NOT EXISTS assessment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_type TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER DEFAULT 120,
  total_questions INTEGER DEFAULT 60,
  total_marks FLOAT DEFAULT 80,
  passing_marks FLOAT DEFAULT 50,
  passing_percentage FLOAT DEFAULT 62.5,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id ON assessment_responses(candidate_id);

-- Enable RLS (Row Level Security) for security
ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated admin access
CREATE POLICY "assessment_candidates_read" ON assessment_candidates
  FOR SELECT USING (true);

CREATE POLICY "assessment_attempts_read" ON assessment_attempts
  FOR SELECT USING (true);

CREATE POLICY "assessment_responses_read" ON assessment_responses
  FOR SELECT USING (true);

CREATE POLICY "assessment_settings_read" ON assessment_settings
  FOR SELECT USING (true);
