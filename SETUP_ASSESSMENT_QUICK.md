# ⚡ Quick Setup: Create Assessment Tables

## The Easiest Way - Use Supabase Dashboard

### Step 1: Open Supabase Dashboard
👉 Go to: https://supabase.com/dashboard

### Step 2: Select IBMP Project
- Look for your project in the list
- Click on it to open

### Step 3: Open SQL Editor
In the left sidebar, click:
```
🔤 SQL Editor
```

### Step 4: Create New Query
Click the button:
```
+ New Query
```

### Step 5: Copy the SQL
1. Open this file: `migrations/004_create_assessment_tables.sql`
2. Select ALL the SQL code (Ctrl+A)
3. Copy it (Ctrl+C)

### Step 6: Paste into Supabase
- Paste the SQL into the Supabase SQL Editor (Ctrl+V)

### Step 7: Run the Query
Click the button:
```
▶️ Run
```

---

## What Gets Created

Once you run the SQL, you'll see these 4 new tables in Supabase:

✅ **assessment_candidates**
   - Stores candidate info: name, enrollment ID, password, email, phone

✅ **assessment_attempts**
   - Tracks each assessment attempt with status and score

✅ **assessment_responses**
   - Stores all question responses (MCQ answers, text, flagged questions)

✅ **assessment_settings**
   - Stores exam configuration (duration, marks, passing criteria)

---

## After Setup: Access Assessment Admin

Once tables are created:

1. Go to: http://localhost:3000/admin
2. Log in with: `Rubeena@2026`
3. Click **Assessment** in the sidebar
4. You'll see:
   - 📋 Candidates Management
   - 📊 Results Viewer
   - ⚙️ Settings

---

## Troubleshooting

### Q: Where is my Supabase project?
A: Check your email for "Welcome to Supabase" or go to supabase.com/dashboard

### Q: I see an error running the SQL
A: Make sure you:
   - ✓ Are logged into Supabase
   - ✓ Selected the right project (IBMP)
   - ✓ Copied the entire SQL file (all tables should be included)

### Q: Assessment still not showing in Admin?
A: 
   - Hard refresh browser: Ctrl+Shift+R
   - Log out and log back in
   - Check browser console (F12) for errors

### Q: Tables created but Assessment Admin shows errors?
A: Make sure:
   - ✓ All 4 tables exist in Supabase (check Tables in left sidebar)
   - ✓ Your .env.local has SUPABASE_SERVICE_ROLE_KEY set
   - ✓ Dev server is running (npm run dev)

---

## Next: Test the System

### Add a Candidate (Admin)
1. Go to: http://localhost:3000/admin/assessment/candidates
2. Click "Add Candidate"
3. Fill in:
   - Full Name: "Dr. Test User"
   - Enrollment ID: "TEST-2026-001"
   - Password: "testpass123"
4. Click "Add Candidate"

### Take Assessment (Student)
1. Go to: http://localhost:3000/assessment
2. Enter credentials from above
3. Click "Start Assessment"
4. Complete the exam and submit

### View Results (Admin)
1. Go to: http://localhost:3000/admin/assessment/results
2. Click the result to see detailed responses

---

## File Locations

- **SQL File**: `migrations/004_create_assessment_tables.sql`
- **Setup Scripts**: 
  - `setup-assessment-db.ps1` (PowerShell - requires psql)
  - `setup-assessment-db.mjs` (Node.js - coming soon)
- **Admin Panel**: `app/admin/assessment/`
- **Assessment Page**: `app/assessment/`

---

## Still Need Help?

1. Check `ASSESSMENT_SETUP.md` for detailed instructions
2. Check `ASSESSMENT_ADMIN_SYSTEM.md` for complete documentation
3. See browser console (F12) for error messages
4. Check server terminal (npm run dev) for API errors

---

**You're all set!** 🎉 

Assessment Admin Panel is now available at: http://localhost:3000/admin/assessment
