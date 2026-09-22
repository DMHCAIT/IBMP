# Quick Setup Guide: Database Image Storage

## Overview
Store assessment question images directly in the database instead of relying on external file paths.

## ⚡ Quick Steps (5 minutes)

### Step 1: Apply Database Migration
**Option A: Via Supabase Dashboard**
1. Go to Supabase → Your Project → SQL Editor
2. Click "New Query"
3. Copy contents from: `migrations/006_add_image_data_column.sql`
4. Paste into SQL editor
5. Click "Run"

**Option B: Via CLI (if you have psql)**
```bash
psql -h your-db-host -U your-user -d your-db-name -f migrations/006_add_image_data_column.sql
```

### Step 2: Upload Images to Database
```bash
# This reads actual image files and stores in database
node upload-question-images.mjs
```

**Expected output:**
```
📸 Starting assessment question images upload (WITH BINARY DATA)...
✓ Loaded 60 questions from seed file
✓ Found 10 image-based questions
✅ Uploaded image for Q41: figure_10.png
✅ Uploaded image for Q42: figure_01.png
...
✨ Images stored in database!
```

### Step 3: Verify Installation
```bash
node verify-image-storage.mjs
```

**Expected output:**
```
✅ image_data_base64 column exists
✅ Total images in database: 10
✅ Images with base64 data: 10
✅ API endpoint working - returned 10 images
✅ Images have dataUri property (base64 embedded)
✅ All images stored in database with base64 data
✅ Database image storage is fully configured
```

### Step 4: Test in Browser
1. Start the development server (if not running): `npm run dev`
2. Navigate to: http://localhost:3000/assessment
3. Complete candidate login
4. Navigate to an image-based question (Q41-Q50)
5. Verify images display correctly

---

## 🔄 What's Changed

### Database
- **New columns** in `assessment_question_images` table:
  - `image_data` (BYTEA) - binary image data
  - `image_data_base64` (TEXT) - base64 encoded data

### API
- **New endpoint**: `/api/admin/assessment/questions/images-data`
  - Returns images with embedded base64 data
  - Format: complete data URIs (`data:image/png;base64,...`)

### Assessment Page
- Loads images from database API
- Uses base64 data directly (no extra HTTP requests)
- Falls back to URLs if database data unavailable

---

## 📊 Verification Checklist

- [ ] Migration applied successfully (no SQL errors)
- [ ] `upload-question-images.mjs` completed without errors
- [ ] `verify-image-storage.mjs` shows all checks ✅
- [ ] Assessment page displays Q41-Q50 images correctly
- [ ] Browser console shows no image-loading errors

---

## 🚀 Deployment

### Before Deploying to Production

1. **Test locally first**
   ```bash
   npm run dev
   # Visit http://localhost:3000/assessment
   # Test image display
   ```

2. **Run verification**
   ```bash
   node verify-image-storage.mjs
   ```

3. **Check database size**
   - Base64 images increase DB size by ~33%
   - Verify your Supabase plan has sufficient storage

4. **Backup database** (recommended)
   - Via Supabase: Settings → Backups

5. **Deploy to production**
   - Push code changes
   - Run migration on production database
   - Run upload script on production
   - Verify with `verify-image-storage.mjs`

---

## ⚙️ How It Works

### Image Storage Flow
```
1. Admin/System runs: node upload-question-images.mjs
   ↓
2. Script reads actual image files from /public/quiz-assets/
   ↓
3. Converts to base64 format
   ↓
4. Stores in database (image_data_base64 column)
   ↓
5. Assessment page fetches from API endpoint
   ↓
6. Images displayed using data URIs
```

### API Response Example
```json
{
  "id": "uuid-123",
  "questionId": "q41-id",
  "title": "Q41 Figure",
  "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "mimeType": "image/png"
}
```

### HTML Rendering
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." />
```

---

## 🆘 Troubleshooting

### Images Not Displaying

**Check 1: Verify migration applied**
```bash
# In Supabase SQL editor, run:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'assessment_question_images' 
  AND column_name = 'image_data_base64';
```
Expected: Should return one row

**Check 2: Verify images uploaded**
```bash
node verify-image-storage.mjs
```
Look for: "Images with base64 data: X"

**Check 3: Check browser console**
- Open DevTools (F12)
- Go to Console tab
- Look for any error messages when assessment page loads

### Large Database Size
- Base64 encoding adds ~33% overhead
- Consider: Store smaller/compressed images
- Alternative: Keep URL fallback for large images

### API Endpoint Not Responding
```bash
# Check if endpoint exists and is working
curl http://localhost:3000/api/admin/assessment/questions/images-data

# Should return JSON array of images
```

---

## 📞 Support

### Common Issues

**Q: "image_data_base64 column not found"**
A: Run migration: `migrations/006_add_image_data_column.sql`

**Q: "No images with base64 data"**
A: Run: `node upload-question-images.mjs`

**Q: "API returns 404"**
A: Ensure server is running: `npm run dev`

**Q: Images still loading from URLs**
A: Check if `image_data_base64` column has data (not NULL)

---

## 📚 Related Documentation

- [Database Image Storage Guide](DATABASE_IMAGE_STORAGE.md)
- [Assessment Admin System](ASSESSMENT_ADMIN_SYSTEM.md)
- [Database Setup](DATABASE_SETUP.md)

---

## ✅ Implementation Complete!

Once all steps are done, your assessment questions will:
- ✅ Load images from the database
- ✅ Use efficient base64 encoding
- ✅ Display without external file dependencies
- ✅ Be fully backed up with database
- ✅ Work offline (images included in DB)
