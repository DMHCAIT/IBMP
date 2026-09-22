# 🎉 Multi-Paper System Setup Guide - Complete Implementation

## Overview

Your system now supports **multiple exam papers with different URLs, each using existing questions but fully modifiable through the admin panel**.

### Key Features:
✅ Papers accessible at `/assessment-{paper-name}` URLs  
✅ Use existing questions from database  
✅ Modify questions through admin panel  
✅ Changes reflect immediately on assessment pages  
✅ Same 60-question format for all papers  
✅ No 404 errors - all dynamic routes work  

---

## 🚀 Step-by-Step Setup

### Step 1: Apply Database Migration (CRITICAL)

This adds the `paper_id` field to link questions to papers.

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Open the file: `migrations/007_add_multi_paper_exam_system.sql`
5. Copy the entire contents
6. Paste into Supabase SQL Editor
7. Click **Run**
8. Wait for confirmation "Query successful"

**Option B: Via Command Line (if you have psql)**
```bash
psql postgresql://[user]:[password]@db.supabase.co:5432/postgres \
  -f migrations/007_add_multi_paper_exam_system.sql
```

**Verify Migration Applied:**
```sql
-- Run this in Supabase SQL Editor to verify
SELECT COUNT(*) FROM assessment_exam_papers;
```

Should return: `1 row | count: 0` (table exists and is empty)

---

### Step 2: Initialize Papers and Link Questions

Run the setup script to:
- Create initial exam papers
- Link existing questions to each paper
- Verify everything works

```bash
node setup-papers-with-existing-questions.mjs
```

**Expected Output:**
```
✅ Found 60 existing questions
✅ Created: Pain Management
✅ Created: Clinical Cardiology
✅ Created: Emergency Medicine
✅ Linked 60 questions to: pain-management
✅ Linked 60 questions to: clinical-cardiology
✅ Linked 60 questions to: emergency-medicine
```

---

### Step 3: Start Application

```bash
npm run dev
```

Application runs at: `http://localhost:3000`

---

### Step 4: Test Assessment Pages (No 404 Errors)

Visit these URLs in your browser - they should **NOT show 404 errors**:

1. **Pain Management**
   - URL: `http://localhost:3000/assessment-pain-management`
   - Status: Should load the assessment page with all 60 questions

2. **Clinical Cardiology**
   - URL: `http://localhost:3000/assessment-clinical-cardiology`
   - Status: Should load the assessment page with all 60 questions

3. **Emergency Medicine**
   - URL: `http://localhost:3000/assessment-emergency-medicine`
   - Status: Should load the assessment page with all 60 questions

**If you see 404 errors**, go back to Step 1 and verify the migration was applied correctly.

---

## 📊 How to Modify Questions

### Access Admin Panel

Go to: `http://localhost:3000/admin/assessment/papers`

### Modify Questions for a Specific Paper

1. Click on the paper name (e.g., "Pain Management")
2. Click the **"Questions"** button (blue button with book icon)
3. You'll see all 60 questions for that paper

### Edit a Question

1. Click the **Edit** button (pencil icon) next to the question
2. Modify:
   - Question text (stem)
   - Question type (MCQ, Image-based, Short answer)
   - Options (for MCQ)
   - Correct answer
   - Marks
3. Click **"Update Question"**
4. Changes are **immediately reflected** on the assessment page

### Add a New Question

1. Click **"Add Question"** button
2. Fill in:
   - Question Number (Q1, Q2, etc.)
   - Question Type
   - Question Stem
   - Options (if MCQ)
   - Marks
3. Click **"Add Question"**

### Delete a Question

1. Click the **Delete** button (trash icon) next to question
2. Confirm deletion
3. Question removed immediately

---

## 👥 Creating Candidates

### Access Candidates Page

Go to: `http://localhost:3000/admin/assessment/candidates`

### Add Candidate with Paper Assignment

1. Click **"Add Candidate"** button
2. Fill in details:
   - Full Name
   - Enrollment ID
   - Password
   - Email
   - Phone
   - **Exam Paper** ← SELECT WHICH PAPER
3. Click **"Add Candidate"**

### Result
- Candidate can only access their assigned paper's assessment URL
- Example: If assigned "Pain Management" → can access `/assessment-pain-management`
- Cannot access other papers' URLs

---

## 🎓 Complete Example Workflow

### Create 3 Papers with Different Questions

**Step 1: Create Papers** (via admin)
- Pain Management
- Clinical Cardiology  
- Emergency Medicine

**Step 2: Modify Questions per Paper** (via admin)

For **Pain Management** paper:
- Edit Q1: Change to pain-related question
- Edit Q2: Change to pain anatomy question
- ... and so on for all 60

For **Cardiology** paper:
- Edit Q1: Change to cardiology question
- Edit Q2: Change to heart anatomy question
- ... and so on for all 60

For **Emergency** paper:
- Edit Q1: Change to emergency question
- Edit Q2: Change to emergency procedure question
- ... and so on for all 60

**Step 3: Create Candidates** (via admin)

```
Candidate A: Dr. John Smith
  Paper: Pain Management
  URL Access: /assessment-pain-management

Candidate B: Dr. Sarah Jones
  Paper: Clinical Cardiology
  URL Access: /assessment-clinical-cardiology

Candidate C: Dr. Mike Wilson
  Paper: Emergency Medicine
  URL Access: /assessment-emergency-medicine
```

**Step 4: Share URLs with Candidates**

```
To Dr. John:     http://localhost:3000/assessment-pain-management
To Dr. Sarah:    http://localhost:3000/assessment-clinical-cardiology
To Dr. Mike:     http://localhost:3000/assessment-emergency-medicine
```

**Step 5: Candidates Take Exam**

Each candidate:
1. Visits their assigned URL
2. Logs in with credentials
3. Takes exam with their paper's questions
4. Submits responses

**Step 6: Admin Reviews Results**

1. Go to Admin Dashboard
2. Filter results by paper
3. Review candidate responses
4. View scores and performance metrics

---

## 📱 URL Structure

### Assessment URLs

```
Base URL: http://localhost:3000

Paper 1: http://localhost:3000/assessment-pain-management
Paper 2: http://localhost:3000/assessment-clinical-cardiology
Paper 3: http://localhost:3000/assessment-emergency-medicine
Paper 4: http://localhost:3000/assessment-orthopedic-surgery
...etc
```

### Admin URLs

```
Manage Papers:     http://localhost:3000/admin/assessment/papers
Manage Candidates: http://localhost:3000/admin/assessment/candidates
View Results:      http://localhost:3000/admin/assessment/results
Edit Paper:        http://localhost:3000/admin/assessment/papers/[paperId]
Manage Questions:  http://localhost:3000/admin/assessment/papers/[paperId]/questions
```

---

## 🔧 Technical Details

### Database Schema

**New Table: `assessment_exam_papers`**
- Stores paper metadata (name, slug, duration, marks, etc.)
- `slug` field: URL-friendly identifier (auto-generated)

**Updated Tables:**
- `assessment_questions` → added `paper_id` column
- `assessment_candidates` → added `paper_id` column
- `assessment_attempts` → added `paper_id` column

### API Endpoints

```
GET    /api/admin/assessment/papers
POST   /api/admin/assessment/papers
       → Create/list exam papers

GET    /api/admin/assessment/papers/[paperId]
PUT    /api/admin/assessment/papers/[paperId]
DELETE /api/admin/assessment/papers/[paperId]
       → Manage single paper

GET    /api/admin/assessment/papers/[paperId]/questions
       → Get questions for a paper

POST   /api/admin/assessment/questions
PUT    /api/admin/assessment/questions/[questionId]
DELETE /api/admin/assessment/questions/[questionId]
       → Create/edit/delete questions

GET    /api/assessment/[paperSlug]/questions
POST   /api/assessment/[paperSlug]/verify-candidate
       → Get questions and verify candidate for specific paper
```

### Dynamic Routes

```
app/assessment-[slug]/page.tsx
└─ Renders assessment for any paper slug
   Loads paper-specific questions
   Verifies candidate access
   Handles exam flow
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Migration applied to database
- [ ] Papers created (3 papers visible in admin)
- [ ] Questions linked to papers (60 each)
- [ ] Assessment pages load without 404 errors
  - [ ] `/assessment-pain-management` loads
  - [ ] `/assessment-clinical-cardiology` loads
  - [ ] `/assessment-emergency-medicine` loads
- [ ] Can access questions management admin
- [ ] Can add new questions to a paper
- [ ] Can edit questions for a paper
- [ ] Can delete questions from a paper
- [ ] Changes reflect immediately when refreshing assessment page
- [ ] Can create candidates with paper assignment
- [ ] Candidates can only access assigned paper URL

---

## 🐛 Troubleshooting

### Issue: "Paper not found" 404 Error

**Causes:**
1. Migration not applied
2. Papers not created
3. Browser cache not cleared

**Solutions:**
1. Verify migration was applied (Step 1)
2. Check papers exist in admin panel
3. Clear browser cache: Ctrl+Shift+Delete
4. Run: `node setup-papers-with-existing-questions.mjs`

### Issue: "No questions found for this paper"

**Cause:** Questions not linked to paper

**Solution:**
1. Run: `node setup-papers-with-existing-questions.mjs`
2. Or manually add questions in admin panel

### Issue: Changes to Questions Not Showing

**Cause:** Browser or application cache

**Solution:**
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Restart application: `npm run dev`
3. Check database directly in Supabase SQL Editor

### Issue: Candidate Can't Login

**Possible Causes:**
1. Candidate not assigned to this paper
2. Credentials don't match exactly
3. Paper is inactive (archived)

**Solutions:**
1. Check candidate's paper assignment in admin
2. Verify exact name and enrollment ID match
3. Make sure paper is active (not archived)

---

## 📚 Files Reference

### Setup Scripts
```
setup-papers-with-existing-questions.mjs
└─ Create papers and link existing questions
```

### Database Migrations
```
migrations/007_add_multi_paper_exam_system.sql
└─ Add paper_id fields and assessment_exam_papers table
```

### API Routes
```
app/api/admin/assessment/papers/route.ts
app/api/admin/assessment/papers/[paperId]/route.ts
app/api/admin/assessment/papers/[paperId]/questions/route.ts
app/api/admin/assessment/questions/[questionId]/route.ts
app/api/assessment/[paperSlug]/questions/route.ts
app/api/assessment/[paperSlug]/verify-candidate/route.ts
```

### Admin Pages
```
app/admin/assessment/papers/page.tsx
app/admin/assessment/papers/[paperId]/questions/page.tsx
app/admin/assessment/candidates/page.tsx
```

### Assessment Pages
```
app/assessment-[slug]/page.tsx
└─ Dynamic page for any paper
```

---

## 🎯 Key Differences from Original System

| Feature | Before | After |
|---------|--------|-------|
| **Assessment URLs** | Single: `/assessment` | Multiple: `/assessment-{paper}` |
| **Number of Papers** | 1 fixed | Unlimited |
| **Questions** | Same for everyone | Different per paper |
| **Question Management** | Limited admin control | Full CRUD via admin panel |
| **Candidate Assignment** | Generic | Paper-specific |
| **URL Routing** | Static | Dynamic |
| **Changes Reflect** | On restart | Immediately |

---

## 🚀 Next Steps

### After Setup

1. **Customize Questions** per Paper
   - Go to admin → Papers → Questions
   - Edit all 60 questions for each paper

2. **Create Your Candidates**
   - Go to admin → Candidates
   - Assign to appropriate papers

3. **Share Assessment URLs**
   - Email candidates their specific paper URL
   - Each URL is unique to their assigned paper

4. **Monitor Results**
   - View results filtered by paper
   - Track candidate performance

---

## 📞 Support

If you encounter issues:

1. Check **Troubleshooting** section above
2. Verify all setup steps were completed
3. Check browser console for errors (F12)
4. Review Supabase dashboard for database status
5. Verify `.env.local` has correct credentials

---

## ✨ Summary

Your multi-paper exam system is **fully implemented and ready to use**!

**Quick Setup:**
1. Apply migration (Step 1)
2. Run setup script (Step 2)
3. Start application (Step 3)
4. Test URLs (Step 4)
5. Modify questions in admin (Modify Questions section)

**That's it!** You now have a complete multi-paper system with:
- ✅ Multiple unique URLs per paper
- ✅ Full question customization via admin panel
- ✅ Immediate changes without restart
- ✅ Paper-specific candidate access
- ✅ Same 60-question format for all papers

Enjoy your new exam system! 🎓
