# Pain Medicine Question Seeding & Paper Management Guide

## Overview

This system allows you to seed the complete Pain Medicine IBMP 60-question assessment into individual exam papers with full customization capabilities.

### Key Features

✅ **Paper-Independent Questions** - Each paper gets its own independent copy of questions  
✅ **60 MCQ Format** - All questions are MCQs with 4 options and correct answer  
✅ **Image Support** - Questions Q41-Q60 can have images attached  
✅ **Full Metadata** - Complete question data stored in JSONB for restoration/reference  
✅ **Admin Panel Editing** - Modify any question after seeding through the web interface  
✅ **Supabase Sync** - All changes automatically persist to database  

---

## Quick Start

### 1. Seed Questions to a Paper

```bash
# First, find your paper ID from the admin panel or database
# Format: UUID (e.g., 4cf408d1-1097-4081-9039-bf3c511037e7)

node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

**Output:**
```
🔄 Starting Pain Medicine Question Seeding...

📄 Target Paper ID: 4cf408d1-1097-4081-9039-bf3c511037e7

✅ Loaded seed file: "IBMP Pain Medicine — Set A"
   Version: 1 | Questions: 60

✅ Paper found: "Arthroscopy and Arthroplasty"

📥 Inserting questions...

📝 Q01: After a pinprick, a patient perceives an immediate...
📝 Q02: Repeated nociceptive input increases the responsiveness...
...
✅ SEEDING COMPLETE
```

### 2. Access Admin Panel

Navigate to: `http://localhost:3000/admin/assessment/papers/{paperId}/questions`

### 3. Modify Questions

- Click "Edit" on any question
- Change stem, options, correct answer
- Upload images for image-based questions (Q41-Q60)
- Changes save automatically to Supabase

### 4. Verify in Database

```bash
# Check questions for a specific paper
node check-paper-questions.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
```

---

## Database Structure

### `assessment_questions` Table

```sql
Column              | Type          | Notes
--------------------|---------------|--------------------------------------------
id                 | UUID          | Primary key
question_number    | TEXT          | Q01 to Q60
paper_id           | UUID          | FK to assessment_exam_papers - KEY FOR ISOLATION
type               | TEXT          | 'mcq', 'image', 'short'
stem               | TEXT          | Question text
marks              | INTEGER       | 1 for MCQ, 3 for image, 1 for short answer
options            | JSONB/ARRAY   | ["Option A", "Option B", "Option C", "Option D"]
correct_answer     | TEXT          | "Option A" (plain text, not ID)
image_url          | TEXT          | URL to question image
module             | TEXT          | Module name (e.g., "Foundations of Pain Medicine")
question_data      | JSONB         | Complete metadata from seed for restoration
sort_order         | INTEGER       | Question order (1-60)
is_active          | BOOLEAN       | Active/inactive flag
created_at         | TIMESTAMP     | Creation timestamp
updated_at         | TIMESTAMP     | Last modification timestamp
```

### Key: paper_id

The `paper_id` column is critical for question isolation:

```
Paper 1: 4cf408d1-1097-4081-9039-bf3c511037e7
  ├─ Q01, Q02, Q03, ..., Q60 (independent copies)
  
Paper 2: 5dg509e2-2108-5192-9040-cg4d512148f8
  ├─ Q01, Q02, Q03, ..., Q60 (different data)
```

When you modify a question in Paper 1, Paper 2's version remains unchanged.

---

## Question Format

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
  "correct_answer": "Thinly myelinated A-delta fibres"
}
```

**Admin Panel Display:**
- Question Stem: Text area
- Option A, B, C, D: Four input fields
- Correct Answer: Dropdown selecting from options
- Marks: 1 (fixed)

### Image-Based Questions (Q41-Q60)

**Database Storage:**
```json
{
  "question_number": "Q41",
  "type": "image",
  "stem": "A patient selects the marked position on the scale...",
  "marks": 3,
  "image_url": "https://..../figure_01.png",
  "parts": [
    {
      "id": "a",
      "prompt": "Record the patient's pain intensity score.",
      "marks": 1
    },
    {
      "id": "b",
      "prompt": "Name one important dimension of pain impact...",
      "marks": 1
    },
    {
      "id": "c",
      "prompt": "Write one focused question...",
      "marks": 1
    }
  ]
}
```

**Admin Panel Display:**
- Question Stem: Text area
- Image Upload: File input for .png/.jpg
- 3 Part Sections (a, b, c):
  - Prompt: Text input
  - Expected Answer: Text input

---

## Editing Workflow

### Through Admin Panel

1. **Navigate** to `/admin/assessment/papers/{paperId}/questions`
2. **Click Edit** on a question card
3. **Modify**:
   - Stem text
   - Options (A, B, C, D)
   - Correct answer (dropdown)
   - Image (for Q41-Q60)
4. **Click "Update Question"**
5. **Verify**: Changes appear immediately in the list

### Via API

**Update a Question:**
```bash
curl -X PUT http://localhost:3000/api/admin/assessment/questions/{questionId} \
  -H "Content-Type: application/json" \
  -d '{
    "stem": "New question text",
    "options": ["New A", "New B", "New C", "New D"],
    "correct_answer": "New A"
  }'
```

**Upload Image:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@path/to/image.png" \
  -F "bucket=assessment-images"
```

---

## Multi-Paper Isolation

### Scenario: Two Papers, Same Topic

**Paper A (Arthroscopy):**
```
question_number: Q01
paper_id: 4cf408d1-1097-4081-9039-bf3c511037e7
stem: "After a pinprick, a patient perceives an immediate..."
options: ["A", "B", "C", "D"]
correct_answer: "C"
```

**Paper B (Rheumatology):**
```
question_number: Q01
paper_id: 5dg509e2-2108-5192-9040-cg4d512148f8
stem: "An adult has a clinical diagnosis of trigeminal neuralgia..."
options: ["Morphine", "Pregabalin", "Duloxetine", "Carbamazepine"]
correct_answer: "Carbamazepine"
```

### Result

Each paper has completely independent Q01-Q60. Modifying Paper A's Q01 doesn't affect Paper B's Q01.

---

## Seeding Options

### Option 1: Seed All 60 Questions (Default)

```bash
node seed-pain-medicine-to-paper.mjs {paperId}
```

- Creates 60 MCQ questions
- Q41-Q60 marked as image-type (can add images later)
- Full question data stored in JSONB

### Option 2: Sync Metadata Only

```bash
# Update just the scoring/metadata from seed
curl -X POST "http://localhost:3000/api/admin/assessment/sync-from-seed?paperId={paperId}"
```

- Updates: marks, correct answer, module, metadata
- Preserves: any existing edits to stem/options

### Option 3: Seed Different Question Sets

Create multiple seed files:
- `exam.seed.json` - Current Pain Medicine set
- `cardiology.seed.json` - Cardiology questions
- `orthopedics.seed.json` - Orthopedics questions

Then seed to different papers:
```bash
# For Paper A (Pain Medicine)
node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7

# For Paper B (Cardiology)
cp cardiology.seed.json public/exam.seed.json
node seed-pain-medicine-to-paper.mjs 5dg509e2-2108-5192-9040-cg4d512148f8
```

---

## Image Management

### Storing Images in Supabase

1. **Prepare Images** (PNG or JPG, 512×512 recommended)
   - Q41-Q60 typically have teaching schematics
   - Store in: `/public/images/pain-medicine/`

2. **Upload via Admin Panel**
   - Edit question (Q41+)
   - Click "Image Upload"
   - Select file and submit
   - Image URL auto-populated

3. **Direct Upload Script** (optional)

```bash
node upload-question-images.mjs pain-medicine
```

### Image Storage Paths

```
Supabase Bucket: assessment-images/

├── pain-medicine/
│   ├── Q41_pain_assessment_figure.png
│   ├── Q42_observation_chart.png
│   ├── Q43_lumbar_anatomy.png
│   ...
│   └── Q50_spinal_cord_stimulation.png
```

### Accessing Images

```
https://{projectId}.supabase.co/storage/v1/object/public/assessment-images/pain-medicine/Q41_pain_assessment_figure.png
```

---

## Verification & Troubleshooting

### Check Seeding Status

```bash
# List all questions for a paper
psql -d assessment_db -c "
  SELECT question_number, type, marks, stem 
  FROM assessment_questions 
  WHERE paper_id = '4cf408d1-1097-4081-9039-bf3c511037e7'
  ORDER BY sort_order;
"
```

### Common Issues

**Issue:** Questions not appearing in admin panel
```bash
# Solution: Verify paper_id is correct
SELECT id, name FROM assessment_exam_papers LIMIT 5;
```

**Issue:** Options showing as [object Object]
```bash
# Solution: Options must be plain text array, not objects
UPDATE assessment_questions 
SET options = '["A", "B", "C", "D"]'::jsonb 
WHERE question_number = 'Q01';
```

**Issue:** Changes not syncing to Supabase
```bash
# Solution: Check if question is marked active
UPDATE assessment_questions 
SET is_active = true 
WHERE paper_id = '{paperId}';
```

---

## API Endpoints Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/assessment/questions` | Create new question |
| GET | `/api/admin/assessment/papers/{paperId}/questions` | List paper questions |
| PUT | `/api/admin/assessment/questions/{questionId}` | Update question |
| DELETE | `/api/admin/assessment/questions/{questionId}` | Delete question |
| POST | `/api/admin/assessment/sync-from-seed?paperId={paperId}` | Sync metadata from seed |
| POST | `/api/upload` | Upload images to Supabase |

---

## Best Practices

1. **Always backup** before large modifications
2. **Use paper_id** consistently to avoid cross-paper contamination
3. **Test** modifications in staging before production
4. **Document** custom modifications in question_data JSONB
5. **Enable row-level security** in Supabase for production

---

## Example Workflow

### Step 1: Create Paper
```bash
# In admin panel or via API
POST /api/admin/assessment/papers
{
  "name": "IBMP Pain Medicine — Batch 2",
  "code": "PM-B2",
  "duration_minutes": 120
}
# Returns: paperId = abc123...
```

### Step 2: Seed Questions
```bash
node seed-pain-medicine-to-paper.mjs abc123def456ghi789
```

### Step 3: Customize Questions
- Access `/admin/assessment/papers/abc123.../questions`
- Edit Q01 stem for specific context
- Upload images for Q41-Q60
- Adjust options if needed

### Step 4: Use in Exam
- Questions are now active and ready
- Students take exam
- Results isolated to this paper

### Step 5: Modify for Next Batch
```bash
# Create new paper
POST /api/admin/assessment/papers { "name": "IBMP Pain Medicine — Batch 3" }

# Seed to new paper (doesn't affect Batch 2)
node seed-pain-medicine-to-paper.mjs xyz789abc...

# Customize for new cohort
# Original Batch 2 unchanged
```

---

## Support & Questions

For issues or questions:
1. Check logs: `tail -f .nextjs/build.log`
2. Verify Supabase connection: Test in Supabase Studio
3. Check paper_id: Ensure UUID format
4. Review options format: Must be `["A","B","C","D"]` not objects
