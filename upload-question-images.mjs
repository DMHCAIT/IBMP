#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadQuestionImages() {
  try {
    console.log('📸 Starting assessment question images upload...');

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
      
      // Create public URL for the asset
      const imageUrl = `/quiz-assets/${filename}`;
      
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

      // Insert image record
      const { error: insertError } = await supabase
        .from('assessment_question_images')
        .insert({
          question_id: questionData.id,
          image_url: imageUrl,
          image_path: imageFile,
          image_title: imageTitle,
          file_size: 0, // We'll get this from the actual file
          mime_type: 'image/png',
          description: imageAlt,
          sort_order: 0,
          is_active: true,
        });

      if (insertError) {
        console.error(`❌ Failed to insert image for ${questionNumber}:`, insertError.message);
      } else {
        console.log(`✅ Uploaded image for ${questionNumber}: ${filename}`);
        uploadedCount++;
      }
    }

    console.log(`\n📊 Image Upload Summary:`);
    console.log(`   ✓ Total images linked: ${uploadedCount}`);
    console.log(`   ✓ Images: figure_01.png through figure_10.png`);
    console.log(`   ✓ Asset path: /quiz-assets/`);
    console.log(`\n✨ Image linking complete! Images are now available in the assessment.`);
    
  } catch (error) {
    console.error('❌ Error uploading images:', error);
    process.exit(1);
  }
}

uploadQuestionImages();
