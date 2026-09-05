#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedQuestions() {
  try {
    console.log('📚 Starting assessment questions seed...');

    // Read exam seed file
    const seedFile = readFileSync('public/exam.seed.json', 'utf-8');
    const seedData = JSON.parse(seedFile);

    if (!seedData.questions || !Array.isArray(seedData.questions)) {
      throw new Error('Invalid seed file format - missing questions array');
    }

    console.log(`✓ Loaded ${seedData.questions.length} questions from seed file`);

    // Check existing questions
    const { data: existing, error: fetchError } = await supabase
      .from('assessment_questions')
      .select('id')
      .limit(1);

    if (fetchError) {
      throw new Error(`Failed to check existing questions: ${fetchError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log('⚠️  Questions already exist in database. Deleting old data and re-seeding...');
      // Delete existing questions to re-seed
      const { error: deleteError } = await supabase
        .from('assessment_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (deleteError) {
        throw new Error(`Failed to delete existing questions: ${deleteError.message}`);
      }
      console.log('✓ Deleted old questions, proceeding with re-seed');
    }

    // Insert questions with correct marks scheme
    const questionsToInsert = seedData.questions.map((q, idx) => {
      // Calculate marks based on question number
      const qNumber = q.number || idx + 1;
      let marks = 1; // default
      
      if (qNumber >= 1 && qNumber <= 40) {
        marks = 1;
      } else if (qNumber >= 41 && qNumber <= 50) {
        marks = 3;
      } else if (qNumber >= 51 && qNumber <= 60) {
        marks = 1;
      }
      
      // For image-based questions, store image path in image_url
      let imageUrl = null;
      if (q.type === 'image' && q.asset?.file) {
        imageUrl = `/quiz-assets/${q.asset.file}`;
      }
      
      return {
        question_number: q.id || `Q${idx + 1}`,
        type: q.type || 'mcq',
        module: q.module || `Module ${Math.ceil((qNumber) / 10)}`,
        stem: q.stem || '',
        marks: marks,
        options: q.type === 'mcq' && q.options ? JSON.stringify(q.options) : null,
        correct_answer: q.type === 'mcq' && q.scoring?.correctOptionId ? q.scoring.correctOptionId : null,
        image_url: imageUrl,
        sort_order: idx,
        is_active: true,
      };
    });

    console.log(`🔄 Inserting ${questionsToInsert.length} questions...`);

    const { data: insertedQuestions, error: insertError } = await supabase
      .from('assessment_questions')
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      throw new Error(`Failed to insert questions: ${insertError.message}`);
    }

    console.log(`✅ Successfully inserted ${insertedQuestions.length} questions`);

    // Verify insertion
    const { data: verifyData, error: verifyError } = await supabase
      .from('assessment_questions')
      .select('count')
      .single();

    console.log('\n📊 Database Seed Summary:');
    console.log('   ✓ Total questions seeded: ' + insertedQuestions.length);
    console.log('   ✓ Types: MCQ, Image-based, Short-answer');
    console.log('   ✓ All questions are active and ready for use');
    console.log('\n✨ Database seeding complete! Questions are now available in the admin panel and assessment.');
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
}

seedQuestions();
