#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

(async () => {
  try {
    console.log('\n🔧 Linking questions to assessment papers...\n');

    // Get all 60 questions
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('id')
      .order('question_number', { ascending: true })
      .limit(60);

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError.message);
      process.exit(1);
    }

    if (!questions || questions.length === 0) {
      console.error('❌ No questions found to link');
      process.exit(1);
    }

    const questionIds = questions.map(q => q.id);
    console.log(`Found ${questionIds.length} questions to link\n`);

    // Get all papers (except Pain Management which already has questions)
    const { data: papers, error: papersError } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug')
      .eq('is_active', true)
      .neq('slug', 'pain-management');

    if (papersError) {
      console.error('❌ Error fetching papers:', papersError.message);
      process.exit(1);
    }

    console.log(`Found ${papers.length} papers to update:\n`);

    // Link questions to each paper
    for (const paper of papers) {
      try {
        const { error: updateError } = await supabase
          .from('assessment_questions')
          .update({ paper_id: paper.id })
          .in('id', questionIds);

        if (updateError) {
          console.log(`  ❌ ${paper.name}: ${updateError.message}`);
        } else {
          console.log(`  ✅ ${paper.name}: Linked ${questionIds.length} questions`);
        }
      } catch (err) {
        console.log(`  ❌ ${paper.name}: ${err.message}`);
      }
    }

    console.log('\n✨ Done! All papers now have questions.\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
