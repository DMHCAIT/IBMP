# 🔧 MANUAL DATABASE SETUP REQUIRED

## Problem
The `assessment_exam_papers` table does not exist in your Supabase database yet.

## Solution (2 Minutes)

### Step 1: Go to Supabase Dashboard
```
https://app.supabase.com
```

### Step 2: Select Your Project
- Click on your **IBMP** project

### Step 3: Open SQL Editor
- Left sidebar → **SQL Editor**
- Click **New Query** (top right)

### Step 4: Copy & Paste This SQL

```sql
-- Create the assessment_exam_papers table
CREATE TABLE IF NOT EXISTS public.assessment_exam_papers (
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

-- Enable Row Level Security
ALTER TABLE assessment_exam_papers ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "exam_papers_are_public" ON assessment_exam_papers
  FOR SELECT USING (is_active = true);

CREATE POLICY "exam_papers_admin_all" ON assessment_exam_papers
  FOR ALL USING (TRUE);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);

-- Add paper_id columns to existing tables
ALTER TABLE assessment_candidates ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

-- Create Indexes for paper_id columns
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);

-- Insert default papers
INSERT INTO assessment_exam_papers (name, slug, description, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, exam_type, max_attempts, is_active)
VALUES
  ('Pain Management', 'pain-management', 'Comprehensive pain management assessment', 120, 60, 80, 50, 62.5, 'Standard', 1, true),
  ('Clinical Cardiology', 'clinical-cardiology', 'Advanced cardiology assessment', 120, 60, 80, 50, 62.5, 'Standard', 1, true),
  ('Emergency Medicine', 'emergency-medicine', 'Emergency medicine assessment', 120, 60, 80, 50, 62.5, 'Standard', 1, true)
ON CONFLICT (slug) DO NOTHING;
```

### Step 5: Run the SQL
- Click the **RUN** button (blue play icon at bottom right)
- Wait for the success message

### Step 6: Done! ✅
Now go back to your browser and refresh:
```
http://localhost:3000/admin/assessment/papers
```

The "Create Paper" button should now work!

---

## What This SQL Does

1. ✅ Creates `assessment_exam_papers` table
2. ✅ Enables Row Level Security (RLS)
3. ✅ Creates RLS policies for public access
4. ✅ Adds `paper_id` columns to existing tables
5. ✅ Creates performance indexes
6. ✅ Inserts 3 default exam papers:
   - Pain Management
   - Clinical Cardiology
   - Emergency Medicine

---

## After SQL Execution

### Verify It Worked
Run this check command:
```bash
node check-db.mjs
```

You should see:
```
✅ assessment_exam_papers table exists
✅ Default papers created
```

### Then You Can:
1. ✅ Create exam papers
2. ✅ Add questions to papers
3. ✅ Edit questions through admin panel
4. ✅ Assign candidates
5. ✅ View results

---

## Need Help?

If the SQL execution fails:

1. **"relation already exists" error** → That's OK! It means the table exists
2. **"permission denied" error** → Check that you have admin access to the project
3. **"syntax error" error** → Try copying the SQL again carefully

In all cases, try refreshing the page and testing if the "Create Paper" button works.

---

## Timeline

- **SQL Execution**: ~5 seconds
- **Verification**: ~2 seconds
- **Ready to use**: Immediately after SQL runs

Total time: < 1 minute

---

**Next Step:** Copy the SQL above and paste it into your Supabase SQL Editor, then run it! 🚀
