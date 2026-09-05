import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

/**
 * POST /api/admin/assessment/sync-from-seed
 * Syncs question marks and data from exam.seed.json to database
 */
export async function POST(_request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();

    // Read exam.seed.json
    const seedPath = path.join(process.cwd(), 'public', 'exam.seed.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

    let updated = 0;
    const errors: string[] = [];

    // Update each question
    for (const question of seedData.questions) {
      const qNum = question.number;
      let marks = 1;

      if (qNum >= 41 && qNum <= 50) {
        marks = 3;
      }

      const qNumStr = `Q${String(qNum).padStart(2, '0')}`;

      const { error } = await supabase
        .from('assessment_questions')
        .update({
          marks: marks,
          question_data: question,
        })
        .eq('question_number', qNumStr);

      if (error) {
        errors.push(`${qNumStr}: ${error.message}`);
      } else {
        updated++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${updated} questions from exam.seed.json`,
        updated: updated,
        errors: errors.length > 0 ? errors : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sync from seed file' },
      { status: 500 }
    );
  }
}
