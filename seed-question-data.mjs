import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examSeedDataRaw = fs.readFileSync(path.join(__dirname, 'public/exam.seed.json'), 'utf-8');
const examSeedData = JSON.parse(examSeedDataRaw);

const supabaseUrl = 'https://nfpvilygpjosfujdpcdg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedQuestionData() {
  try {
    console.log('Starting to seed question data...');
    
    if (!examSeedData.questions || !Array.isArray(examSeedData.questions)) {
      console.error('Invalid exam seed data');
      process.exit(1);
    }

    // Process each question
    for (const seedQuestion of examSeedData.questions) {
      const questionNumber = `Q${seedQuestion.number}`;
      console.log(`Processing question ${questionNumber}...`);

      // Update the question_data column with complete question structure
      const { error } = await supabase
        .from('assessment_questions')
        .update({
          question_data: seedQuestion,
          // Also update basic fields from seed data for consistency
          type: seedQuestion.type,
          stem: seedQuestion.stem,
          marks: seedQuestion.maxUnits || 1,
        })
        .eq('question_number', questionNumber);

      if (error) {
        console.error(`Error updating question ${questionNumber}:`, error);
      } else {
        console.log(`✓ Updated question ${questionNumber}`);
      }
    }

    console.log('✓ Question data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Fatal error during seeding:', error);
    process.exit(1);
  }
}

seedQuestionData();
