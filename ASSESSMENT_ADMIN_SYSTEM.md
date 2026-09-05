# Assessment Admin System Documentation

## Overview

A complete assessment management system for the IBMP Pain Medicine examination with admin controls, candidate management, and response tracking.

## Features Implemented

### 1. Candidate Management
- **Add Candidates**: Admin can create candidates with:
  - Full name
  - Unique enrollment ID
  - Password
  - Email and phone (optional)
  - Exam type assignment
- **View Candidates**: List all registered candidates with their details
- **Edit Candidates**: Modify candidate information
- **Delete Candidates**: Remove candidates from the system
- **Status Tracking**: Track active, inactive, and completed candidates

### 2. Assessment Authentication & Authorization
- **One-Time Assessment Rule**: Each candidate can start assessment only once
- **Credential Verification**: 
  - Full name verification (for identity confirmation)
  - Enrollment ID verification
  - Password authentication
- **Attempt Limiting**: 
  - If candidate already started → "Limit reached" message
  - Prevents multiple attempts for same candidate
  - Stored in `assessment_attempts` table

### 3. Response Tracking
- **Automatic Response Storage**:
  - MCQ selections and correctness
  - Short answer text responses
  - Image-based question part responses
- **Question Flagging**: Track flagged questions
- **Metadata Storage**:
  - Start time
  - Submission time
  - Duration
  - Auto-scoring for MCQs

### 4. Admin Results Dashboard
- **Attempt Listing**: View all candidate assessments
- **Filter & Search**: By enrollment ID, name, status
- **Detailed View**: Individual attempt with all responses
- **Score Display**: MCQ scores calculated automatically
- **Manual Scoring Area**: For image-based and short-answer questions

### 5. Assessment Settings
- Configure exam duration
- Set total marks and passing criteria
- Adjust passing percentage
- Manage exam metadata

## Database Schema

### Tables Created

#### `assessment_candidates`
Stores candidate information
```sql
id (UUID) - Primary key
full_name (TEXT)
enrollment_id (TEXT) - Unique
password (TEXT)
email (TEXT)
phone (TEXT)
exam_type (TEXT) - Default: 'Pain Medicine (Set A)'
status (TEXT) - active, inactive, completed
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### `assessment_attempts`
Tracks each assessment attempt
```sql
id (UUID) - Primary key
candidate_id (UUID) - Foreign key
enrollment_id (TEXT)
started_at (TIMESTAMP)
submitted_at (TIMESTAMP)
status (TEXT) - in-progress, completed
total_score (FLOAT)
passing_score (FLOAT)
result (TEXT) - passed, failed
```

#### `assessment_responses`
Stores individual question responses
```sql
id (UUID) - Primary key
attempt_id (UUID) - Foreign key
candidate_id (UUID) - Foreign key
question_id (TEXT)
question_type (TEXT) - mcq, image, short-answer
response_text (TEXT)
response_json (JSONB)
is_correct (BOOLEAN)
marks_obtained (FLOAT)
max_marks (FLOAT)
is_flagged (BOOLEAN)
created_at (TIMESTAMP)
```

#### `assessment_settings`
Stores exam configuration
```sql
id (UUID) - Primary key
exam_type (TEXT) - Unique
duration_minutes (INTEGER)
total_questions (INTEGER)
total_marks (FLOAT)
passing_marks (FLOAT)
passing_percentage (FLOAT)
description (TEXT)
```

## API Endpoints

### Candidate Verification
**POST** `/api/assessment/verify-candidate`
- Verifies candidate credentials
- Checks attempt limit
- Creates new attempt record if valid
- Returns: `{ candidate, attempt }`

Request body:
```json
{
  "enrollmentId": "IBMP-2026-9842",
  "password": "tempPassword123"
}
```

### Assessment Submission
**POST** `/api/assessment/submit`
- Stores all question responses
- Calculates MCQ scores
- Updates attempt as completed
- Returns: `{ score, totalMarks, percentage }`

Request body:
```json
{
  "attemptId": "uuid",
  "candidateId": "uuid",
  "mcqAnswers": { "q1": "a", "q2": "b" },
  "textAnswers": { "q3": "answer text" },
  "flaggedQuestions": { "q1": true },
  "examData": { /* exam.seed.json data */ }
}
```

### Admin: Manage Candidates
**GET** `/api/admin/assessment/candidates`
- List all candidates
- Returns: Array of candidates

**POST** `/api/admin/assessment/candidates`
- Create new candidate
- Request body: `{ fullName, enrollmentId, password, email, phone, examType }`

**PUT** `/api/admin/assessment/candidates/[id]`
- Update candidate info

**DELETE** `/api/admin/assessment/candidates/[id]`
- Delete candidate

### Admin: View Results
**GET** `/api/admin/assessment/results`
- List all attempts
- Optional query: `?candidateId=uuid`

**GET** `/api/admin/assessment/results/[attemptId]`
- Get detailed responses for specific attempt

## User Interface

### Candidate Flow (Assessment Page)
1. **LOBBY State**: Enter credentials
   - Full name, enrollment ID, password
   - Verification via API
   - Error handling for invalid/duplicate attempts
2. **EXAM State**: Take assessment
   - 120-minute timer
   - Question palette with 60 questions
   - Answer tracking (MCQ, text, flagged)
   - Marks breakdown sidebar
3. **RESULT State**: View results
   - Score display
   - Question review with rationales
   - Optional result export

### Admin Flow (Assessment Admin Panel)
1. **Overview** (`/admin/assessment`)
   - Quick stats dashboard
   - Links to all admin features

2. **Candidates** (`/admin/assessment/candidates`)
   - Add candidates form
   - Candidates table with CRUD actions
   - Status indicators

3. **Results** (`/admin/assessment/results`)
   - Attempts table
   - Status filters
   - Link to detailed view

4. **Result Details** (`/admin/assessment/results/[id]`)
   - Attempt information
   - Response review
   - Manual scoring area

5. **Questions** (`/admin/assessment/questions`)
   - Question bank view
   - Edit mode (future feature)
   - Scoring configuration

6. **Settings** (`/admin/assessment/settings`)
   - Exam configuration
   - Duration, marks, passing criteria
   - Metadata

## Security Features

### Row Level Security (RLS)
- All assessment tables have RLS enabled
- Service role key used for admin operations
- Policies configured for data access

### Candidate Authentication
- Password-based access
- Enrollment ID verification
- One-time attempt limitation

### Admin Authorization
- Uses existing admin authentication
- Password-protected admin panel
- Session-based access

## Migration & Deployment

### Setup Instructions
1. **Create Supabase tables** (run migration):
   ```bash
   supabase migration up --connection-string $DATABASE_URL < migrations/004_create_assessment_tables.sql
   ```

2. **Environment Variables** (ensure set):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Test Assessment**:
   - Navigate to `http://localhost:3000/assessment`
   - Add candidate via admin panel
   - Use credentials to take assessment

4. **Access Admin Panel**:
   - Navigate to `http://localhost:3000/admin/assessment`
   - View and manage assessment system

## Current Implementation Status

✅ **Completed**:
- Database schema and migrations
- API endpoints for verification and submission
- Admin candidates management UI
- Admin results viewing UI
- Assessment page integration
- One-time attempt limiting
- Response storage and tracking
- Admin layout and navigation

🔄 **In Progress/Future**:
- Manual scoring interface for non-MCQ questions
- Batch candidate upload (CSV)
- Advanced filtering and search
- Results export to Excel/PDF
- Email notifications to candidates
- Candidate password reset functionality
- Results analytics dashboard

## File Locations

- **Database**: `migrations/004_create_assessment_tables.sql`
- **APIs**: 
  - `app/api/assessment/verify-candidate/route.ts`
  - `app/api/assessment/submit/route.ts`
  - `app/api/admin/assessment/candidates/route.ts`
  - `app/api/admin/assessment/results/route.ts`
- **UI Pages**:
  - `app/assessment/page.tsx` (candidate assessment)
  - `app/admin/assessment/page.tsx` (main admin hub)
  - `app/admin/assessment/candidates/page.tsx`
  - `app/admin/assessment/results/page.tsx`
  - `app/admin/assessment/questions/page.tsx`
  - `app/admin/assessment/settings/page.tsx`
  - `app/admin/assessment/layout.tsx` (navigation)

## Testing Checklist

- [ ] Create candidate via admin panel
- [ ] Attempt assessment with correct credentials
- [ ] Verify one-time limit message on second attempt
- [ ] Submit assessment and verify responses saved
- [ ] View results in admin panel
- [ ] Check response details for specific attempt
- [ ] Test invalid credentials handling
- [ ] Test enrollment ID uniqueness validation
- [ ] Verify timer and submission flow

## Support & Next Steps

For questions or additional features:
1. Check API responses for error messages
2. Review browser console for client-side errors
3. Check server logs for API errors
4. Verify Supabase connection and RLS policies
5. Ensure all environment variables are set correctly
