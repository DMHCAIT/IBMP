#!/usr/bin/env node

/**
 * seed-pain-medicine-to-paper.mjs
 * Imports Pain Medicine (IBMP) questions from exam.seed.json into a specific exam paper
 * 
 * Usage:
 *   node seed-pain-medicine-to-paper.mjs <paperId>
 * 
 * Example:
 *   node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7
 * 
 * Features:
 * - Seeds all 60 questions (MCQ format) with complete metadata
 * - Supports image attachments for Q41-Q60 (marked as image-based questions)
 * - Stores full question_data JSONB for reference/restoration
 * - Links all questions to a specific paper via paper_id
 * - Each paper gets independent copies - modifications don't affect other papers
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function publicAssetUrl(file) {
  if (!file) return null;
  if (/^(https?:)?\//.test(file)) return file;
  return `/${file.replace(/^assets\//, 'quiz-assets/')}`;
}

// Get paper ID from command line
const paperId = process.argv[2];
if (!paperId) {
  console.error('❌ Usage: node seed-pain-medicine-to-paper.mjs <paperId>');
  console.error('Example: node seed-pain-medicine-to-paper.mjs 4cf408d1-1097-4081-9039-bf3c511037e7');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedPaperQuestions() {
  try {
    console.log('🔄 Starting Pain Medicine Question Seeding...\n');
    console.log(`📄 Target Paper ID: ${paperId}\n`);

    // Read seed data
    const seedPath = path.join(__dirname, 'public', 'exam.seed.json');
    if (!fs.existsSync(seedPath)) {
      console.error('❌ Seed file not found:', seedPath);
      process.exit(1);
    }

    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    console.log(`✅ Loaded seed file: "${seedData.title}"`);
    console.log(`   Version: ${seedData.version} | Questions: ${seedData.questions.length}\n`);

    // Verify paper exists
    const { data: paperCheck, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('id, name')
      .eq('id', paperId)
      .single();

    if (paperError || !paperCheck) {
      console.error('❌ Paper not found:', paperId);
      process.exit(1);
    }

    console.log(`✅ Paper found: "${paperCheck.name}"\n`);

    // Delete existing questions for this paper (to avoid duplicates)
    console.log('🗑️  Removing existing questions for this paper...');
    const { error: deleteError } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('paper_id', paperId);

    if (deleteError && deleteError.code !== 'PGRST100') { // PGRST100 = no rows found
      console.warn('⚠️  Warning deleting existing questions:', deleteError.message);
    } else {
      console.log('✅ Cleared old questions\n');
    }

    // Process each question
    let inserted = 0;
    let skipped = 0;
    const errors = [];

    console.log('📥 Inserting questions...\n');

    for (const q of seedData.questions) {
      try {
        const qNum = q.number;
        const qNumStr = `Q${String(qNum).padStart(2, '0')}`;

        // Determine marks based on question type
        const marks = q.maxUnits || 1;
        const qType = q.type || 'mcq';

        // Transform options: extract just text, no IDs
        let optionsArray = [];
        if (q.options && Array.isArray(q.options)) {
          optionsArray = q.options.map(opt => {
            if (typeof opt === 'string') return opt;
            if (opt.text) return opt.text;
            return '';
          }).filter(Boolean);
        }

        // For MCQ questions, get correct answer text
        let correctAnswerText = null;
        if (qType === 'mcq' && q.scoring && q.scoring.correctOptionId) {
          const correctOpt = q.options.find(o => o.id === q.scoring.correctOptionId);
          if (correctOpt) {
            correctAnswerText = correctOpt.text;
          }
        } else if (q.scoring && q.scoring.answer) {
          correctAnswerText = q.scoring.answer;
        }

        // Build module string
        const module = seedData.modules.find(m => m.id === q.moduleId)?.title || 'General';

        // Build question data object (complete metadata for restoration)
        const questionData = q;

        // Insert into database
        const { data, error } = await supabase
          .from('assessment_questions')
          .insert([
            {
              question_number: qNumStr,
              type: qType,
              module: module,
              stem: q.stem,
              marks: marks,
              options: optionsArray.length > 0 ? optionsArray : null,
              correct_answer: correctAnswerText,
              image_url: publicAssetUrl(q.asset?.file),
              description: q.asset?.title || null,
              question_data: questionData,
              sort_order: qNum,
              paper_id: paperId,
              is_active: true,
            },
          ])
          .select();

        if (error) {
          errors.push(`${qNumStr}: ${error.message}`);
          skipped++;
          console.log(`⚠️  ${qNumStr}: ${error.message}`);
        } else {
          inserted++;
          const badge = qType === 'mcq' ? '📝' : qType === 'image' ? '🖼️' : '✍️';
          console.log(`${badge} ${qNumStr}: ${q.stem.substring(0, 60)}...`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Q${String(q.number).padStart(2, '0')}: ${msg}`);
        skipped++;
        console.log(`❌ Q${String(q.number).padStart(2, '0')}: ${msg}`);
      }
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ SEEDING COMPLETE');
    console.log('='.repeat(70));
    console.log(`\n📊 Results:`);
    console.log(`  ✅ Inserted: ${inserted} questions`);
    console.log(`  ⚠️  Skipped: ${skipped} questions`);
    console.log(`  📦 Paper ID: ${paperId}`);
    console.log(`  📄 Paper Name: ${paperCheck.name}`);

    if (errors.length > 0) {
      console.log(`\n❌ Errors encountered:`);
      errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
    }

    console.log(`\n✨ All questions are now specific to this paper.`);
    console.log(`   Modifications through the admin panel will NOT affect other papers.`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Access admin panel: /admin/assessment/papers/${paperId}/questions`);
    console.log(`   2. Edit questions as needed`);
    console.log(`   3. Upload/update images for image-based questions`);
    console.log(`   4. Changes save automatically to Supabase`);

  } catch (err) {
    console.error('❌ Fatal error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  }
}

seedPaperQuestions();
