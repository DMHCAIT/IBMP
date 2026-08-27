# 🔧 FIXES APPLIED & SETUP INSTRUCTIONS

## ✅ What's Fixed

### 1. **Upload Button Visibility**
- ✅ Buttons now fully visible with better styling
- ✅ Changed layout from side-by-side to stacked (vertical layout)
- ✅ Added color-coded buttons:
  - **Image Upload**: Blue button with 📤 icon
  - **Video Upload**: Red button with 🎥 icon
- ✅ Better spacing and padding

### 2. **UI Improvements**
- ✅ Larger, more prominent upload buttons
- ✅ Clearer placeholder text
- ✅ Better visual hierarchy
- ✅ Improved mobile responsiveness

---

## ❌ Current Issue: "Bucket Not Found"

The error **"Upload failed: Bucket not found"** means the `public` storage bucket doesn't exist in your Supabase project.

### Solution: Create the Public Bucket

---

## 📋 Step-by-Step Setup

### Method 1: Using PowerShell Script (Recommended for Windows)

**1. Open PowerShell in VS Code Terminal**
```powershell
# Navigate to project folder (should already be there)
cd C:\Users\john\OneDrive\Desktop\IBMP-main
```

**2. Set the service role key from .env.local**
```powershell
# First, view your .env.local file to get the SUPABASE_SERVICE_ROLE_KEY
type .env.local

# Copy the SUPABASE_SERVICE_ROLE_KEY value, then run:
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8"
```

**3. Run the setup script**
```powershell
.\setup-supabase-bucket.ps1
```

**Expected output:**
```
🔧 Setting up Supabase Storage Bucket...
📍 Project: nfpvilygpjosfujdpcdg
🪣 Bucket: public

1️⃣  Creating bucket 'public'...
✅ Bucket created successfully!

2️⃣  Ensuring bucket is set to public...
✅ Bucket updated to public!

✅ Setup complete!
```

---

### Method 2: Manual Setup via Supabase Dashboard

If the script doesn't work, follow these manual steps:

**1. Go to Supabase Dashboard**
- URL: https://app.supabase.com
- Login with your account
- Select the IBMP project

**2. Navigate to Storage**
- Left sidebar → Storage
- You should see the storage buckets page

**3. Create Public Bucket**
- Click **"Create Bucket"** button
- Enter name: `public`
- **IMPORTANT**: Enable **"Public bucket"** toggle/checkbox
- Click **"Create Bucket"**

**4. Set Bucket Permissions**

After bucket is created:
- Click on the `public` bucket to open it
- Go to **"Policies"** tab
- Click **"New Policy"** or **"Add Policy"**

**Add these policies:**

**Policy 1: Public Read (Allow anyone to read files)**
```sql
CREATE POLICY "public-read" ON storage.objects
FOR SELECT USING (bucket_id = 'public');
```

**Policy 2: Public Upload (Allow anyone to upload)**
```sql
CREATE POLICY "public-upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'public');
```

Or use the **Supabase SQL Editor**:
- Left sidebar → SQL Editor
- New Query
- Paste the SQL above
- Click **"Run"**

**5. Verify Setup**
- Go back to Storage
- You should see `public` bucket listed
- Icon shows it's "Public"
- Try uploading a test file

---

## 🧪 Test the Upload Feature

After setting up the bucket:

**1. Go to Admin Courses Page**
```
http://localhost:3000/admin/courses
```

**2. Click Edit on Any Course**
- Find the course
- Click the edit/pencil icon in Actions column

**3. Scroll to "Image URL or Upload"**
- Click the blue **"📤 Upload Image"** button
- Select a small test image (JPG, PNG)
- Check browser console (F12) for upload progress

**Expected console output:**
```
Starting image upload: { 
  filename: "course-1234567890.jpg", 
  fileSize: 2048576, 
  fileType: "image/jpeg" 
}
Upload successful: { path: "public/course-1234567890.jpg", ... }
Public URL retrieved: https://nfpvilygpjosfujdpcdg.supabase.co/storage/v1/object/public/public/course-1234567890.jpg
```

**4. Test Video Upload**
- Expand "Watch Overview (Video)" section
- Click red **"🎥 Upload Video"** button
- Select a small test video (MP4, WebM)
- Or paste a YouTube URL

**5. Save and Verify**
- Click **"Save Changes"**
- Go to public website and check if content displays

---

## 🚨 Troubleshooting

### Still Getting "Bucket not found"?

**Check 1: Verify bucket exists**
- Supabase Dashboard → Storage
- Do you see `public` bucket listed?
- If not, create it manually (Method 2 above)

**Check 2: Verify .env.local has correct URL**
```
NEXT_PUBLIC_SUPABASE_URL=https://nfpvilygpjosfujdpcdg.supabase.co
```

**Check 3: Restart dev server**
```powershell
# In terminal, press Ctrl+C to stop dev server
# Then run:
npm run dev
```

**Check 4: Check browser console (F12)**
- Console tab shows specific error
- Copy exact error message
- Search for it in error documentation

### "Permission denied" or "401 Unauthorized"?

- Verify .env.local credentials are correct
- Check bucket policies are set correctly
- Try adding a more permissive policy:
  ```sql
  CREATE POLICY "Allow all" ON storage.objects
  FOR INSERT, SELECT TO public
  WITH CHECK (bucket_id = 'public');
  ```

### Upload succeeds but file not visible?

- Check bucket is marked as "Public" in Supabase
- Try accessing public URL directly in browser
- Verify file permissions in Supabase Storage

---

## 📝 Summary

| Step | Status | Action |
|------|--------|--------|
| Fix UI buttons | ✅ Done | Code updated |
| Create bucket | ⏳ Needed | Follow Method 1 or 2 above |
| Set permissions | ⏳ Needed | Add policies to bucket |
| Test upload | ⏳ Needed | Try uploading test image |
| Deploy changes | ⏳ Optional | When ready for production |

---

## 🎯 Quick Checklist

- [ ] Read "Bucket not found" error message
- [ ] Choose setup method (Script or Manual)
- [ ] Follow steps in chosen method
- [ ] Verify bucket exists in Supabase
- [ ] Test upload in admin panel
- [ ] Check browser console for logs
- [ ] Upload appears on website

---

## 📞 Need Help?

1. **Check console errors (F12)**
   - Shows specific error messages
   - Copy full error text

2. **Verify Supabase project**
   - Project ID: `nfpvilygpjosfujdpcdg`
   - URL: `https://nfpvilygpjosfujdpcdg.supabase.co`

3. **Check network tab (F12 → Network)**
   - Look for requests to Supabase
   - Check status codes and responses

4. **Common issues**
   - Bucket doesn't exist → Create it
   - Wrong credentials → Check .env.local
   - File too large → Use smaller files
   - Browser cache → Hard refresh (Ctrl+Shift+R)

---

**You're almost there! The UI is fixed, now just set up the Supabase bucket and uploads will work! 🚀**
