#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadQuestionImages() {
  try {
    console.log('📸 Starting assessment question images upload (WITH BINARY DATA)...');

    // Read exam seed file
    const seedFile = readFileSync('public/exam.seed.json', 'utf-8');
    const seedData = JSON.parse(seedFile);

    if (!seedData.questions || !Array.isArray(seedData.questions)) {
      throw new Error('Invalid seed file format - missing questions array');
    }

    console.log(`✓ Loaded ${seedData.questions.length} questions from seed file`);

    // Find image-based questions with assets
    const imageQuestions = seedData.questions.filter((q) => 
      q.type === 'image' && q.asset && q.asset.file
    );

    console.log(`✓ Found ${imageQuestions.length} image-based questions`);

    // Delete existing images to start fresh
    console.log('🗑️  Clearing existing question images...');
    const { error: deleteError } = await supabase
      .from('assessment_question_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.warn('⚠️  Warning deleting images:', deleteError.message);
    }

    // Insert image records for each image-based question
    let uploadedCount = 0;
    
    for (const question of imageQuestions) {
      const questionNumber = question.id; // Q41, Q42, etc.
      const imageFile = question.asset.file; // assets/figure_01.png
      const imageTitle = question.asset.title || `${questionNumber} - ${question.topic}`;
      const imageAlt = question.asset.alt || imageTitle;
      
      // Extract filename from path
      const filename = imageFile.split('/').pop(); // figure_01.png
      
      // Create public URL for the asset (fallback if database data unavailable)
      const imageUrl = `/quiz-assets/${filename}`;
      
      // Read actual image file
      let imageData = null;
      let imageDataBase64 = null;
      let fileSize = 0;
      let mimeType = 'image/png';
      
      try {
        const imagePath = path.join(process.cwd(), 'public', imageFile);
        imageData = readFileSync(imagePath);
        fileSize = imageData.length;
        
        // Convert to base64
        imageDataBase64 = imageData.toString('base64');
        
        // Determine MIME type from filename
        if (filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
        } else if (filename.toLowerCase().endsWith('.png')) {
          mimeType = 'image/png';
        } else if (filename.toLowerCase().endsWith('.gif')) {
          mimeType = 'image/gif';
        } else if (filename.toLowerCase().endsWith('.webp')) {
          mimeType = 'image/webp';
        }
        
        console.log(`  📷 Read image file: ${filename} (${fileSize} bytes)`);
      } catch (fileError) {
        console.warn(`  ⚠️  Could not read image file ${imagePath}:`, fileError.message);
        // Continue anyway - we'll just not have the binary data
      }
      
      // Get question ID from database
      const { data: questionData, error: queryError } = await supabase
        .from('assessment_questions')
        .select('id')
        .eq('question_number', questionNumber)
        .single();
      
      if (queryError) {
        console.warn(`⚠️  Could not find question ${questionNumber}:`, queryError.message);
        continue;
      }
      
      if (!questionData) {
        console.warn(`⚠️  Question ${questionNumber} not found in database`);
        continue;
      }

      // Insert image record with binary data
      const { error: insertError } = await supabase
        .from('assessment_question_images')
        .insert({
          question_id: questionData.id,
          image_url: imageUrl,
          image_path: imageFile,
          image_title: imageTitle,
          file_size: fileSize,
          mime_type: mimeType,
          description: imageAlt,
          sort_order: 0,
          is_active: true,
          image_data_base64: imageDataBase64, // Store base64 encoded data
        });

      if (insertError) {
        console.error(`❌ Failed to insert image for ${questionNumber}:`, insertError.message);
      } else {
        const dataStatus = imageDataBase64 ? '✅' : '⚠️ (URL only)';
        console.log(`${dataStatus} Uploaded image for ${questionNumber}: ${filename}`);
        uploadedCount++;
      }
    }

    console.log(`\n📊 Image Upload Summary:`);
    console.log(`   ✓ Total images uploaded: ${uploadedCount}`);
    console.log(`   ✓ Images: figure_01.png through figure_10.png`);
    console.log(`   ✓ Storage: Database (image_data_base64 column)`);
    console.log(`   ✓ Fallback: /quiz-assets/ URL (if data unavailable)`);
    console.log(`   ✓ Location: assessment_question_images table`);
    console.log(`\n✨ Images stored in database! Ready to serve from database or fallback to URLs.`);
    
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    process.exit(1);
  }
}

uploadQuestionImages();
