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
    // Get all papers with their question counts
    const { data: papers, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug, is_active')
      .order('name');

    if (paperError) {
      console.error('❌ Error fetching papers:', paperError.message);
      process.exit(1);
    }

    console.log('\n📊 Assessment Papers - Question Count:\n');
    
    for (const paper of papers) {
      const { count, error: countError } = await supabase
        .from('assessment_questions')
        .select('id', { count: 'exact', head: true })
        .eq('paper_id', paper.id);

      const questionCount = countError ? '⚠️ Error' : (count || 0);
      const status = questionCount === 0 ? '❌ NO QUESTIONS' : `✅ ${questionCount} questions`;
      
      console.log(`  • ${paper.name}`);
      console.log(`    Slug: ${paper.slug}`);
      console.log(`    Questions: ${status}`);
      console.log(`    Active: ${paper.is_active ? '✅' : '❌'}\n`);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
