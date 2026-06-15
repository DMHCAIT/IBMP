# Storage Bucket Setup via Supabase UI

Instead of using SQL (which requires owner permissions), configure storage policies through the Supabase dashboard.

## Setup Steps:

### 1. Create Public Bucket (if it doesn't exist)
1. Go to **Supabase Dashboard → Storage**
2. Click **New Bucket**
3. Name: `public`
4. Set to **Public** (toggle enabled)
5. Click **Create Bucket**

### 2. Set Storage Policies via UI

1. Go to **Supabase Dashboard → Storage → public (bucket)**
2. Click **Policies** tab
3. Click **New Policy**
4. Select **For INSERT** → **With custom expression**
   - Expression: `true` (allow all inserts)
   - Click **Review** → **Save policy**

5. Click **New Policy** again
6. Select **For UPDATE** → **With custom expression**
   - Expression: `true`
   - Click **Review** → **Save policy**

7. Click **New Policy** again
8. Select **For DELETE** → **With custom expression**
   - Expression: `true`
   - Click **Review** → **Save policy**

9. Click **New Policy** again
10. Select **For SELECT** → **With custom expression**
    - Expression: `true`
    - Click **Review** → **Save policy**

### 3. Redeploy
After setting up bucket policies:
1. Go to **Vercel → Deployments**
2. Click **Redeploy** on the latest deployment

Image uploads should now work! ✓

## Why SQL Didn't Work

The `storage.objects` table is a Supabase system table. Your account doesn't have owner permissions on it. Using the Storage UI bypasses this limitation and is the recommended approach.
