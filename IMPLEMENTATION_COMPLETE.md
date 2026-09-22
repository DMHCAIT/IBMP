# Pain Medicine Assessment Seeding System - IMPLEMENTATION COMPLETE ✅

## Overview

You now have a complete system to seed the **IBMP Pain Medicine 60-question assessment** into individual exam papers with full customization and per-paper isolation.

---

## What Was Implemented

### 1. **Seeding Scripts** 📝

#### `seed-pain-medicine-to-paper.mjs`
- **Purpose:** Import all 60 Pain Medicine questions to a specific paper
- **Usage:** `node seed-pain-medicine-to-paper.mjs {paperId}`
- **Features:**
  - Seeds 60 MCQ questions with 4 options each
  - Extracts text from seed JSON (no IDs in options)
  - Stores complete question metadata in JSONB
  - Links all questions to specific paper via `paper_id`
  - Supports image attachments (Q41-Q60)
  - Clears old questions to prevent duplicates
  - Detailed console output with progress

#### `verify-paper-seeding.mjs`
- **Purpose:** Verify seeding success and paper health
- **Usage:** `node verify-paper-seeding.mjs {paperId}`
- **Checks:**
  - Paper exists and name correct
  - Question count (0-60)
  - Type distribution (MCQ/Image/Short)
  - Total marks calculation
  - Module breakdown
  - Image attachment status
  - JSONB metadata completeness
  - Active/inactive status

### 2. **API Endpoint Updates** 🔌

#### Updated: `/api/admin/assessment/sync-from-seed`
**New Features:**
```
POST /api/admin/assessment/sync-from-seed?paperId={paperId}
```
- Optional `paperId` parameter for paper-specific sync
- Transforms seed data to match new format
- Extracts options as plain text (no IDs)
- Updates scoring, marks, correct answers
- Preserves paper isolation
- Better error handling and logging

**Payload:**
```json
{
  "success": true,
  "message": "Synced 60 questions from exam.seed.json",
  "updated": 60,
  "skipped": 0,
  "paperId": "4cf408d1-1097-4081-9039-bf3c511037e7",
  "seedTitle": "IBMP Pain Medicine — Set A"
}
```

### 3. **Database Structure** 💾

**Key Column: `paper_id`**
- Links each question to a specific exam paper
- Ensures complete isolation between papers
- Enables independent modifications
- Supports multi-paper setup

**Seed JSON Transformation:**
```
Seed JSON Format              →  Database Format
─────────────────────────────────────────────────
q.options (with IDs)         →  options (text array)
q.scoring.correctOptionId    →  correct_answer (text)
q.moduleId                   →  module (string)
q.topic                      →  (in question_data JSONB)
entire question              →  question_data (JSONB)
```

### 4. **Documentation** 📚

#### `SEEDING_QUICK_START.md`
- Step-by-step setup guide
- Command examples
- Expected output samples
- Troubleshooting section
- 7-step workflow from seed to exam

#### `PAIN_MEDICINE_SEEDING_GUIDE.md`
- Comprehensive reference manual
- Database schema explained
- Question format specifications
- Multi-paper isolation details
- API endpoints reference
- Image management guide
- Best practices
- Example workflows

---

## Quick Start

### 1. Get Paper ID
```bash
# From admin panel URL or database
psql -d assessment_db -c "SELECT id, name FROM assessment_exam_papers LIMIT 5;"
```

### 2. Seed Questions
```bash
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

### 3. Verify Success
```bash
node verify-paper-seeding.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

### 4. Access Admin Panel
```
http://localhost:3000/admin/assessment/papers/4cf408d1-1097-4081-9039-bf3c511037e7/questions
```

### 5. Edit & Customize
- Click "Edit" on any question
- Modify stem, options, correct answer
- Upload images (Q41-Q60)
- Changes auto-sync to Supabase ✅

---

## Key Features Explained

### ✅ Per-Paper Question Isolation

**Problem Solved:**
- Before: Modifying Question Q01 in Paper A affected Paper B's Q01
- After: Each paper has independent copies of all questions

**How It Works:**
```sql
-- Paper A's questions
SELECT * FROM assessment_questions 
WHERE paper_id = 'paper-a-uuid' AND question_number = 'Q01';

-- Paper B's questions (completely separate)
SELECT * FROM assessment_questions 
WHERE paper_id = 'paper-b-uuid' AND question_number = 'Q01';

-- Different papers can have different Q01 content
```

### ✅ 60 MCQ Format

**Question Structure:**
- Questions Q01-Q60: All MCQ type
- 4 options per question (A, B, C, D)
- 1 mark per question
- Total: 60 marks
- All options stored as plain text (no IDs)

**Admin Panel Display:**
```
Question Number: Q01
Type: MCQ Questions (auto-detected)
Stem: [Text area with question]
Options:
  [ Input for Option A ]
  [ Input for Option B ]
  [ Input for Option C ]
  [ Input for Option D ]
Correct Answer: [Dropdown to select from options]
Marks: 1 (fixed)
```

### ✅ Complete Metadata Storage

**question_data JSONB contains:**
```json
{
  "moduleId": 1,
  "topic": "Pain physiology",
  "type": "mcq",
  "stem": "Question text...",
  "maxUnits": 1,
  "scoring": {
    "correctOptionId": "uuid...",
    "paperAnswerLetter": "C",
    "explanation": "Why C is correct",
    "referenceIds": ["S02"]
  },
  "parts": [],
  "asset": { "file": "url", "title": "..." }
}
```

This enables:
- Full restoration of original data
- Reference materials and explanations
- Audit trail of what was changed
- Support for future enhanced features

### ✅ Image Support

**For Image-Based Questions (Optional for Q41-Q60):**
1. Upload image via admin panel file input
2. Image stored in Supabase `assessment-images` bucket
3. URL auto-populated in database
4. 3-part sub-questions supported in question_data

**Image Storage:**
```
Supabase Bucket: assessment-images/
├── pain-medicine/
│   ├── Q41_pain_scale.png
│   ├── Q42_observation_chart.png
│   └── ...Q50_spinal_cord.png
```

### ✅ Automatic Admin Panel Sync

**Modification Workflow:**
```
1. User edits question in admin panel
2. Submit button sends UPDATE to API
3. API validates and updates Supabase
4. question_data JSONB updated with changes
5. updated_at timestamp recorded
6. Page refreshes to show updated question
7. Changes persist across sessions
```

**No Manual Steps Needed:**
- No need to run migrations
- No database direct edits required
- All sync automatic via API

---

## Question Data Format

### MCQ (All 60 Questions)

**Database Storage:**
```json
{
  "question_number": "Q01",
  "type": "mcq",
  "stem": "After a pinprick, a patient perceives...",
  "marks": 1,
  "options": [
    "Preganglionic autonomic B fibres",
    "Unmyelinated C fibres",
    "Thinly myelinated A-delta fibres",
    "Large myelinated A-alpha motor fibres"
  ],
  "correct_answer": "Thinly myelinated A-delta fibres",
  "paper_id": "4cf408d1-1097-4081-9039-bf3c511037e7",
  "module": "Foundations of Pain Medicine",
  "question_data": { ... full metadata ... }
}
```

**Key Points:**
- Options: Plain text strings, NO IDs
- Correct answer: Text that matches one option
- Each paper has its own copy
- Modifications isolated to one paper

---

## File Structure

```
project-root/
├── seed-pain-medicine-to-paper.mjs ......... Main seeding script
├── verify-paper-seeding.mjs ................ Verification script
├── SEEDING_QUICK_START.md .................. Quick start guide
├── PAIN_MEDICINE_SEEDING_GUIDE.md .......... Full reference
├── public/
│   └── exam.seed.json ..................... Source questions (60)
├── app/
│   ├── api/
│   │   └── admin/assessment/
│   │       ├── sync-from-seed/route.ts .... Updated API endpoint
│   │       ├── questions/route.ts ......... Question CRUD
│   │       └── papers/[paperId]/questions/page.tsx ... Admin panel
│   └── ...
└── ...
```

---

## Workflow Examples

### Scenario 1: Single Paper Setup

```bash
# 1. Create paper (via admin UI)
# Paper: "IBMP Pain Medicine - Batch 1"
# ID: 4cf408d1-1097-4081-9039-bf3c511037e7

# 2. Seed questions
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7

# 3. Verify
node verify-paper-seeding.mjs 4cf408d1-1097-4081-9039-bf3c511037e7

# 4. Customize
# Access: /admin/assessment/papers/4cf408d1.../questions
# Edit Q01, Q02, ..., Q60 as needed

# 5. Use in exam
# Students access exam, all 60 questions loaded for this paper
```

### Scenario 2: Multiple Papers (Independent)

```bash
# Paper A: Arthroscopy
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7

# Paper B: Rheumatology  
node seed-pain-medicine-to-paper.mjs 5dg509e2-2108-5192-9040-cg4d512148f8

# Result:
# - Paper A has Q01-Q60 (one version)
# - Paper B has Q01-Q60 (different version)
# - Modifications to A don't affect B
# - Students see different questions depending on paper
```

### Scenario 3: Custom Question Set

```bash
# Create custom seed file
cp public/exam.seed.json public/cardiology.seed.json
# Edit cardiology.seed.json to have different questions

# Seed cardiology questions to Paper C
cp public/cardiology.seed.json public/exam.seed.json
node seed-pain-medicine-to-paper.mjs 6eh610f3-3209-6203-a051-dh5e613259g9

# Reset back to pain medicine
cp public/pain-medicine-backup.seed.json public/exam.seed.json
```

---

## API Reference

### POST /api/admin/assessment/questions
Create a new question for a paper

```bash
curl -X POST http://localhost:3000/api/admin/assessment/questions \
  -H "Content-Type: application/json" \
  -d '{
    "question_number": "Q61",
    "type": "mcq",
    "stem": "New question...",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A",
    "marks": 1,
    "paper_id": "4cf408d1-1097-4081-9039-bf3c511037e7"
  }'
```

### GET /api/admin/assessment/papers/{paperId}/questions
List all questions for a paper

```bash
curl http://localhost:3000/api/admin/assessment/papers/4cf408d1-1097-4081-9039-bf3c511037e7/questions
```

### PUT /api/admin/assessment/questions/{questionId}
Update a question

```bash
curl -X PUT http://localhost:3000/api/admin/assessment/questions/{questionId} \
  -H "Content-Type: application/json" \
  -d '{
    "stem": "Updated question...",
    "options": ["New A", "New B", "New C", "New D"],
    "correct_answer": "New B"
  }'
```

### POST /api/admin/assessment/sync-from-seed?paperId={paperId}
Sync metadata from seed file

```bash
curl -X POST "http://localhost:3000/api/admin/assessment/sync-from-seed?paperId=4cf408d1-1097-4081-9039-bf3c511037e7"
```

---

## Next Steps

1. ✅ **Seed your first paper**
   ```bash
   node seed-pain-medicine-to-paper.mjs {your-paper-uuid}
   ```

2. ✅ **Verify the seeding**
   ```bash
   node verify-paper-seeding.mjs {your-paper-uuid}
   ```

3. ✅ **Access admin panel**
   ```
   http://localhost:3000/admin/assessment/papers/{your-paper-uuid}/questions
   ```

4. ✅ **Customize questions**
   - Edit stems, options, correct answers
   - Upload images for image-based questions
   - Changes auto-sync to Supabase

5. ✅ **Create test candidates**
   - Via admin panel: `/admin/assessment/papers/{paperId}/candidates`
   - Assign to paper

6. ✅ **Run practice exam**
   - Student access: `http://localhost:3000/exam/{paper-slug}`
   - All 60 questions load correctly
   - Results tracked per paper

7. ✅ **Review & modify**
   - View results: `/admin/assessment/papers/{paperId}/results`
   - Edit questions as needed (doesn't affect other papers)
   - Re-test with new candidates

---

## Support & Troubleshooting

### Issue: "Paper not found"
```bash
# Verify paper exists
psql -d assessment_db -c "
  SELECT id, name FROM assessment_exam_papers 
  WHERE id = '{paperId}';
"
```

### Issue: "Questions not appearing"
```bash
# Check if questions inserted
psql -d assessment_db -c "
  SELECT COUNT(*) FROM assessment_questions 
  WHERE paper_id = '{paperId}';
"
```

### Issue: "Options showing as [object Object]"
```bash
# Re-run seeding (it fixes this)
node seed-pain-medicine-to-paper.mjs {paperId}
```

### Issue: "Changes not saving"
- Check Supabase connection
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set
- Check browser console for errors

---

## Files to Reference

| File | Purpose |
|------|---------|
| **SEEDING_QUICK_START.md** | Start here! Quick 7-step guide |
| **PAIN_MEDICINE_SEEDING_GUIDE.md** | Full documentation |
| **seed-pain-medicine-to-paper.mjs** | Seeding script |
| **verify-paper-seeding.mjs** | Verification tool |
| **public/exam.seed.json** | Source questions |

---

## Summary

You now have:

✅ **Complete seeding system** - Import 60 questions to any paper  
✅ **Per-paper isolation** - Each paper independent  
✅ **Admin panel integration** - Edit questions via web UI  
✅ **Automatic sync** - Changes persist to Supabase  
✅ **Image support** - Upload images for visual questions  
✅ **Verification tools** - Check seeding success  
✅ **Full documentation** - Guides and reference docs  
✅ **Production-ready** - Multiple papers, multi-tenant support  

**Start seeding your first paper now!** 🚀
