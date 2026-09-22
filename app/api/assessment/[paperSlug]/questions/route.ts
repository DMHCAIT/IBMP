import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Resolve the canonical slug and tolerate older URLs that omitted stop words
// such as "and" from a paper name.
async function getPaperIdBySlug(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from('assessment_exam_papers')
    .select('id')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (data?.id) return data.id;

  const compactSlug = slug.replace(/-(and|the|of)-/g, '-');
  const { data: papers } = await supabase
    .from('assessment_exam_papers')
    .select('id, slug')
    .eq('is_active', true);

  return papers?.find((paper) => paper.slug.replace(/-(and|the|of)-/g, '-') === compactSlug)?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { paperSlug: string } }
) {
  try {
    const paperSlug = params.paperSlug;

    // Get paper ID from slug
    const paperId = await getPaperIdBySlug(paperSlug);
    if (!paperId) {
      return NextResponse.json(
        { error: `Paper not found: ${paperSlug}` },
        { status: 404 }
      );
    }

    // Get all questions for this paper, ordered by question_number
    const { data: questions, error } = await supabase
      .from('assessment_questions')
      .select('*, question_data')
      .eq('paper_id', paperId)
      .order('question_number', { ascending: true });

    if (error) {
      console.error('Error fetching questions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found for this paper. Please add questions first.' },
        { status: 404 }
      );
    }

    // Format questions for assessment page
    const formattedQuestions = questions.map((q: any) => {
      // If question_data is available, use it directly
      if (q.question_data) {
        return {
          ...q.question_data,
          id: q.question_data.id || q.question_number,
          number: q.question_data.number || parseInt(q.question_number.replace(/\D/g, ''), 10),
          type: q.type || q.question_data.type,
          stem: q.stem || q.question_data.stem,
          maxUnits: q.marks || q.question_data.maxUnits || 1,
          options: q.options || q.question_data.options || [],
          correctOptionId: q.type === 'mcq' ? q.question_data.scoring?.correctOptionId : undefined,
          correctOption: q.type === 'mcq' ? (q.correct_answer || q.question_data.correctOption) : undefined,
          correct_answer: q.type === 'mcq' ? q.correct_answer : undefined,
          image_url: q.image_url || q.question_data.image_url || q.question_data.asset?.file || null,
          parts: q.question_data.parts || q.parts || [],
          question_data: q.question_data,
        };
      }

      // Otherwise, construct from individual fields
      let parsedOptions: any[] = [];
      if (q.type === 'mcq') {
        try {
          if (typeof q.options === 'string') {
            parsedOptions = JSON.parse(q.options || '[]');
          } else if (Array.isArray(q.options)) {
            parsedOptions = q.options;
          }
        } catch (e) {
          console.error('Error parsing options:', e);
        }
      }

      return {
        id: q.question_number,
        number: parseInt(q.question_number),
        type: q.type,
        topic: q.topic || '',
        stem: q.stem,
        maxUnits: q.marks || 1,
        scoring: { marks: q.marks || 1 },
        options: parsedOptions,
        correctOption: q.type === 'mcq' ? q.correct_answer : undefined,
        parts: q.parts || [],
      };
    });

    return NextResponse.json(formattedQuestions);

  } catch (err: unknown) {
    console.error('Error fetching paper questions:', err);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
