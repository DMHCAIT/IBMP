#!/usr/bin/env node

/**
 * verify-paper-seeding.mjs
 * Verifies that Pain Medicine questions were properly seeded to a specific paper
 * 
 * Usage:
 *   node verify-paper-seeding.mjs <paperId>
 */

import { createClient } from '@supabase/supabase-js';

const paperId = process.argv[2];
if (!paperId) {
  console.error('❌ Usage: node verify-paper-seeding.mjs <paperId>');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifySeed() {
  console.log('\n📋 PAPER SEEDING VERIFICATION\n');
  console.log(`Paper ID: ${paperId}\n`);

  try {
    // 1. Verify paper exists
    console.log('1️⃣  Checking paper...');
    const { data: paper, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, created_at')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      console.log('❌ Paper not found');
      return;
    }
    console.log(`✅ Paper found: "${paper.name}"`);
    console.log(`   Created: ${new Date(paper.created_at).toLocaleString()}\n`);

    // 2. Count questions
    console.log('2️⃣  Counting questions...');
    const { data: allQuestions, error: countError } = await supabase
      .from('assessment_questions')
      .select('id', { count: 'exact' })
      .eq('paper_id', paperId);

    if (countError) {
      console.log('❌ Error counting questions:', countError.message);
      return;
    }

    const totalCount = allQuestions?.length || 0;
    console.log(`✅ Total questions: ${totalCount}/60`);

    if (totalCount === 0) {
      console.log('⚠️  No questions found for this paper\n');
      return;
    }

    console.log();

    // 3. Breakdown by type
    console.log('3️⃣  Breakdown by type...');
    const { data: typeBreakdown } = await supabase
      .from('assessment_questions')
      .select('type, is_active')
      .eq('paper_id', paperId);

    const mcqCount = typeBreakdown?.filter(q => q.type === 'mcq').length || 0;
    const imageCount = typeBreakdown?.filter(q => q.type === 'image').length || 0;
    const shortCount = typeBreakdown?.filter(q => q.type === 'short').length || 0;

    console.log(`  📝 MCQ (1 mark each): ${mcqCount} questions`);
    console.log(`  🖼️  Image (3 marks each): ${imageCount} questions`);
    console.log(`  ✍️  Short Answer (1 mark each): ${shortCount} questions\n`);

    // 4. Marks calculation
    console.log('4️⃣  Total marks...');
    const totalMarks = (mcqCount * 1) + (imageCount * 3) + (shortCount * 1);
    console.log(`✅ Expected total: ${totalMarks} marks`);
    console.log(`   (MCQ: ${mcqCount}×1 + Image: ${imageCount}×3 + Short: ${shortCount}×1)\n`);

    // 5. Sample questions
    console.log('5️⃣  Sample questions (first 5)...');
    const { data: samples } = await supabase
      .from('assessment_questions')
      .select('question_number, type, stem, options')
      .eq('paper_id', paperId)
      .order('sort_order', { ascending: true })
      .limit(5);

    if (samples && samples.length > 0) {
      samples.forEach(q => {
        const typeEmoji = q.type === 'mcq' ? '📝' : q.type === 'image' ? '🖼️' : '✍️';
        console.log(`  ${typeEmoji} ${q.question_number}: ${q.stem.substring(0, 50)}...`);
        if (q.options && Array.isArray(q.options)) {
          console.log(`      Options: ${q.options.length}`);
        }
      });
    }
    console.log();

    // 6. Module distribution
    console.log('6️⃣  Module distribution...');
    const { data: modules } = await supabase
      .from('assessment_questions')
      .select('module')
      .eq('paper_id', paperId);

    const moduleCount = {};
    modules?.forEach((q) => {
      moduleCount[q.module] = (moduleCount[q.module] || 0) + 1;
    });

    Object.entries(moduleCount).forEach(([module, count]) => {
      console.log(`  • ${module}: ${count} questions`);
    });
    console.log();

    // 7. Check for images
    console.log('7️⃣  Image attachments...');
    const { data: withImages } = await supabase
      .from('assessment_questions')
      .select('question_number, image_url')
      .eq('paper_id', paperId)
      .not('image_url', 'is', null);

    const imageCount2 = withImages?.length || 0;
    console.log(`✅ Questions with images: ${imageCount2}`);
    if (imageCount2 > 0 && imageCount2 < imageCount) {
      console.log(`⚠️  ${imageCount - imageCount2} image questions still need images\n`);
    } else {
      console.log();
    }

    // 8. Metadata check
    console.log('8️⃣  Metadata completeness...');
    const { data: metadata } = await supabase
      .from('assessment_questions')
      .select('question_number, question_data, is_active')
      .eq('paper_id', paperId)
      .limit(1);

    if (metadata && metadata[0]?.question_data) {
      console.log('✅ question_data JSONB: Present');
      console.log('   Fields: ' + Object.keys(metadata[0].question_data).join(', '));
    } else {
      console.log('⚠️  question_data JSONB: Not present');
    }

    const activeCount = typeBreakdown?.filter(q => q.is_active !== false).length || 0;
    console.log(`✅ Active questions: ${activeCount}/${totalCount}`);
    console.log();

    // 9. Summary
    console.log('='.repeat(60));
    console.log('✅ SEEDING VERIFICATION COMPLETE\n');

    const completeness = Math.round((totalCount / 60) * 100);
    console.log(`📊 Completion: ${completeness}%`);

    if (totalCount === 60 && mcqCount === 40 && imageCount === 10 && shortCount === 10 && totalMarks === 80) {
      console.log('✨ Perfect! All 60 questions match exam.seed.json.');
    } else if (totalCount === 60) {
      console.log('⚠️  All 60 questions present, but type distribution may need review.');
    } else {
      console.log(`⚠️  Only ${totalCount}/60 questions present.`);
    }

    console.log('\n📝 Next steps:');
    console.log(`   1. Access admin panel: /admin/assessment/papers/${paperId}/questions`);
    console.log(`   2. Review and edit questions as needed`);
    console.log(`   3. Upload images for image-based questions (Q41-Q60)`);
    console.log(`   4. Test the exam with a candidate\n`);

  } catch (err) {
    console.error('❌ Error:', err instanceof Error ? err.message : String(err));
  }
}

verifySeed();
