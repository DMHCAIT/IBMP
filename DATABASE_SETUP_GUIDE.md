# 🚀 COMPLETE DATABASE SETUP GUIDE

## ⚡ Quick Start (3 Steps)

### **Step 1: Run the Setup Command**
```bash
npm run setup
```

This will:
- ✅ Connect to your Supabase database
- ✅ Create the `assessment_exam_papers` table
- ✅ Add `paper_id` columns to existing tables
- ✅ Create 3 default exam papers
- ✅ Set up all indexes and security policies

### **Step 2: If Manual Migration is Needed**
If the automated setup asks you to manually apply the migration:

1. Go to: **https://app.supabase.com**
2. Select your **IBMP project**
3. Go to: **SQL Editor** (left sidebar)
4. Click: **New Query** (top right)
5. Copy the SQL from the setup script output
6. **Paste** into the SQL Editor
7. Click: **RUN** button (blue play icon)
8. After completion, run: `npm run setup` again

### **Step 3: Start Using It**
```bash
npm run dev
```

Go to: **http://localhost:3000/admin/assessment**

---

## ✨ What You Can Do Now

### **1. Create Multiple Exam Papers**
- Admin Panel → Assessment → Manage Papers → New Paper
- Create unlimited papers (Pain Management, Cardiology, Emergency, etc.)
- Each paper gets its own URL: `/assessment-{slug}`

### **2. Manage Questions per Paper**
- Admin Panel → Assessment → Click Paper → Questions
- **Add Question** - Create new questions
- **Edit Question** - Click pencil icon to modify
- **Delete Question** - Click trash icon to remove
- **All changes save to Supabase automatically!**

### **3. Full Question Editing**
For each question, you can modify:
- ✏️ Question number
- ✏️ Question text/stem
- ✏️ Question type (MCQ, Essay, True/False, Short Answer)
- ✏️ Answer options
- ✏️ Correct answer
- ✏️ Marks/points

### **4. Manage Candidates per Paper**
- Admin Panel → Assessment → Click Paper → Candidates
- Assign candidates to specific papers
- Each candidate can only access their assigned paper
- Track which paper each candidate is taking

### **5. View Results per Paper**
- Admin Panel → Assessment → Click Paper → Results
- See all exam attempts for that paper
- View pass/fail statistics
- Track average scores
- All data specific to that paper

### **6. Configure Paper Settings**
- Admin Panel → Assessment → Click Paper → Settings
- Change paper duration, total marks, passing marks
- Enable/disable papers
- Modify exam type and attempts allowed
- All changes sync to Supabase

---

## 📋 Database Structure Created

### **New Table: `assessment_exam_papers`**
Stores metadata for each exam paper:
```
id                   → Unique identifier
name                 → Paper name (Pain Management, etc.)
slug                 → URL slug (pain-management)
description          → Paper description
duration_minutes     → Exam duration
total_questions      → Number of questions
total_marks          → Total marks available
passing_marks        → Marks needed to pass
passing_percentage   → Percentage needed to pass
exam_type            → Standard/Advanced/Specialist
max_attempts         → How many times candidate can attempt
is_active            → Paper enabled/disabled
created_at, updated_at → Timestamps
```

### **Modified Tables**
Added `paper_id` column to:
- `assessment_candidates` - Links candidates to papers
- `assessment_questions` - Links questions to papers
- `assessment_attempts` - Tracks which paper was attempted
- `assessment_results` - Results per paper

### **Performance Indexes Created**
- `idx_assessment_exam_papers_slug` - Fast lookup by URL
- `idx_assessment_exam_papers_is_active` - Fast filtering
- `idx_assessment_candidates_paper_id` - Fast candidate lookup
- `idx_assessment_questions_paper_id` - Fast question lookup
- `idx_assessment_attempts_paper_id` - Fast results lookup

---

## 🔄 Complete Workflow Example

### **Scenario: Add a new exam paper with questions**

#### 1️⃣ Create the Paper
```
Go to: Admin → Assessment → Manage Papers
Click: New Paper
Enter:
  Name: Clinical Cardiology
  Duration: 120 minutes
  Total Questions: 60
  Total Marks: 80
  Passing Marks: 50
Click: Create Paper
```

#### 2️⃣ Add Questions
```
Click: Clinical Cardiology (in sidebar, it expands)
Click: Questions
Click: Add Question
Enter:
  Q#: 1
  Type: MCQ
  Question: A patient presents with chest pain...
  Options:
    A: Acute MI
    B: Angina
    C: GERD
    D: Pulmonary Embolism
  Correct Answer: A
  Marks: 1
Click: Add Question
Repeat for 60 questions...
```

All questions are **automatically saved to Supabase** as you add them!

#### 3️⃣ Create Candidates for This Paper
```
Click: Candidates (under Clinical Cardiology)
Click: Add Candidate
Enter:
  Name: Dr. Smith
  Enrollment ID: IBMP-001
  Password: (generate one)
  Email: smith@example.com
  Exam Paper: Clinical Cardiology ← Select THIS paper!
Click: Add Candidate
```

Candidate is **automatically assigned to this paper** in Supabase!

#### 4️⃣ View Results
```
Click: Results (under Clinical Cardiology)
See: All exam attempts for THIS paper only
Analytics: Pass rate, average score for this paper
```

#### 5️⃣ Manage Paper Settings
```
Click: Settings (under Clinical Cardiology)
Edit: Duration, marks, passing criteria
Save: Changes sync to Supabase automatically!
```

---

## 🎯 Admin Panel Navigation

```
Admin Dashboard
│
└── Assessment
    │
    ├── Overview ← Summary stats
    │
    ├── Manage Papers ← Create/edit/delete papers
    │
    └── EXAM PAPERS (Auto-loaded from database)
        │
        ├── 📚 Pain Management
        │   ├── Candidates ← Assign candidates
        │   ├── Results ← View results
        │   ├── Questions ← Add/edit questions
        │   └── Settings ← Configure paper
        │
        ├── 📚 Clinical Cardiology
        │   ├── Candidates
        │   ├── Results
        │   ├── Questions
        │   └── Settings
        │
        └── 📚 Emergency Medicine
            ├── Candidates
            ├── Results
            ├── Questions
            └── Settings
```

---

## ✅ All Available Commands

| Command | Purpose |
|---------|---------|
| `npm run setup` | Auto-apply migration and create papers |
| `npm run setup:db` | Alternative setup script |
| `npm run setup:assessment` | Setup assessment system |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |

---

## 📝 Important Notes

### **Database Synchronization**
- ✅ All changes made in admin panel automatically save to Supabase
- ✅ No manual SQL needed for CRUD operations
- ✅ Changes appear immediately across the system

### **Data Isolation**
- ✅ Each paper has its own questions
- ✅ Each candidate assigned to one paper only
- ✅ Results tracked per paper
- ✅ No cross-contamination between papers

### **Security**
- ✅ Row Level Security (RLS) enabled
- ✅ Admin authentication required
- ✅ Service role key needed for setup only
- ✅ Candidate access controlled by paper assignment

### **Scalability**
- ✅ Can create unlimited papers
- ✅ Can add unlimited questions per paper
- ✅ Can assign unlimited candidates
- ✅ Performance optimized with indexes

---

## 🐛 Troubleshooting

### **Problem: "Tables not found" error**
**Solution:** Run `npm run setup` to apply migration

### **Problem: Questions don't save**
**Solution:** 
1. Check Supabase connection
2. Verify SERVICE_ROLE_KEY in .env.local
3. Check browser console for errors

### **Problem: Can't create paper**
**Solution:**
1. Migration may not be applied
2. Run `npm run setup`
3. If that fails, apply migration manually via Supabase SQL Editor

### **Problem: Edit button doesn't work**
**Solution:**
1. Refresh the page
2. Check that question data is valid
3. Try deleting and re-adding the question

---

## 🚀 Production Deployment

When deploying to production:

1. **Set environment variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Run migration once:**
   ```bash
   npm run setup
   ```

3. **Deploy normally:**
   ```bash
   npm run build
   ```

4. **Admin panel will work immediately!**

---

## 📞 Support

If you encounter issues:

1. **Check .env.local** - Credentials must be set
2. **Check Supabase status** - Verify project is running
3. **Check migrations** - Ensure SQL was executed
4. **Check browser console** - Look for error messages
5. **Restart app** - Sometimes needed after migrations

---

## ✨ Summary

You now have a **fully functional multi-paper assessment system** where:

✅ Create unlimited exam papers
✅ Each paper has separate questions, candidates, results
✅ Questions can be fully edited/modified in admin panel
✅ All changes automatically sync to Supabase
✅ Candidates assigned to specific papers
✅ Results tracked per paper
✅ Settings configurable per paper

**Status:** Ready to use! 🎉

**Next Step:** Run `npm run setup` to get started!

