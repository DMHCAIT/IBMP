import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';
import { seedQuestionToDatabase, SeedFile } from '@/lib/assessment-seed';

/**
 * POST /api/admin/assessment/sync-from-seed?paperId=<paperId>
 * Syncs question data from exam.seed.json to a specific paper
 * 
 * Query Parameters:
 *   paperId: (optional) Paper ID to sync to. If provided, only syncs scoring/metadata.
 *            If omitted, syncs to all existing paper questions.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('paperId');

    // Read exam.seed.json
    const seedPath = path.join(process.cwd(), 'public', 'exam.seed.json');
    if (!fs.existsSync(seedPath)) {
      return NextResponse.json(
        { success: false, message: 'Seed file not found' },
        { status: 404 }
      );
    }

    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8')) as SeedFile;

    if (!paperId) {
      return NextResponse.json(
        { success: false, message: 'paperId is required so one paper cannot overwrite another' },
        { status: 400 }
      );
    }

    const { data: paper, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return NextResponse.json(
        { success: false, message: 'Paper not found' },
        { status: 404 }
      );
    }

    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    console.log(`🔄 Syncing from seed: ${seedData.title} (v${seedData.version})`);
    if (paperId) console.log(`   Target Paper: ${paperId}`);

    // Update each question
    for (const question of seedData.questions) {
      const row = seedQuestionToDatabase(question, seedData, paperId);
      const qNumStr = row.question_number;

      try {
        let query = supabase
          .from('assessment_questions')
          .update(row)
          .eq('question_number', qNumStr);
        query = query.eq('paper_id', paperId);

        const { error, count } = await query;

        if (error) {
          errors.push(`${qNumStr}: ${error.message}`);
          skipped++;
        } else if ((count || 0) > 0) {
          updated++;
          console.log(`✅ ${qNumStr}`);
        } else {
          skipped++;
          console.log(`⚠️  ${qNumStr}: Not found in paper ${paperId}`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${qNumStr}: ${msg}`);
        skipped++;
        console.log(`❌ ${qNumStr}: ${msg}`);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${updated} questions from exam.seed.json`,
        updated: updated,
        skipped: skipped,
        paperId: paperId || 'all',
        seedTitle: seedData.title,
        errors: errors.length > 0 ? errors : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to sync from seed file'
      },
      { status: 500 }
    );
  }
}

