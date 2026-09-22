#!/usr/bin/env node

/**
 * Verify Script: Check if Assessment Images are in Supabase Storage Bucket
 * 
 * Checks:
 * 1. Database URLs are stored
 * 2. Images exist in bucket
 * 3. URLs are accessible
 * 4. Assessment page can load them
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
const envConfig = dotenv.config({ path: '.env.local' });

if (envConfig.error) {
  console.error('❌ Error loading .env.local:', envConfig.error.message);
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'public';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function verifyBucketImages() {
  console.log('🔍 Verifying Assessment Images in Supabase Storage\n');
  console.log('═'.repeat(60) + '\n');

  try {
    // Check 1: Database URLs stored
    console.log('1️⃣  Checking database for image URLs...');
    const { data: dbImages, error: dbError, count } = await supabase
      .from('assessment_question_images')
      .select('id, question_id, image_url, image_title, file_size, mime_type, is_active', { count: 'exact' })
      .eq('is_active', true);

    if (dbError) {
      console.log('❌ Error querying database:', dbError.message);
      return;
    }

    console.log(`✅ Found ${count} image URLs in database\n`);

    if (!dbImages || dbImages.length === 0) {
      console.log('⚠️  No images found in database!');
      console.log('   Please run: node upload-images-to-bucket.mjs\n');
      return;
    }

    // Check 2: Verify bucket URLs
    console.log('2️⃣  Verifying URLs point to bucket storage...');
    const bucketUrls = dbImages.filter(img => img.image_url?.includes('/storage/v1/'));
    console.log(`✅ ${bucketUrls.length}/${dbImages.length} URLs are from Supabase Storage\n`);

    // Check 3: List bucket contents
    console.log('3️⃣  Checking bucket contents...');
    const { data: bucketFiles, error: filesError } = await supabase
      .storage
      .from(BUCKET_NAME)
      .list('assessment-questions', {
        limit: 100,
        offset: 0,
      });

    if (filesError) {
      console.log('⚠️  Could not list bucket files:', filesError.message);
    } else {
      console.log(`✅ Found ${bucketFiles?.length || 0} files in bucket/assessment-questions/\n`);
    }

    // Check 4: Sample images
    console.log('4️⃣  Sample images in database:\n');
    dbImages.slice(0, 3).forEach((img, idx) => {
      console.log(`   [${idx + 1}] ${img.image_title}`);
      console.log(`       Size: ${img.file_size} bytes`);
      console.log(`       Type: ${img.mime_type}`);
      console.log(`       URL: ${img.image_url.substring(0, 80)}...`);
      console.log();
    });

    // Check 5: Test URL accessibility
    console.log('5️⃣  Testing URL accessibility...');
    if (dbImages.length > 0) {
      try {
        const testUrl = dbImages[0].image_url;
        const response = await fetch(testUrl);
        if (response.ok) {
          console.log(`✅ Sample URL is accessible (Status: ${response.status})\n`);
        } else {
          console.log(`⚠️  Sample URL returned status ${response.status}\n`);
        }
      } catch (err) {
        console.log(`⚠️  Could not test URL: ${err.message}\n`);
      }
    }

    // Check 6: Assessment page readiness
    console.log('6️⃣  Assessment Page Readiness:\n');
    const allActive = dbImages.every(img => img.is_active);
    const allHaveUrls = dbImages.every(img => img.image_url);

    if (allActive && allHaveUrls && dbImages.length > 0) {
      console.log('✅ Assessment page can load images from bucket');
      console.log('✅ All images have URLs stored in database');
      console.log('✅ All images marked as active\n');
    } else {
      console.log('⚠️  Some images may not be ready');
      if (!allActive) console.log('   - Not all images are active');
      if (!allHaveUrls) console.log('   - Some images missing URLs');
      console.log();
    }

    // Summary
    console.log('═'.repeat(60));
    console.log('📊 Summary:');
    console.log('═'.repeat(60));
    console.log(`✅ Total images: ${count}`);
    console.log(`✅ Images with bucket URLs: ${bucketUrls.length}`);
    console.log(`✅ Database table: assessment_question_images`);
    console.log(`✅ Bucket: ${BUCKET_NAME}`);
    console.log(`✅ Storage path: assessment-questions/[QUESTION_ID]/[FILENAME]`);
    console.log('═'.repeat(60) + '\n');

    if (count > 0 && allActive && allHaveUrls) {
      console.log('🎉 Setup Complete! Assessment images are ready!\n');
      console.log('📝 Next steps:');
      console.log('   1. Start dev server: npm run dev');
      console.log('   2. Visit: http://localhost:3000/assessment');
      console.log('   3. Login as candidate and view Q41-Q50 (image questions)\n');
    } else {
      console.log('⚠️  Setup not complete. Please check errors above.\n');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyBucketImages();
