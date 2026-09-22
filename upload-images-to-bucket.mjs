#!/usr/bin/env node

/**
 * Automated Script: Upload Assessment Question Images to Supabase Storage
 * 
 * This script:
 * 1. Reads image files from /public/quiz-assets/
 * 2. Uploads to Supabase Storage bucket
 * 3. Stores public URLs in database
 * 4. Automatically uses credentials from .env.local
 */

import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
const envConfig = dotenv.config({ path: '.env.local' });

if (envConfig.error) {
  console.error('❌ Error loading .env.local:', envConfig.error.message);
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'public'; // Using the "public" bucket

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check .env.local file');
  process.exit(1);
}

console.log('✅ Environment variables loaded from .env.local');
console.log(`   Supabase URL: ${SUPABASE_URL}`);
console.log(`   Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 20)}...`);
console.log(`   Target Bucket: ${BUCKET_NAME}\n`);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function uploadAssessmentImagesToStorage() {
  try {
    console.log('🚀 Starting Assessment Images Upload to Supabase Storage...\n');

    // Step 1: Load exam seed data
    console.log('📋 Step 1: Loading exam.seed.json...');
    const seedFile = readFileSync('public/exam.seed.json', 'utf-8');
    const seedData = JSON.parse(seedFile);

    if (!seedData.questions || !Array.isArray(seedData.questions)) {
      throw new Error('Invalid seed file format - missing questions array');
    }

    console.log(`✅ Loaded ${seedData.questions.length} questions\n`);

    // Step 2: Find image-based questions
    console.log('🖼️  Step 2: Finding image-based questions...');
    const imageQuestions = seedData.questions.filter((q) => 
      q.type === 'image' && q.asset && q.asset.file
    );

    console.log(`✅ Found ${imageQuestions.length} image-based questions\n`);

    // Step 3: Get list of actual image files
    console.log('📁 Step 3: Checking image files in /public/quiz-assets/...');
    let imageFiles = [];
    try {
      imageFiles = readdirSync('public/quiz-assets').filter(f => 
        /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
      );
      console.log(`✅ Found ${imageFiles.length} image files\n`);
    } catch (err) {
      console.warn('⚠️  Directory not found, will create during upload\n');
    }

    // Step 4: Check if bucket exists
    console.log(`🪣 Step 4: Checking "${BUCKET_NAME}" bucket...\n`);
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.warn('⚠️  Could not list buckets:', bucketsError.message);
    } else {
      const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);
      if (bucketExists) {
        console.log(`✅ Bucket "${BUCKET_NAME}" exists\n`);
      } else {
        console.log(`⚠️  Bucket "${BUCKET_NAME}" not found, will create...\n`);
      }
    }

    // Step 5: Upload images and store URLs
    console.log('⬆️  Step 5: Uploading images to storage...\n');
    
    let uploadedCount = 0;
    let successCount = 0;

    for (const question of imageQuestions) {
      const questionNumber = question.id; // Q41, Q42, etc.
      const imageFile = question.asset.file; // assets/figure_01.png
      const imageTitle = question.asset.title || `${questionNumber} - ${question.topic}`;
      const imageAlt = question.asset.alt || imageTitle;
      const filename = imageFile.split('/').pop(); // figure_01.png

      try {
        // Read image file (try quiz-assets first, then assets)
        let imagePath = path.join(process.cwd(), 'public/quiz-assets', filename);
        try {
          readFileSync(imagePath);
        } catch {
          // Fallback to assets directory if quiz-assets doesn't exist
          imagePath = path.join(process.cwd(), 'public', imageFile);
        }
        const imageData = readFileSync(imagePath);
        const fileSize = imageData.length;

        // Determine MIME type
        let mimeType = 'image/png';
        if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
        } else if (filename.toLowerCase().endsWith('.gif')) {
          mimeType = 'image/gif';
        } else if (filename.toLowerCase().endsWith('.webp')) {
          mimeType = 'image/webp';
        }

        // Create storage path
        const storagePath = `assessment-questions/${questionNumber}/${filename}`;

        // Upload to Supabase Storage
        console.log(`   ⬆️  Uploading: ${questionNumber}/${filename}...`);
        const { data: uploadedFile, error: uploadError } = await supabase
          .storage
          .from(BUCKET_NAME)
          .upload(storagePath, imageData, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          console.log(`   ❌ Upload failed: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: publicUrlData } = supabase
          .storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath);

        const publicUrl = publicUrlData?.publicUrl;

        if (!publicUrl) {
          console.log(`   ❌ Could not get public URL`);
          continue;
        }

        // Get question ID from database
        const { data: questionData, error: queryError } = await supabase
          .from('assessment_questions')
          .select('id')
          .eq('question_number', questionNumber)
          .single();

        if (queryError || !questionData) {
          console.log(`   ⚠️  Question ${questionNumber} not found in database`);
          continue;
        }

        // Delete existing image record (if any)
        await supabase
          .from('assessment_question_images')
          .delete()
          .eq('question_id', questionData.id);

        // Insert/update image record with bucket URL
        const { error: insertError, data: insertedData } = await supabase
          .from('assessment_question_images')
          .insert({
            question_id: questionData.id,
            image_url: publicUrl, // Store the public URL from bucket
            image_path: storagePath,
            image_title: imageTitle,
            file_size: fileSize,
            mime_type: mimeType,
            description: imageAlt,
            sort_order: 0,
            is_active: true,
          })
          .select()
          .single();

        if (insertError) {
          console.log(`   ❌ Database insert failed: ${insertError.message}`);
          continue;
        }

        console.log(`   ✅ ${questionNumber} uploaded and URL stored`);
        console.log(`      URL: ${publicUrl}`);
        successCount++;

      } catch (fileError) {
        console.log(`   ❌ Error with ${questionNumber}: ${fileError.message}`);
      }

      uploadedCount++;
    }

    // Step 6: Summary
    console.log(`\n${'═'.repeat(60)}`);
    console.log('📊 Upload Summary:');
    console.log(`${'═'.repeat(60)}`);
    console.log(`✅ Successfully uploaded: ${successCount}/${uploadedCount} images`);
    console.log(`   Bucket: ${BUCKET_NAME}`);
    console.log(`   Path: assessment-questions/[QUESTION_ID]/[FILENAME]`);
    console.log(`   Database: assessment_question_images table`);
    console.log(`   Column: image_url (stores public bucket URL)`);
    console.log(`${'═'.repeat(60)}\n`);

    if (successCount === uploadedCount && successCount > 0) {
      console.log('🎉 All images successfully uploaded to Supabase Storage!');
      console.log('✨ Images are now stored in bucket and URLs saved in database\n');
      console.log('📝 Next steps:');
      console.log('   1. Verify: node verify-bucket-images.mjs');
      console.log('   2. Test: npm run dev');
      console.log('   3. Visit: http://localhost:3000/assessment\n');
    } else {
      console.log(`⚠️  ${uploadedCount - successCount} images failed to upload`);
      console.log('   Please check errors above and retry\n');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the upload
uploadAssessmentImagesToStorage();
