# Image and Video Upload Feature - Implementation Guide

## Overview
This guide documents the new image and video upload features added to the IBMP admin panel, allowing direct file uploads to Supabase storage with live display on the website.

## Changes Made

### 1. **Database Schema Update** (`lib/content-data.ts`)
Added new `watchOverview` field to the `Course` interface:

```typescript
watchOverview?: {
  videoUrl?: string;
  description?: string;
};
```

This allows each course to have an optional video overview with description.

### 2. **Improved Upload Error Handling** (`app/admin/courses/page.tsx`)

Enhanced the `handleUploadImage` function with:
- **Detailed console logging** to track each step of the upload process
- **Better error messages** that specify what went wrong
- **File information logging** including file size and type
- **Public URL validation** to ensure the upload was successful

Old error message: `"Image upload failed. Check console for details."`
New error message: Specific error like `"Upload failed: Invalid bucket name"` or `"Failed to get public URL"`

### 3. **Video Upload Section** (`app/admin/courses/page.tsx`)

Added a new "Watch Overview (Video)" collapsible section in the course editor with:
- **Video URL input field** - for pasting YouTube, Vimeo, or direct video URLs
- **Video file upload button** - for uploading video files directly to Supabase
- **Video description field** - optional description for the video
- **File type validation** - accepts video/* files

## How to Use

### Testing Image Upload for Courses

1. **Navigate to Admin Panel**: Go to `http://localhost:3000/admin/courses`
2. **Select Medical Specialties Tab**: Click on "Medical Specialties" category
3. **Click Edit Icon**: Click the pencil icon in the Actions column of any course
4. **Edit Course Modal Opens**: The "Edit Course" modal will display
5. **Scroll to Image Section**: Find the "Image" field in Basic Information
6. **Upload Image**:
   - Option A: Paste an image URL directly in the text field
   - Option B: Click "Upload" button to select an image file from your computer
7. **Verify Upload**: If successful, the image URL will populate in the text field
8. **Save Changes**: Click "Save Changes" button at the bottom

### Testing Video Upload for Courses

1. **Open Course Editor**: Same steps as above (Edit Course Modal)
2. **Expand Video Section**: Scroll down and click "Watch Overview (Video)" to expand it
3. **Add Video**:
   - Option A: Paste a YouTube/Vimeo URL or direct video link in the "Video URL or Upload" field
   - Option B: Click "Upload Video" button to upload a video file
4. **Add Description**: Optionally add a video description
5. **Save Changes**: Click "Save Changes" button

### Testing Hero Image Upload

1. **Navigate to Admin Home Page**: Go to `http://localhost:3000/admin/home`
2. **Scroll to Hero Image Section**: Find the "Hero Image" field
3. **Upload or Paste URL**:
   - Click the "Upload" button to select an image file
   - Or paste an image URL directly
4. **Save Changes**: Button is visible in the top right

## Supabase Storage Requirements

The upload feature requires:
- **Supabase Project**: `https://nfpvilygpjosfujdpcdg.supabase.co`
- **Storage Bucket**: Named `public` (must exist and be publicly accessible)
- **Bucket Settings**:
  - Public read access enabled
  - Allow unauthenticated uploads (or use service role key for authenticated uploads)

### Create Public Bucket in Supabase (if not exists)

1. Go to Supabase Dashboard
2. Navigate to Storage section
3. Create new bucket named `public`
4. Set bucket to public (enable "Public bucket" toggle)
5. Verify in Storage Policies that files are readable

## Files Modified

1. **`lib/content-data.ts`**
   - Added `watchOverview` field to Course interface

2. **`app/admin/courses/page.tsx`**
   - Enhanced `handleUploadImage()` function with detailed error logging
   - Added new "Watch Overview (Video)" section with upload capability
   - Maintains both URL input and file upload options for flexibility

3. **`app/admin/home/page.tsx`** (previously modified)
   - Already has hero image upload functionality

## Error Troubleshooting

### "Image upload failed: Invalid bucket name"
- **Cause**: The `public` bucket doesn't exist in Supabase
- **Fix**: Create the bucket in Supabase Storage section

### "Image upload failed: The row size exceeded the maximum allowed size"
- **Cause**: File is too large
- **Fix**: Use smaller files (recommended: < 10MB)

### "Image upload failed: Auth session missing"
- **Cause**: Supabase credentials not properly configured
- **Fix**: Verify `.env.local` has correct environment variables

### Upload succeeds but file isn't visible
- **Cause**: Bucket permissions not set to public
- **Fix**: In Supabase, enable public access for the bucket

## Testing Workflow

### Full End-to-End Test

1. **Upload Image to Course**
   - Edit course → Upload image → Save
   - Go to public website and view the course - image should display

2. **Upload Video to Course**
   - Edit course → Expand Video section → Upload/paste video URL → Save
   - Check if video displays on course detail page on website

3. **Upload Hero Image**
   - Admin home page → Upload hero image → Save
   - Go to homepage and verify hero section displays new image

### Verification Steps

- [ ] Image uploads to Supabase storage
- [ ] Public URL is generated correctly
- [ ] URL displays in admin panel
- [ ] Image shows on public website
- [ ] Video URL saves to database
- [ ] Video displays on public website

## Console Debugging

When testing uploads, check browser console (F12) for detailed logs:

```
Starting image upload: { filename: "course-1234567.jpg", fileSize: 2048576, ... }
Upload successful: { path: "public/course-1234567.jpg", id: "...", ... }
Public URL retrieved: https://nfpvilygpjosfujdpcdg.supabase.co/storage/v1/object/public/...
```

These logs help diagnose upload issues.

## Database Integration

Uploaded image/video URLs are stored in:
- **Courses**: `course.image` and `course.watchOverview.videoUrl`
- **Hero**: `hero.image`

Data is saved to the content JSON file when "Save Changes" is clicked.

## Next Steps for Frontend Display

To display uploaded videos on the website:

1. Create a video player component
2. Add to course detail page template
3. Handle both embedded (YouTube/Vimeo) and direct video URLs
4. Display video description if available

## Support

For upload issues:
1. Check Supabase dashboard for storage bucket configuration
2. Review browser console for detailed error messages
3. Verify .env.local has correct Supabase credentials
4. Test with smaller files first (< 5MB)
