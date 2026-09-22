# 60-Question Assessment Pattern - Complete Implementation Guide

## ✅ Implementation Status: COMPLETE

Your assessment system now has a **complete, enforced 60-question pattern** with full admin control and database storage.

---

## 📋 Question Pattern Structure

### SECTION A: Multiple Choice Questions (Q1-Q40)
- **Count:** 40 questions
- **Marks per question:** 1
- **Total marks:** 40
- **Options:** 4 choices (A, B, C, D)
- **Type:** Auto-detected as MCQ

### SECTION B: Image-Based Questions (Q41-Q50)
- **Count:** 10 questions
- **Structure:** 1 image + 3 sub-questions (a, b, c)
- **Marks per sub-question:** 1
- **Total marks per question:** 3
- **Total section marks:** 30
- **Type:** Auto-detected as IMAGE

### SECTION C: Short Answer Questions (Q51-Q60)
- **Count:** 10 questions
- **Marks per question:** 1
- **Total marks:** 10
- **Format:** One-line or brief expected answer
- **Type:** Auto-detected as SHORT

**TOTAL: 80 Marks across 60 Questions**

---

## 🚀 How to Use the New Admin Panel

### Step 1: Access Admin Questions Panel

**URL:** `http://localhost:3000/admin/assessment/papers/{paperId}/questions`

**Admin Password:** `ibmp2024`

**Example URL:** `http://localhost:3000/admin/assessment/papers/4cf408d1-1097-4081-9039-bf3c511037e7/questions`

### Step 2: View Question Progress

When you open the questions page, you'll see **3 progress cards** at the top:

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│   MCQ QUESTIONS      │  IMAGE QUESTIONS     │  SHORT ANSWER        │
│     (Q1-Q40)         │    (Q41-Q50)         │   (Q51-Q60)          │
│                      │                      │                      │
│      5/40            │      3/10            │      0/10            │
│   40 marks total     │  30 marks total      │  10 marks total      │
│   (3 per Q)          │                      │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

### Step 3: Add a New Question

Click **"Add Question"** button in top right.

#### For MCQ Questions (Q1-Q40):

1. **Question Number:** Enter `Q01`, `Q02`, ... `Q40`
   - System auto-detects as MCQ
   - Type shows: "Multiple Choice Questions"

2. **Question Stem:** Enter the MCQ question text
   ```
   Example: "Which hormone regulates blood glucose levels?"
   ```

3. **Options (A, B, C, D):** Enter 4 options
   ```
   A) Insulin
   B) Glucagon
   C) Thyroid hormone
   D) Adrenaline
   ```

4. **Correct Answer:** Select from dropdown
   ```
   Select: A) Insulin
   ```

5. **Marks:** Auto-set to 1 (fixed for MCQ)

6. Click **"Add Question"** → Saved!

#### For Image-Based Questions (Q41-Q50):

1. **Question Number:** Enter `Q41`, `Q42`, ... `Q50`
   - System auto-detects as IMAGE
   - Type shows: "Image-Based Questions"

2. **Question Stem:** Enter description
   ```
   Example: "Study the CT scan image below and answer the following questions:"
   ```

3. **Upload Image:** Click file input and select image
   - Supported formats: PNG, JPG, JPEG, GIF
   - Recommended: High-quality medical images

4. **Sub-Questions (a, b, c):**
   
   **Part (a):**
   - Prompt: "Identify the abnormality"
   - Expected Answer: "Fracture in fibula"
   - Marks: 1 (fixed)

   **Part (b):**
   - Prompt: "What is the likely cause?"
   - Expected Answer: "Trauma/Injury"
   - Marks: 1 (fixed)

   **Part (c):**
   - Prompt: "Recommended treatment?"
   - Expected Answer: "Immobilization and physiotherapy"
   - Marks: 1 (fixed)

5. **Total Marks:** Shows as 3 (1 + 1 + 1)

6. Click **"Add Question"** → Saved!

#### For Short Answer Questions (Q51-Q60):

1. **Question Number:** Enter `Q51`, `Q52`, ... `Q60`
   - System auto-detects as SHORT
   - Type shows: "Short Answer Questions"

2. **Question Stem:** Enter the question
   ```
   Example: "Name the bone that connects humerus to carpals"
   ```

3. **Expected/Model Answer:** Enter brief expected answer
   ```
   Example: "Radius and Ulna" or just "Radius"
   ```

4. **Marks:** Auto-set to 1 (fixed for Short Answer)

5. Click **"Add Question"** → Saved!

### Step 4: View Questions by Section

Three tabs at the bottom organize questions by type:

- **MCQ Tab (Q1-Q40)** - Shows all MCQ questions
- **Image Tab (Q41-Q50)** - Shows all image-based questions
- **Short Answer Tab (Q51-Q60)** - Shows all short answer questions

Each question card shows:
- Question number and type
- Preview of the stem
- For MCQ: Options with correct answer highlighted in green
- For Image: Image indicator and part previews
- For Short: Model answer preview

### Step 5: Edit or Delete Questions

**Edit:**
- Click the **pencil icon** on any question card
- Modify any field
- Click **"Update Question"**

**Delete:**
- Click the **trash icon** on any question card
- Confirm deletion
- Question removed from database

---

## 💾 Database Storage

All questions are stored in Supabase with the following structure:

```sql
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY,
  paper_id UUID REFERENCES assessment_exam_papers(id),
  question_number VARCHAR(10),  -- Q01, Q41, Q51, etc.
  type VARCHAR(20),             -- 'mcq', 'image', 'short'
  stem TEXT,                    -- Question text
  marks INTEGER,                -- 1, 3, or 1
  options JSONB,                -- For MCQ: ["Option A", "Option B", "Option C", "Option D"]
  correct_answer TEXT,          -- For MCQ/Short: Correct option/answer
  image_url TEXT,               -- For Image: URL to uploaded image
  parts JSONB,                  -- For Image: [
                                --   {partLabel: 'a', prompt: '...', correctAnswer: '...', marks: 1},
                                --   {partLabel: 'b', prompt: '...', correctAnswer: '...', marks: 1},
                                --   {partLabel: 'c', prompt: '...', correctAnswer: '...', marks: 1}
                                -- ]
  is_active BOOLEAN,            -- true/false
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Example Records:**

```json
{
  "id": "uuid-1",
  "paper_id": "paper-123",
  "question_number": "Q01",
  "type": "mcq",
  "stem": "Which hormone regulates blood glucose?",
  "marks": 1,
  "options": ["Insulin", "Glucagon", "Thyroid", "Adrenaline"],
  "correct_answer": "Insulin",
  "is_active": true,
  "created_at": "2026-09-08T08:00:00Z"
}

{
  "id": "uuid-41",
  "paper_id": "paper-123",
  "question_number": "Q41",
  "type": "image",
  "stem": "Analyze the CT scan and answer the questions",
  "marks": 3,
  "image_url": "https://storage.supabase.co/...ct-scan.jpg",
  "parts": [
    {
      "partLabel": "a",
      "prompt": "Identify the abnormality",
      "correctAnswer": "Fracture in fibula",
      "marks": 1
    },
    {
      "partLabel": "b",
      "prompt": "What is the likely cause?",
      "correctAnswer": "Trauma",
      "marks": 1
    },
    {
      "partLabel": "c",
      "prompt": "Recommended treatment?",
      "correctAnswer": "Immobilization",
      "marks": 1
    }
  ],
  "is_active": true,
  "created_at": "2026-09-08T08:05:00Z"
}

{
  "id": "uuid-51",
  "paper_id": "paper-123",
  "question_number": "Q51",
  "type": "short",
  "stem": "Name the bone connecting humerus to carpals",
  "marks": 1,
  "correct_answer": "Radius",
  "is_active": true,
  "created_at": "2026-09-08T08:10:00Z"
}
```

---

## 🔄 Update & Modify Everything

The admin panel allows you to modify:

### ✅ Can Modify:
- **Question Stem** - Change question text
- **Options** - Add/remove/modify MCQ options
- **Correct Answer** - Change the correct option/answer
- **Marks** - Change marks (respects pattern: MCQ=1, Image=3, Short=1)
- **Images** - Upload/replace images for image-based questions
- **Image Sub-Questions** - Modify part prompts and expected answers
- **Status** - Activate/deactivate questions
- **All Text Fields** - Prompt, expected answers, descriptions

### ❌ Cannot Modify:
- **Question Type** - Once set, type is locked (for data integrity)
- **Question Number** - Must create new if needs changing

---

## 🎯 Validation & Error Handling

The system validates:

1. **Question Number:**
   - Must be Q01-Q60
   - Q01-Q40 must be MCQ
   - Q41-Q50 must be Image-based
   - Q51-Q60 must be Short Answer

2. **MCQ Questions:**
   - All 4 options must be filled
   - Correct answer must be selected
   - Marks fixed at 1

3. **Image-Based Questions:**
   - Image must be uploaded
   - All 3 parts must have prompt and answer
   - Each part marks fixed at 1

4. **Short Answer Questions:**
   - Expected answer required
   - Marks fixed at 1

**Error Messages Display** if validation fails:
- "Question number must be between Q01 and Q60"
- "Question Q05 should be Multiple Choice Question"
- "All MCQ options must be filled"
- "All parts must have prompt and correct answer"

---

## 📊 Admin Panel Features

### Progress Tracking
Real-time cards show:
- Questions added per section
- Total marks per section
- Completion status

### Organized Interface
- **3 Tabs** organize questions by type
- **Quick Stats** show marks and question count
- **Color-Coded** cards for easy identification
  - Blue for MCQ
  - Purple for Image
  - Green for Short Answer

### Question Cards Display
Each card shows:
- Question number and type badge
- Question preview
- For MCQ: All options with correct answer highlighted
- For Image: Image indicator and part previews
- For Short: Model answer preview
- Edit and Delete buttons

### Bulk Operations
- View all questions at once
- Filter by question type
- Quick search (in future versions)

---

## 🔐 How It All Works Together

### Assessment Creation Flow:

```
1. Create Paper
   └─→ Paper gets ID & slug
   
2. Add 60 Questions
   ├─ Q1-Q40: MCQ (40 marks)
   ├─ Q41-Q50: Image (30 marks)
   └─ Q51-Q60: Short (10 marks)
   └─→ All stored in database
   
3. Create Candidates
   └─→ Assign to paper
   
4. Candidate Takes Test
   ├─ Answers Q1-Q40: System auto-scores
   ├─ Answers Q41-Q50: Admin reviews
   └─ Answers Q51-Q60: Admin reviews
   └─→ Results saved in database
   
5. Admin Views Results
   └─→ See all candidate responses
       with their answers vs expected
```

---

## 📱 Example: Complete Paper Setup

### Paper: "Cardiology Fundamentals"

```
Admin Panel → Add Questions

Q01: "Primary valve affected in mitral stenosis?"
     Options: [Aortic, Mitral, Tricuspid, Pulmonary]
     Answer: B) Mitral

Q02: "ECG finding in atrial fibrillation?"
     Options: [Regular QRS, Irregular rhythm, Normal PR, Fixed rate]
     Answer: B) Irregular rhythm

... [Q03-Q39 similar MCQs] ...

Q40: "Leading cause of MI in young patients?"
     Options: [Atherosclerosis, Smoking, Cocaine, Thromboembolism]
     Answer: C) Cocaine

Q41: [Chest X-ray image]
     (a) "Identify the abnormality" → "Cardiomegaly"
     (b) "What condition?" → "Heart failure"
     (c) "Treatment?" → "Diuretics and ACE inhibitors"

... [Q42-Q50 similar image-based] ...

Q51: "Name the hormone that raises heart rate"
     Expected: "Adrenaline" or "Epinephrine"

... [Q52-Q60 similar short answers] ...

TOTAL: 80 Marks
- MCQ: 40 marks
- Image: 30 marks
- Short: 10 marks
```

---

## ✨ Key Benefits

✅ **Enforced Pattern** - System enforces 60-question structure automatically
✅ **Full Admin Control** - Modify everything through admin panel
✅ **Database Persistence** - All data stored in Supabase
✅ **Type Validation** - Correct question types auto-detected and enforced
✅ **Image Support** - Upload images for image-based questions
✅ **Sub-Question Support** - Image questions can have 3 parts with individual marks
✅ **Progress Tracking** - Real-time completion status
✅ **Organized UI** - Questions organized by type in tabs
✅ **Error Messages** - Clear validation errors guide admin

---

## 🎓 Ready to Go!

Your assessment system now has:
✅ Complete 60-question pattern implementation
✅ Full admin panel for management
✅ Database storage for all questions
✅ Auto-detection and validation of question types
✅ Support for MCQ, Image-based, and Short Answer questions
✅ Professional UI with progress tracking

**Start creating assessments now!**

Go to: `http://localhost:3000/admin/assessment/papers/{paperId}/questions`
Password: `ibmp2024`
