#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PAIN_MANAGEMENT_PAPER_ID = '06d68de1-1ae6-4cd9-b1c6-19243efb6eab';

async function verifySeed() {
  try {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('question_number, type, marks, stem, correct_answer, options')
      .eq('paper_id', PAIN_MANAGEMENT_PAPER_ID)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Error:', error);
      process.exit(1);
    }

    console.log('PAIN MANAGEMENT PAPER - ALL QUESTIONS WITH ANSWERS');
    console.log('='.repeat(80));
    console.log();

    data.forEach((q, idx) => {
      console.log(`${q.question_number} (${q.type}, ${q.marks} marks) - Answer: ${q.correct_answer || 'N/A'}`);
      console.log(`   Question: ${q.stem.substring(0, 100)}${q.stem.length > 100 ? '...' : ''}`);
      if (q.options) {
        try {
          const opts = JSON.parse(q.options);
          console.log(`   Options: ${opts.length} options provided`);
        } catch (e) {
          console.log(`   Options: Raw data`);
        }
      }
      console.log();
    });

    console.log('='.repeat(80));
    console.log(`SUMMARY: ${data.length} total questions seeded`);
    const mcq = data.filter(q => q.type === 'mcq').length;
    const img = data.filter(q => q.type === 'image_based').length;
    const short = data.filter(q => q.type === 'short_answer').length;
    console.log(`  - MCQ: ${mcq}`);
    console.log(`  - Image-Based: ${img}`);
    console.log(`  - Short Answer: ${short}`);
    console.log(`  - Total Marks: ${data.reduce((sum, q) => sum + q.marks, 0)}`);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

verifySeed();
