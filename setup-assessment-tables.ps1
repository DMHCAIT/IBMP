#!/usr/bin/env powershell

# Setup Assessment Database Tables in Supabase
# This script executes SQL to create assessment tables

Write-Host "`n🚀 Assessment Database Setup - Supabase`n" -ForegroundColor Cyan
Write-Host ("=" * 55)

# Supabase credentials (hardcoded from .env.local)
$SUPABASE_URL = "https://nfpvilygpjosfujdpcdg.supabase.co"
$SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8"

# Create tables SQL
$createTablesSql = @"
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

CREATE TABLE IF NOT EXISTS assessment_question_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id ON assessment_question_images(question_id);

ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_candidates_all" ON assessment_candidates FOR ALL USING (true);
CREATE POLICY "assessment_attempts_all" ON assessment_attempts FOR ALL USING (true);
CREATE POLICY "assessment_responses_all" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "assessment_question_images_all" ON assessment_question_images FOR ALL USING (true);
CREATE POLICY "assessment_settings_all" ON assessment_settings FOR ALL USING (true);

INSERT INTO assessment_settings (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description)
VALUES ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes')
ON CONFLICT (exam_type) DO NOTHING;
"@

Write-Host "`n📋 Setup Method Selected: Supabase Dashboard" -ForegroundColor Yellow
Write-Host "ℹ️  Due to security restrictions, database table creation requires manual setup via Supabase Dashboard.
" -ForegroundColor Gray

Write-Host "🎯 QUICK SETUP (3 minutes):" -ForegroundColor Green
Write-Host "1. Open: https://supabase.com/dashboard"
Write-Host "2. Select 'IBMP' project"
Write-Host "3. Click 'SQL Editor' (left sidebar)"
Write-Host "4. Click '+ New Query'"
Write-Host "5. Copy and paste the SQL below:"
Write-Host "6. Click 'Run' button"

Write-Host "📋 SQL TO RUN:" -ForegroundColor Cyan
Write-Host "=" * 55
Write-Host $createTablesSql
Write-Host "=" * 55 `n

Write-Host "✅ After running the SQL, tables will appear in 'Tables' section
" -ForegroundColor Green

Write-Host "📊 Alternative: Use Setup File" -ForegroundColor Yellow
Write-Host "   Open: ASSESSMENT_TABLES_SETUP.md for detailed visual guide
"

Write-Host "🔧 Verify Setup:" -ForegroundColor Cyan
Write-Host "   1. Go to http://localhost:3000/admin/assessment/candidates"
Write-Host "   2. Try adding a candidate"
Write-Host "   3. If successful, all tables exist ✓
"

# Copy SQL to clipboard if PowerShell allows
try {
    $createTablesSql | Set-Clipboard
    Write-Host "✨ SQL has been copied to clipboard! Paste it into Supabase SQL Editor.
" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not copy to clipboard. Please copy manually from above.
" -ForegroundColor Yellow
}

Write-Host "📞 Support:" -ForegroundColor Cyan
Write-Host "   - See ASSESSMENT_TABLES_SETUP.md for complete guide"
Write-Host "   - Check Supabase dashboard for table creation status"
Write-Host "   - Email table creation errors to support if needed"
Write-Host ""
