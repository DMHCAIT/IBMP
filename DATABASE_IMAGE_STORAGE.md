# Database Image Storage Implementation

## Overview
This guide explains how to store assessment question images directly in the database instead of relying on external storage paths.

## What Changed

### Before
- Images were stored in `/public/quiz-assets/` directory
- Only file paths and URLs were stored in the database
- Images had to be served from the file system

### After  
- Image binary data is stored directly in the database
- Base64-encoded images are stored in `image_data_base64` column
- Images are retrieved from database and displayed in the assessment
- Fallback to URLs if image data is not available

## Database Schema Changes

### New Migration
File: `migrations/006_add_image_data_column.sql`

```sql
ALTER TABLE assessment_question_images
ADD COLUMN IF NOT EXISTS image_data BYTEA,
ADD COLUMN IF NOT EXISTS image_data_base64 TEXT;
```

**New Columns:**
- `image_data` - Binary image data (BYTEA format)
- `image_data_base64` - Base64-encoded image data (TEXT format) for easier transmission

### Why Two Formats?
- `BYTEA`: Efficient storage in database
- `BASE64`: Easy to transmit over HTTP and use in `<img>` tags as data URIs

## Implementation Steps

### 1. Run Database Migration
```bash
# Apply the migration to add image_data columns
psql -h your-db-host -U your-user -d your-db-name -f migrations/006_add_image_data_column.sql
```

Or through Supabase SQL Editor:
- Copy contents of `migrations/006_add_image_data_column.sql`
- Paste into Supabase SQL Editor
- Run

### 2. Upload Images to Database
```bash
# Run the updated upload script to read actual image files and store in database
node upload-question-images.mjs
```

This script will:
1. Read image files from `/public/quiz-assets/` directory
2. Convert images to base64 format
3. Store base64 data in the `image_data_base64` column
4. Store file metadata (size, type, etc.)
5. Maintain URL fallback for compatibility

**Output Example:**
```
📸 Starting assessment question images upload (WITH BINARY DATA)...
✓ Loaded 60 questions from seed file
✓ Found 10 image-based questions
🗑️  Clearing existing question images...
  📷 Read image file: figure_10.png (15234 bytes)
✅ Uploaded image for Q41: figure_10.png
✅ Uploaded image for Q42: figure_01.png
...
📊 Image Upload Summary:
   ✓ Total images uploaded: 10
   ✓ Images: figure_01.png through figure_10.png
   ✓ Storage: Database (image_data_base64 column)
   ✓ Fallback: /quiz-assets/ URL (if data unavailable)
   ✓ Location: assessment_question_images table

✨ Images stored in database! Ready to serve from database or fallback to URLs.
```

### 3. API Endpoints

#### Get All Images (New)
```
GET /api/admin/assessment/questions/images-data?format=base64
```

**Response:**
```json
[
  {
    "id": "uuid-123",
    "questionId": "q41-uuid",
    "title": "Q41 - Image-guided spine safety",
    "mimeType": "image/png",
    "data": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    "dataUri": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...",
    "sortOrder": 0
  }
]
```

#### Get Individual Image by ID (New)
```
GET /api/admin/assessment/questions/images/[imageId]
```

**Response:**
```json
{
  "id": "uuid-123",
  "data": "iVBORw0KGgoAAAANSUhEUgAAAAUA...",
  "mimeType": "image/png",
  "title": "Q41 Image",
  "questionId": "q41-uuid"
}
```

### 4. Assessment Page Updates
The assessment page now:
1. Fetches images from `/api/admin/assessment/questions/images-data`
2. Uses `dataUri` property which contains base64-encoded data
3. Passes complete data URI to `<img src>` tag (no HTTP request needed)
4. Falls back to URL if database data unavailable

**Updated code location:** `app/assessment/page.tsx` (lines 77-90)

```typescript
// Load images from database with base64 data
const imagesResponse = await fetch('/api/admin/assessment/questions/images-data?format=base64');
const allImages = await imagesResponse.json();

// Use dataUri which includes the complete base64 data
imagesMap = Object.fromEntries(
  allImages.map((img: any) => {
    const question = questionsData.find((q: any) => q.id === img.questionId);
    if (question) {
      return [question.question_number, img.dataUri];
    }
    return ['', ''];
  }).filter((entry: any) => entry[0])
);
```

## Database Schema

### assessment_question_images Table
```sql
CREATE TABLE assessment_question_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL,
  image_url TEXT NOT NULL,                    -- Fallback URL
  image_path VARCHAR(255),                    -- Original file path
  file_size INTEGER,                          -- File size in bytes
  mime_type VARCHAR(50),                      -- e.g., image/png
  uploaded_by VARCHAR(255),
  image_title TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  image_data BYTEA,                           -- Binary image data
  image_data_base64 TEXT,                     -- Base64-encoded data
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

## File Structure

### Modified Files
- `upload-question-images.mjs` - Now reads image files and stores base64 data
- `app/assessment/page.tsx` - Loads images from database instead of URLs
- `app/api/admin/assessment/questions/images-data/route.ts` - New API endpoint
- `app/api/admin/assessment/questions/images/[imageId]/route.ts` - New API endpoint

### New Files
- `migrations/006_add_image_data_column.sql` - Database migration

## Benefits

✅ **Centralized Storage** - All data in one database
✅ **No External Dependencies** - Don't need separate file storage
✅ **Easy Backup** - Database backups include images
✅ **Better Security** - Images are not directly accessible via URLs
✅ **Scalability** - Images stored with metadata for easy management
✅ **Reduced Network Calls** - Base64 data embedded in API response

## Troubleshooting

### Images Not Displaying
1. Verify migration was applied: Check `image_data_base64` column exists
2. Run upload script: `node upload-question-images.mjs`
3. Check browser console for errors
4. Verify API endpoint returns data: `curl http://localhost:3000/api/admin/assessment/questions/images-data`

### Large Database Size
- Images stored as base64 increase database size ~33%
- Consider archiving old images periodically
- Use database compression if available

### Fallback URLs Not Working
- If image files were deleted, you can still use URLs if stored
- Add files back to `/public/quiz-assets/` for URL fallback
- The system checks `dataUri` first, then falls back to `image_url`

## Performance Considerations

**Advantages:**
- Single API call for all images (vs multiple blob storage requests)
- Data embedded in response (no additional HTTP requests)
- Database queries are optimized with indexes

**Considerations:**
- Larger API response size (base64 encoding adds ~33% overhead)
- Consider paginating large image sets if needed
- Index on `question_id` improves retrieval speed

## Future Enhancements

1. **Lazy Loading** - Load images only when needed
2. **Image Compression** - Store compressed versions in database
3. **CDN Integration** - Serve high-traffic images via CDN
4. **Image Resizing** - Store multiple sizes for responsive design
5. **Batch Download** - Allow admins to bulk download images

## Related Documentation

- [Assessment Admin System](ASSESSMENT_ADMIN_SYSTEM.md)
- [Database Setup](DATABASE_SETUP.md)
- [Supabase Setup](SUPABASE_SETUP_VISUAL_GUIDE.md)
