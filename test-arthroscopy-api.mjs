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
    console.log('\n🔍 Testing API for arthroscopy-and-arthroplasty paper...\n');

    // 1. Get paper ID by slug
    const { data: paper, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug, is_active')
      .eq('slug', 'arthroscopy-and-arthroplasty')
      .single();

    if (paperError) {
      console.error('❌ Error finding paper:', paperError.message);
      process.exit(1);
    }

    if (!paper) {
      console.error('❌ Paper not found');
      process.exit(1);
    }

    console.log(`✅ Paper found:`);
    console.log(`   Name: ${paper.name}`);
    console.log(`   Slug: ${paper.slug}`);
    console.log(`   ID: ${paper.id}`);
    console.log(`   Active: ${paper.is_active}\n`);

    // 2. Get questions for this paper
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('id, question_number, type, stem')
      .eq('paper_id', paper.id)
      .order('question_number', { ascending: true });

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError.message);
      process.exit(1);
    }

    console.log(`✅ Questions found: ${questions?.length || 0}`);
    if (questions && questions.length > 0) {
      console.log('   First 5 questions:');
      questions.slice(0, 5).forEach(q => {
        console.log(`     Q${q.question_number}: ${q.type} - ${q.stem?.substring(0, 50)}...`);
      });
    } else {
      console.error('   ⚠️  NO QUESTIONS FOUND!');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
