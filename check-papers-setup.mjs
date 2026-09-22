#!/usr/bin/env node

/**
 * Check Multi-Paper System Database Status
 * Verify if papers and questions are linked
 */

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

async function checkDatabase() {
  console.log('🔍 Checking Multi-Paper System Database Status\n');
  console.log('═'.repeat(70) + '\n');

  try {
    // Check 1: Does assessment_exam_papers table exist?
    console.log('1️⃣  Checking if assessment_exam_papers table exists...');
    const { data: papers, error: papersError } = await supabase
      .from('assessment_exam_papers')
      .select('*');

    if (papersError && papersError.code === 'PGRST116') {
      console.log('   ❌ Table does NOT exist');
      console.log('   → Migration NOT applied yet\n');
      console.log('   🔧 ACTION REQUIRED: Apply migration first!\n');
      console.log('   File: migrations/007_add_multi_paper_exam_system.sql\n');
      return false;
    }

    if (papersError) {
      console.log('   ⚠️  Error:', papersError.message);
      return false;
    }

    console.log('   ✅ Table EXISTS\n');

    // Check 2: Are there papers created?
    console.log('2️⃣  Checking if papers are created...');
    
    if (!papers || papers.length === 0) {
      console.log('   ❌ No papers found\n');
      console.log('   🔧 ACTION REQUIRED: Run setup script!\n');
      console.log('   Command: node setup-papers-with-existing-questions.mjs\n');
      return false;
    }

    console.log(`   ✅ Found ${papers.length} papers:\n`);
    papers.forEach((paper, index) => {
      console.log(`   ${index + 1}. ${paper.name}`);
      console.log(`      • Slug: ${paper.slug}`);
      console.log(`      • URL: /assessment-${paper.slug}`);
      console.log(`      • ID: ${paper.id}`);
      console.log(`      • Active: ${paper.is_active}`);
      console.log(`      • Questions: ${paper.total_questions}`);
      console.log('');
    });

    // Check 3: Are questions linked to papers?
    console.log('3️⃣  Checking if questions are linked to papers...\n');

    const { data: allQuestions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('id, question_number, paper_id');

    if (questionsError) {
      console.log('   ⚠️  Error checking questions:', questionsError.message);
      return false;
    }

    const totalQuestions = allQuestions?.length || 0;
    console.log(`   Total questions in database: ${totalQuestions}\n`);

    if (totalQuestions === 0) {
      console.log('   ❌ No questions found in database\n');
      return false;
    }

    // Count questions per paper
    const questionsByPaper = {};
    const questionsWithoutPaper = [];

    allQuestions.forEach((q) => {
      if (q.paper_id) {
        if (!questionsByPaper[q.paper_id]) {
          questionsByPaper[q.paper_id] = [];
        }
        questionsByPaper[q.paper_id].push(q.question_number);
      } else {
        questionsWithoutPaper.push(q.question_number);
      }
    });

    // Display results
    console.log('   Questions per paper:\n');
    papers.forEach((paper) => {
      const count = questionsByPaper[paper.id]?.length || 0;
      const status = count > 0 ? '✅' : '❌';
      console.log(`   ${status} ${paper.name}: ${count} questions`);
      if (count > 0) {
        const qNumbers = questionsByPaper[paper.id].slice(0, 5).join(', ');
        const more = count > 5 ? ` ... +${count - 5} more` : '';
        console.log(`      • Questions: ${qNumbers}${more}`);
      }
    });

    if (questionsWithoutPaper.length > 0) {
      console.log(`\n   ⚠️  Questions WITHOUT paper assignment: ${questionsWithoutPaper.length}`);
      console.log(`      • Questions: ${questionsWithoutPaper.slice(0, 5).join(', ')}${questionsWithoutPaper.length > 5 ? ` ... +${questionsWithoutPaper.length - 5} more` : ''}\n`);
    }

    console.log('\n' + '═'.repeat(70) + '\n');

    // Summary
    console.log('📊 DATABASE STATUS SUMMARY:\n');

    const allLinked = questionsWithoutPaper.length === 0 && Object.values(questionsByPaper).some(q => q.length > 0);
    
    if (allLinked && papers.length > 0) {
      console.log('✅ SYSTEM IS READY!\n');
      console.log('What you have:');
      papers.forEach((paper) => {
        const count = questionsByPaper[paper.id]?.length || 0;
        console.log(`  • ${paper.name}: ${count} questions linked`);
      });
      console.log('\nYou can now:');
      console.log('  1. Start app: npm run dev');
      console.log('  2. Test URLs: /assessment-{paper-slug}');
      console.log('  3. Modify questions: /admin/assessment/papers/[paperId]/questions');
      return true;
    } else if (papers.length > 0 && Object.keys(questionsByPaper).length === 0) {
      console.log('⚠️  PAPERS CREATED BUT QUESTIONS NOT LINKED\n');
      console.log('What you need to do:');
      console.log('  Run: node setup-papers-with-existing-questions.mjs\n');
      console.log('This will:');
      console.log('  ✓ Link existing 60 questions to each paper');
      console.log('  ✓ Verify the setup');
      return false;
    } else {
      console.log('❌ SYSTEM NOT FULLY SETUP\n');
      console.log('What you need to do:');
      console.log('  1. Apply migration: migrations/007_add_multi_paper_exam_system.sql');
      console.log('  2. Run: node setup-papers-with-existing-questions.mjs');
      console.log('  3. Start: npm run dev\n');
      return false;
    }

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

checkDatabase().then((ready) => {
  process.exit(ready ? 0 : 1);
});
