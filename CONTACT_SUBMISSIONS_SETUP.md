# Contact Submissions Database Setup

## Overview
The contact form submissions are stored in a Supabase table called `contact_submissions`. If this table doesn't exist, submissions are automatically saved to a local JSON file (`data/contact-submissions.json`) as a fallback.

## Setting Up the Supabase Table

### Option 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
```

5. Click **Run** to execute the query
6. The table is now ready to store contact submissions!

### Option 2: Using Supabase UI

1. Go to **Table Editor** in your Supabase dashboard
2. Click **Create a new table**
3. Enter table name: `contact_submissions`
4. Add the following columns:
   - `id` (Type: text, Primary Key: ✓)
   - `name` (Type: text, Required: ✓)
   - `email` (Type: text, Required: ✓)
   - `subject` (Type: text, Required: ✗)
   - `message` (Type: text, Required: ✓)
   - `created_at` (Type: timestamp, Default: now())

5. Click **Save**

## Accessing Contact Submissions

### In the Admin Panel
1. Go to `/admin/contact`
2. Click the **View Submissions** button in the top right
3. Browse all contact form submissions with details

### Direct API Access
You can also fetch submissions programmatically:

```bash
# Get all contact submissions
curl http://localhost:3001/api/contact/submissions

# Response format
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Application Inquiry",
      "message": "I would like to know more about...",
      "created_at": "2024-06-06T12:34:56.000Z"
    }
  ]
}
```

## Features

✅ **Auto-fallback**: Submissions are saved to local JSON if Supabase is unavailable
✅ **Admin Dashboard**: View all submissions with a clean interface
✅ **Email Integration**: Click to reply directly from the admin panel
✅ **Search & Filter**: Find submissions by name, email, or date
✅ **Copy to Clipboard**: Easily copy contact details
✅ **Auto-refresh**: Admin panel refreshes every 30 seconds

## Troubleshooting

**Q: Submissions aren't appearing in the admin panel**
A: Check if the Supabase table exists. If not, ensure submissions are being saved to `data/contact-submissions.json`. You can also check the browser console for errors.

**Q: Getting "Table does not exist" error**
A: Create the table using the SQL from Option 1 above in your Supabase SQL Editor.

**Q: How do I delete submissions?**
A: Currently, the admin panel shows all submissions but deletion is not yet implemented. You can manually delete from Supabase SQL Editor or edit the JSON file directly.

## Next Steps

1. ✅ Set up the Supabase table (see instructions above)
2. ✅ Test by submitting a form at `/contact`
3. ✅ View submissions in admin panel at `/admin/contact/submissions`
4. Optional: Configure email notifications when new submissions arrive
