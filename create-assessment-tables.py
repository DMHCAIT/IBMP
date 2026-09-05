#!/usr/bin/env python3
"""
Create assessment database tables in Supabase via direct PostgreSQL connection.
Usage: python create-assessment-tables.py
"""

import os
import sys
from urllib.parse import urlparse

# Try to import psycopg2, fall back to psycopg3
try:
    import psycopg2
    import psycopg2.extras
    PSYCOPG_VERSION = 2
except ImportError:
    try:
        import psycopg
        import psycopg.extras
        PSYCOPG_VERSION = 3
    except ImportError:
        print("❌ PostgreSQL driver not found.")
        print("   Install with: pip install psycopg2-binary")
        sys.exit(1)

def log_step(msg):
    print(f"\n📋 {msg}")

def log_info(msg):
    print(f"ℹ️  {msg}")

def log_success(msg):
    print(f"✅ {msg}")

def log_error(msg):
    print(f"❌ {msg}")

# Database connection string
DATABASE_URL = "postgresql://postgres.nfpvilygpjosfujdpcdg:Dmhcawebsite123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"

# SQL to create all tables
CREATE_TABLES_SQL = """
-- Assessment Candidates Table
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

-- Assessment Attempts Table
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

-- Assessment Responses Table
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

-- Assessment Question Images Table
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

-- Assessment Settings Table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id ON assessment_responses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id ON assessment_question_images(question_id);

-- Enable RLS
ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin/service role access
CREATE POLICY "assessment_candidates_all" ON assessment_candidates FOR ALL USING (true);
CREATE POLICY "assessment_attempts_all" ON assessment_attempts FOR ALL USING (true);
CREATE POLICY "assessment_responses_all" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "assessment_question_images_all" ON assessment_question_images FOR ALL USING (true);
CREATE POLICY "assessment_settings_all" ON assessment_settings FOR ALL USING (true);
"""

INSERT_SETTINGS_SQL = """
INSERT INTO assessment_settings (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description)
VALUES ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes')
ON CONFLICT (exam_type) DO NOTHING;
"""

def connect_to_database():
    """Create database connection"""
    try:
        if PSYCOPG_VERSION == 2:
            conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        else:
            conn = psycopg.connect(DATABASE_URL, sslmode='require')
        return conn
    except Exception as e:
        log_error(f"Failed to connect to database: {str(e)}")
        return None

def execute_sql(conn, sql, description):
    """Execute SQL statement"""
    try:
        if PSYCOPG_VERSION == 2:
            cursor = conn.cursor()
        else:
            cursor = conn.cursor()
        
        cursor.execute(sql)
        conn.commit()
        log_success(f"{description}")
        return True
    except Exception as e:
        error_msg = str(e)
        if "already exists" in error_msg.lower():
            log_success(f"{description} (already exists)")
            return True
        else:
            log_error(f"{description}: {error_msg}")
            return False

def verify_tables(conn):
    """Verify tables exist"""
    try:
        if PSYCOPG_VERSION == 2:
            cursor = conn.cursor()
        else:
            cursor = conn.cursor()
        
        tables = [
            'assessment_candidates',
            'assessment_attempts',
            'assessment_responses',
            'assessment_question_images',
            'assessment_settings'
        ]
        
        for table in tables:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            log_success(f"{table}: Ready ({count} records)")
        
        return True
    except Exception as e:
        log_error(f"Verification failed: {str(e)}")
        return False

def main():
    print("\n🚀 Assessment Database Setup - Supabase PostgreSQL")
    print("=" * 55)
    
    # Connect to database
    log_step("Connecting to Supabase Database")
    conn = connect_to_database()
    if not conn:
        print("\n❗ Connection failed. Possible solutions:")
        print("   1. Check your DATABASE_URL in .env.local")
        print("   2. Ensure your IP is whitelisted in Supabase")
        print("   3. Try running SQL via Supabase Dashboard instead")
        sys.exit(1)
    
    log_success("Connected to Supabase database")
    
    # Create tables
    log_step("Creating Assessment Tables")
    if not execute_sql(conn, CREATE_TABLES_SQL, "All assessment tables created"):
        log_error("Some tables failed to create")
        conn.close()
        sys.exit(1)
    
    # Insert default settings
    log_step("Inserting Default Assessment Settings")
    execute_sql(conn, INSERT_SETTINGS_SQL, "Default settings inserted")
    
    # Verify tables
    log_step("Verifying Database Setup")
    if verify_tables(conn):
        print("\n✨ Assessment Database Setup Completed Successfully!\n")
        print("📋 Database Structure Created:")
        print("   ✓ assessment_candidates - Store candidate information")
        print("   ✓ assessment_attempts - Track exam attempts")
        print("   ✓ assessment_responses - Store question responses")
        print("   ✓ assessment_question_images - Manage question images")
        print("   ✓ assessment_settings - Configure exam parameters\n")
        
        print("🖼️  Image Upload Support:")
        print("   ✓ assessment_question_images table ready for image management")
        print("   ✓ Can store image URLs, paths, and metadata")
        print("   ✓ Supports linking images to specific questions\n")
        
        print("🎯 Next Steps:")
        print("   1. Add candidates: http://localhost:3000/admin/assessment/candidates")
        print("   2. Start assessment: http://localhost:3000/assessment")
        print("   3. View results: http://localhost:3000/admin/assessment/results\n")
    else:
        log_error("Verification failed")
        conn.close()
        sys.exit(1)
    
    conn.close()

if __name__ == "__main__":
    main()
