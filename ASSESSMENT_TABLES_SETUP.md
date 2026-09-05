# 🚀 Create Assessment Database Tables in Supabase

## Quick Start (2 minutes)

You need to run the SQL migration to create the assessment database tables. Here's how:

### Method 1: Supabase Dashboard (Easiest for Windows) ✅

**Step 1: Go to Supabase Dashboard**
- Open: https://supabase.com/dashboard
- Log in with your credentials

**Step 2: Select Your Project**
- Click on your **IBMP** project
- Wait for the dashboard to load

**Step 3: Open SQL Editor**
- In the left sidebar, look for **"SQL Editor"** 
- Click on it (It's below Authentication, Database, Storage sections)

**Step 4: Create New Query**
- Click the **"+ New Query"** button (top right area)
- This opens a new SQL editor window

**Step 5: Copy SQL**
- Copy ALL the SQL below this section
- Or open the file: `migrations/004_create_assessment_tables.sql`
- Select all (Ctrl+A) and copy (Ctrl+C)

**Step 6: Paste into Supabase**
- Paste the SQL into the Supabase SQL editor (Ctrl+V)
- Make sure ALL the SQL is pasted

**Step 7: Execute**
- Click the **"Run"** button (plays icon, top right)
- Wait for confirmation - you should see "Success" messages

**Step 8: Verify**
- In the left sidebar, click **"Tables"**
- You should now see these new tables:
  - ✓ assessment_candidates
  - ✓ assessment_attempts
  - ✓ assessment_responses
  - ✓ assessment_question_images
  - ✓ assessment_settings

### SQL to Run

Copy and paste this SQL into Supabase SQL Editor:

```sql
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

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id ON assessment_responses(candidate_id);
CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id ON assessment_question_images(question_id);

-- Enable Row Level Security (RLS)
ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admin/Service Role Access
CREATE POLICY "assessment_candidates_all" ON assessment_candidates FOR ALL USING (true);
CREATE POLICY "assessment_attempts_all" ON assessment_attempts FOR ALL USING (true);
CREATE POLICY "assessment_responses_all" ON assessment_responses FOR ALL USING (true);
CREATE POLICY "assessment_question_images_all" ON assessment_question_images FOR ALL USING (true);
CREATE POLICY "assessment_settings_all" ON assessment_settings FOR ALL USING (true);

-- Insert Default Settings
INSERT INTO assessment_settings (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description)
VALUES ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes')
ON CONFLICT (exam_type) DO NOTHING;
```

---

## After Running the SQL

### ✅ Verify Success
Your admin features will now work:
1. ✓ Add candidates at: http://localhost:3000/admin/assessment/candidates
2. ✓ View results at: http://localhost:3000/admin/assessment/results
3. ✓ Edit questions at: http://localhost:3000/admin/assessment/questions
4. ✓ Update settings at: http://localhost:3000/admin/assessment/settings

### 📸 Test with Sample Candidate
1. Go to: http://localhost:3000/admin/assessment/candidates
2. Click "Add Candidate"
3. Fill in:
   - **Full Name**: Dr. Test
   - **Enrollment ID**: TEST-001
   - **Password**: Test@123
   - **Email**: test@example.com
   - **Phone**: 9999999999
4. Click "Add Candidate"
5. You should see the candidate appear in the table below ✅

### 🖼️ Image Support
The `assessment_question_images` table is ready to store image data for questions:
- Images can be uploaded to Supabase storage bucket
- Each image can be linked to specific questions
- Supports JPEG, PNG, GIF, WebP formats
- Stores metadata: title, description, size, MIME type

### ❓ Troubleshooting

**Error: "already exists"**
- This is normal! It means the tables were already created
- The `IF NOT EXISTS` clause prevents duplicate creation
- Your data is safe

**Error: "relation does not exist"**
- Make sure you ran ALL the SQL above
- Try running just the CREATE TABLE statements first
- Then run the indexes and RLS policies separately

**Can't see the new tables?**
- Refresh the Supabase dashboard (F5)
- Click on "Tables" in the left sidebar
- The 5 new tables should appear

### 📞 Need Help?
If you encounter issues:
1. Try running the SQL again via Supabase Dashboard
2. Check that all SQL is copied correctly
3. Ensure you're logged into the correct Supabase project
4. Verify your internet connection

---

## Database Schema Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **assessment_candidates** | Store student/candidate information | enrollment_id, password, email, phone |
| **assessment_attempts** | Track exam attempts and scores | candidate_id, started_at, status, total_score |
| **assessment_responses** | Store individual answers | attempt_id, question_id, response_text, is_correct, marks_obtained |
| **assessment_question_images** | Store question images & metadata | question_id, image_url, image_title, description |
| **assessment_settings** | Configure exam parameters | exam_type, duration_minutes, total_marks, passing_marks |

---

## Features Enabled After Setup ✨

- ✅ Add candidates with enrollment IDs and passwords
- ✅ Track assessment attempts (one attempt per candidate)
- ✅ Store all candidate responses automatically
- ✅ Support for image-based questions
- ✅ Calculate and store scores
- ✅ View results and review responses in admin panel
- ✅ Configure exam settings (duration, marks, passing criteria)
- ✅ Flag questions for manual review

---

**Ready to go! Once tables are created, everything will work automatically.** 🚀
