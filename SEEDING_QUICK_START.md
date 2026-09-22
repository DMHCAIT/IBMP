# Quick Setup: Seed Pain Medicine Questions to Your Paper

## Prerequisites

✅ Node.js and npm installed  
✅ Supabase project setup with environment variables configured  
✅ Admin panel running at `http://localhost:3000`  
✅ Paper already created in the system

## Step 1: Get Your Paper ID

**Option A: From Admin Panel**
1. Go to `/admin/assessment/papers`
2. Click on your paper (e.g., "Arthroscopy and Arthroplasty")
3. Look at the URL: `/admin/assessment/papers/[THIS_IS_YOUR_PAPER_ID]/questions`
4. Copy the UUID

**Option B: From Database**
```bash
psql -d assessment_db -c "SELECT id, name FROM assessment_exam_papers LIMIT 5;"
```

Example paper ID: `4cf408d1-1097-4081-9039-bf3c511037e7`

---

## Step 2: Seed Questions

```bash
# Run the seeding script
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

**Expected Output:**
```
🔄 Starting Pain Medicine Question Seeding...

📄 Target Paper ID: 4cf408d1-1097-4081-9039-bf3c511037e7

✅ Loaded seed file: "IBMP Pain Medicine — Set A"
   Version: 1 | Questions: 60

✅ Paper found: "Arthroscopy and Arthroplasty"

🗑️  Removing existing questions for this paper...
✅ Cleared old questions

📥 Inserting questions...

📝 Q01: After a pinprick, a patient perceives an immediate, well-localised sharp pain...
📝 Q02: Repeated nociceptive input increases the responsiveness of neurons...
[... continues for all 60 questions ...]

======================================================================
✅ SEEDING COMPLETE
======================================================================

📊 Results:
  ✅ Inserted: 60 questions
  ⚠️  Skipped: 0 questions
  📦 Paper ID: 4cf408d1-1097-4081-9039-bf3c511037e7
  📄 Paper Name: Arthroscopy and Arthroplasty

✨ All questions are now specific to this paper.
   Modifications through the admin panel will NOT affect other papers.
```

---

## Step 3: Verify Seeding

```bash
# Verify all 60 questions were imported
node verify-paper-seeding.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

**Expected Output:**
```
📋 PAPER SEEDING VERIFICATION

Paper ID: 4cf408d1-1097-4081-9039-bf3c511037e7

1️⃣  Checking paper...
✅ Paper found: "Arthroscopy and Arthroplasty"
   Created: 9/8/2026, 2:45:30 PM

2️⃣  Counting questions...
✅ Total questions: 60/60

3️⃣  Breakdown by type...
  📝 MCQ (1 mark each): 60 questions
  🖼️  Image (3 marks each): 0 questions
  ✍️  Short Answer (1 mark each): 0 questions

4️⃣  Total marks...
✅ Expected total: 60 marks
   (MCQ: 60×1 + Image: 0×3 + Short: 0×1)

5️⃣  Sample questions (first 5)...
  📝 Q01: After a pinprick, a patient perceives an immediate, well-localised sharp pain...
      Options: 4
  📝 Q02: Repeated nociceptive input increases the responsiveness of neurons...
      Options: 4
  ...

======================================================================
✅ SEEDING VERIFICATION COMPLETE

📊 Completion: 100%
✨ Perfect! All 60 questions seeded correctly.

📝 Next steps:
   1. Access admin panel: /admin/assessment/papers/4cf408d1-1097-4081-9039-bf3c511037e7/questions
   2. Review and edit questions as needed
   3. Upload images for image-based questions (Q41-Q60)
   4. Test the exam with a candidate
```

---

## Step 4: Access Admin Panel

1. Open browser: `http://localhost:3000/admin/assessment/papers/4cf408d1-1097-4081-9039-bf3c511037e7/questions`
2. You'll see all 60 questions listed:
   - Q01: "After a pinprick, a patient perceives..." ← MCQ with 4 options
   - Q02: "Repeated nociceptive input..." ← MCQ with 4 options
   - ... and so on to Q60

---

## Step 5: Customize Questions (Optional)

### Edit a Question

1. Click **Edit** button on any question card
2. Modify:
   - **Question Stem** - The main question text
   - **Options A, B, C, D** - Multiple choice answers
   - **Correct Answer** - Dropdown to select correct option
3. Click **Update Question**
4. Changes save automatically to Supabase ✅

### Upload Images (Q41-Q60)

1. Click **Edit** on image-based question (Q41-Q60)
2. Scroll to "Question Image" section
3. Click file input and select `.png` or `.jpg` image
4. Image uploads to Supabase and URL auto-fills
5. Click **Update Question**

---

## Step 6: Verify Sync to Database

```bash
# Check that one question was properly stored with all options
psql -d assessment_db -c "
  SELECT 
    question_number,
    type,
    marks,
    stem,
    options,
    correct_answer
  FROM assessment_questions
  WHERE paper_id = '4cf408d1-1097-4081-9039-bf3c511037e7'
    AND question_number = 'Q01';
"
```

**Expected Output:**
```
 question_number | type | marks |                                  stem                                  
-----------------+------+-------+---------
 Q01             | mcq  |     1 | After a pinprick, a patient perceives an immediate, well-localised...
 
 options                                                                          | correct_answer
 ["Preganglionic autonomic B fibres", "Unmyelinated C fibres", ...]             | Thinly myelinated A-delta fibres
```

---

## Step 7: Use in Exam

1. Go to **Exam Interface**: `http://localhost:3000/exam/{paper-slug}`
2. Start the exam - All 60 questions loaded for this specific paper
3. Questions are independent - Other papers remain unaffected

---

## Troubleshooting

### Questions Not Appearing

**Issue:** Seeded 60 questions but admin panel shows 0

**Solution:**
```bash
# Check if questions were inserted
psql -d assessment_db -c "
  SELECT COUNT(*) FROM assessment_questions 
  WHERE paper_id = '4cf408d1-1097-4081-9039-bf3c511037e7';
"

# If 0, verify paper exists
psql -d assessment_db -c "
  SELECT id, name FROM assessment_exam_papers 
  WHERE id = '4cf408d1-1097-4081-9039-bf3c511037e7';
"
```

### Options Showing as [object Object]

**Solution:** Re-run seeding script (it fixes this):
```bash
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

### Changes Not Saving

**Solution:** Ensure Supabase client is configured:
```bash
# Test connection
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Should show valid URLs/keys
```

---

## Paper Isolation Test

To verify that questions are truly isolated per paper:

```bash
# Create/use two different papers
# Seed to Paper A
node seed-pain-medicine-to-paper.mjs {PAPER_A_ID}

# Seed to Paper B  
node seed-pain-medicine-to-paper.mjs {PAPER_B_ID}

# Edit Q01 in Paper A
# Via admin panel: change Q01 stem in Paper A

# Check Paper B - Q01 should be unchanged
psql -d assessment_db -c "
  SELECT paper_id, question_number, stem FROM assessment_questions
  WHERE question_number = 'Q01'
  ORDER BY paper_id;
"
```

**Expected:** Two Q01 records with different stems ✅

---

## Next Steps

1. ✅ Seed questions to paper
2. ✅ Verify 60 questions imported
3. ✅ Review questions in admin panel
4. ✅ Upload images for Q41-Q60 (if needed)
5. ✅ Create test candidate
6. ✅ Run practice exam
7. ✅ Review exam results

---

## File Reference

| File | Purpose |
|------|---------|
| `seed-pain-medicine-to-paper.mjs` | Main seeding script |
| `verify-paper-seeding.mjs` | Verification & health check |
| `public/exam.seed.json` | Source data (60 questions) |
| `PAIN_MEDICINE_SEEDING_GUIDE.md` | Full documentation |

---

## Support

For detailed information, see: [PAIN_MEDICINE_SEEDING_GUIDE.md](./PAIN_MEDICINE_SEEDING_GUIDE.md)

For API documentation, see: [README.md](./README.md)
