# 📊 Visual Guide: Setting Up Assessment Tables in Supabase

## Step-by-Step with Screenshots (Text Guide)

### STEP 1: Open Supabase Dashboard

```
🌐 Go to: https://supabase.com/dashboard
```

You should see:
```
┌─────────────────────────────────────────────────┐
│  Welcome back! Your Projects                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  📁 IBMP (or your project name)                 │
│     Click on this                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### STEP 2: Click on IBMP Project

**You should now see the Supabase project dashboard**

```
┌──────────────────────────────────────────────┐
│ IBMP                                     < | │
├──────────────────────────────────────────────┤
│                                              │
│ Left Sidebar:                                │
│ 🏠 Home                                      │
│ 📑 SQL Editor  ← CLICK HERE                 │
│ 📋 Tables                                    │
│ 🔐 Auth                                      │
│ 📦 Storage                                   │
│ ⚙️  Settings                                 │
│                                              │
└──────────────────────────────────────────────┘
```

---

### STEP 3: Click "SQL Editor"

**In the left sidebar, click on "SQL Editor"**

```
┌──────────────────────────────────────────────┐
│ SQL Editor                                   │
├──────────────────────────────────────────────┤
│                                              │
│  Your queries will be listed here            │
│                                              │
│  [+ New Query] ← CLICK THIS BUTTON           │
│                                              │
└──────────────────────────────────────────────┘
```

---

### STEP 4: Click "+ New Query"

**You should see an empty SQL editor**

```
┌──────────────────────────────────────────────┐
│ New Query                  [Run] [Format]    │
├──────────────────────────────────────────────┤
│                                              │
│  -- SQL Editor Window                        │
│  -- Start typing SQL here                    │
│  |                                           │
│  |                                           │
│  |                                           │
│                                              │
└──────────────────────────────────────────────┘
```

---

### STEP 5: Open the SQL File

**On your computer:**

1. Open your project folder: `c:\Users\john\Downloads\IBMP-main`
2. Open: `migrations/004_create_assessment_tables.sql`
3. You should see SQL code starting with:
   ```sql
   -- Assessment Candidates Table
   -- Stores candidate information...
   CREATE TABLE IF NOT EXISTS assessment_candidates (
   ```

---

### STEP 6: Copy ALL the SQL

**In the SQL file editor:**

1. Press: `Ctrl + A` (Select All)
2. Press: `Ctrl + C` (Copy)

You should have copied everything starting from the comment and including all the SQL statements.

---

### STEP 7: Paste into Supabase

**Back in Supabase SQL Editor:**

1. Click in the SQL editor window
2. Press: `Ctrl + V` (Paste)

You should now see the SQL code in Supabase:

```
┌──────────────────────────────────────────────┐
│ New Query              [▶ Run] [Format]      │
├──────────────────────────────────────────────┤
│ -- Assessment Candidates Table               │
│ -- Stores candidate information and their... │
│ CREATE TABLE IF NOT EXISTS assessment_ca...│
│ id UUID PRIMARY KEY DEFAULT gen_random_u...│
│ full_name TEXT NOT NULL,                    │
│ enrollment_id TEXT NOT NULL UNIQUE,         │
│ ...                                          │
│                                              │
└──────────────────────────────────────────────┘
```

---

### STEP 8: Run the Query

**Click the blue "Run" button**

```
You should see:
✅ Query executed successfully

And in the sidebar:
📋 Tables
  ├── assessment_candidates
  ├── assessment_attempts
  ├── assessment_responses
  └── assessment_settings
```

---

## ✅ How to Verify It Worked

### Method 1: Check Tables in Supabase
1. Click **Tables** in left sidebar
2. You should see 4 new tables:
   - ✅ `assessment_candidates`
   - ✅ `assessment_attempts`
   - ✅ `assessment_responses`
   - ✅ `assessment_settings`

### Method 2: Access Admin Panel
1. Go to: http://localhost:3000/admin
2. Log in with: `Rubeena@2026`
3. Look for **Assessment** in sidebar
4. Click it - you should see Assessment Admin Hub

### Method 3: Check Browser Console
1. Open: http://localhost:3000/admin/assessment
2. Press: `F12` (Developer Tools)
3. Check Console tab for errors
4. Should NOT see "table doesn't exist" errors

---

## 🆘 Troubleshooting

### Error: "No active project"
→ Make sure you're logged into Supabase and selected the IBMP project

### Error: "Permission denied"
→ Make sure you're accessing as the project owner/admin

### Error: "Syntax error in SQL"
→ Make sure you copied the ENTIRE SQL file, not just part of it

### The SQL editor is empty
→ You need to paste again. Go back to STEP 6

### Supabase won't let me run the query
→ Try clicking "Format" first to format the SQL, then click "Run"

---

## 📝 Alternative: Manual Table Creation

If the above doesn't work, you can create tables manually:

1. Click **SQL Editor**
2. Click **+ New Query**
3. Copy and paste JUST ONE of these at a time:

**Table 1: Assessment Candidates**
```sql
CREATE TABLE IF NOT EXISTS assessment_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  enrollment_id TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  exam_type TEXT DEFAULT 'Pain Medicine (Set A)',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);
```

Then run.

**Table 2: Assessment Attempts**
```sql
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
CREATE INDEX idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);
CREATE INDEX idx_assessment_attempts_status ON assessment_attempts(status);
```

Then run.

**... and so on for the remaining tables**

---

## ✨ You Made It!

Once you see the 4 tables created in Supabase, you're done! 

**Assessment Admin System is ready to use!**

🎉 Now go to: http://localhost:3000/admin/assessment

---

*Still stuck?*
- See: `SETUP_ASSESSMENT_QUICK.md`
- See: `ASSESSMENT_SETUP.md`
- See: `ASSESSMENT_ADMIN_SYSTEM.md`
