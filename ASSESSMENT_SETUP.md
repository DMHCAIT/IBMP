# Assessment Admin System - Setup Guide

## Quick Start

The Assessment Admin Panel is now visible in the admin sidebar. Before you can use it, you need to create the database tables in Supabase.

### Step 1: Create Database Tables

Choose one of the methods below:

#### Method 1: PowerShell Script (Recommended for Windows)

```powershell
# Run this in PowerShell in the project root
.\setup-assessment-db.ps1
```

#### Method 2: Bash Script (Linux/Mac)

```bash
# Run this in terminal in the project root
bash setup-assessment-db.sh
```

#### Method 3: Manual Setup via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your **IBMP** project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the SQL from `migrations/004_create_assessment_tables.sql`
6. Click **Run**

#### Method 4: Using psql Command

```bash
# From your terminal (requires PostgreSQL client installed)
psql -h aws-1-ap-south-1.pooler.supabase.com \
     -p 6543 \
     -U postgres.nfpvilygpjosfujdpcdg \
     -d postgres \
     -f migrations/004_create_assessment_tables.sql
# Password: Dmhcawebsite123
```

### Step 2: Verify Setup

After running the migration, you should see these tables in your Supabase:
- ✅ `assessment_candidates`
- ✅ `assessment_attempts`
- ✅ `assessment_responses`
- ✅ `assessment_settings`

### Step 3: Access Assessment Admin Panel

1. Go to http://localhost:3000/admin
2. Log in with your admin password: `Rubeena@2026`
3. Click **Assessment** in the left sidebar
4. You should now see the Assessment Admin Hub with options for:
   - ✅ Manage Candidates
   - ✅ View Results
   - ✅ Question Bank
   - ✅ Settings

## Using the Assessment System

### As an Admin

1. **Add Candidate**
   - Go to Assessment > Candidates
   - Click "Add Candidate"
   - Fill in: Full Name, Enrollment ID, Password, Email, Phone, Exam Type
   - Click "Add Candidate"

2. **View Results**
   - Go to Assessment > Results
   - See all attempts with scores
   - Click to view detailed responses

3. **Manage Settings**
   - Go to Assessment > Settings
   - Configure exam duration, marks, passing criteria

### As a Student

1. Navigate to http://localhost:3000/assessment
2. Enter your credentials:
   - Full Name (required)
   - Enrollment ID (from admin)
   - Password (from admin)
3. Click "Start Assessment"
4. Complete the 60-question exam
5. Submit responses
6. View your score

## Features

✅ **One-Time Assessment**
- Each candidate can start assessment only once
- Second attempt shows "Limit reached" message

✅ **Automatic Response Storage**
- All answers saved to database
- MCQ questions auto-scored
- Text answers stored for manual review

✅ **Admin Dashboard**
- View all attempts
- Filter by status (submitted/in-progress)
- Review individual responses
- Manual scoring for subjective questions

✅ **Secure Authentication**
- Password-protected candidate access
- Admin authorization
- Session-based access control

## Troubleshooting

### Tables Not Created?

**Error: psql command not found**
→ Install PostgreSQL client from https://www.postgresql.org/download/

**Error: Connection refused**
→ Check your .env.local for correct Supabase URL and credentials

**Error: Permission denied**
→ Verify your SUPABASE_SERVICE_ROLE_KEY in .env.local

### Candidate Can't Access Assessment?

1. Verify candidate was created in admin panel
2. Check that enrollment ID and password match exactly (case-sensitive)
3. Ensure candidate status is "active"

### Can't See Assessment in Admin Sidebar?

1. Clear your browser cache (Ctrl+Shift+Delete)
2. Hard refresh the page (Ctrl+Shift+R)
3. Log out and log back in

## Technical Details

### Database Schema

**assessment_candidates**
- Stores candidate info and credentials
- One record per candidate
- Unique enrollment_id constraint

**assessment_attempts**
- Tracks each assessment attempt
- One record per attempt per candidate
- Status: in-progress or completed
- Stores score and submission time

**assessment_responses**
- Individual question responses
- One record per question per attempt
- Stores: answer text, correctness, marks
- Supports MCQ, text, and image responses

**assessment_settings**
- Exam configuration
- Exam duration, total marks, passing criteria
- Used by system for validation

### API Endpoints

```
POST /api/assessment/verify-candidate     - Verify candidate credentials
POST /api/assessment/submit                - Submit assessment responses
GET  /api/admin/assessment/candidates      - List candidates
POST /api/admin/assessment/candidates      - Create candidate
GET  /api/admin/assessment/results         - View all results
```

## File Locations

- Migration SQL: `migrations/004_create_assessment_tables.sql`
- Setup Scripts: 
  - `setup-assessment-db.ps1` (PowerShell)
  - `setup-assessment-db.sh` (Bash)
- Admin Pages: `app/admin/assessment/`
- Assessment Page: `app/assessment/page.tsx`
- API Routes: `app/api/assessment/` and `app/api/admin/assessment/`

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Verify .env.local credentials
4. Check Supabase dashboard for table status
5. See ASSESSMENT_ADMIN_SYSTEM.md for detailed documentation

---

**Happy Testing!** 🎉

You're all set to use the Assessment Admin Panel. Start by adding a candidate and then take the assessment!
