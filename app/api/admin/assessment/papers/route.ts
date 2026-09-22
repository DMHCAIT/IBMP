import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { seedQuestionToDatabase, SeedFile } from '@/lib/assessment-seed';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Helper function to create URL-friendly slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// GET: List all papers or filter by slug
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    let query = supabase
      .from('assessment_exam_papers')
      .select('*');

    // Filter by slug if provided
    if (slug) {
      query = query.eq('slug', slug);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch papers' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: data?.length || 0,
      papers: data || []
    });

  } catch (err: unknown) {
    console.error('Error fetching papers:', err);
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}

// POST: Create new paper
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, duration_minutes, total_questions, total_marks, passing_marks, exam_type, max_attempts } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Paper name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = createSlug(name);

    // Check if slug already exists
    const { data: existing, error: checkError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .eq('slug', slug)
      .single();

    if (checkError?.code !== 'PGRST116' && existing) {
      return NextResponse.json(
        { error: `A paper with slug "${slug}" already exists` },
        { status: 400 }
      );
    }

    // Calculate passing percentage
    const passing_percentage = total_marks > 0 
      ? (passing_marks / total_marks) * 100 
      : 62.5;

    // Insert new paper
    const { data, error } = await supabase
      .from('assessment_exam_papers')
      .insert({
        name,
        slug,
        description: description || null,
        duration_minutes: duration_minutes || 120,
        total_questions: total_questions || 60,
        total_marks: total_marks || 80,
        passing_marks: passing_marks || 50,
        passing_percentage,
        exam_type: exam_type || 'Standard',
        max_attempts: max_attempts || 1,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating paper:', error);
      return NextResponse.json(
        { error: 'Failed to create paper' },
        { status: 500 }
      );
    }

    const seedPath = path.join(process.cwd(), 'public', 'exam.seed.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8')) as SeedFile;
    const seedRows = seedData.questions.map(question =>
      seedQuestionToDatabase(question, seedData, data.id)
    );
    const { error: questionError } = await supabase
      .from('assessment_questions')
      .insert(seedRows);

    if (questionError) {
      await supabase.from('assessment_exam_papers').delete().eq('id', data.id);
      console.error('Error seeding new paper:', questionError);
      return NextResponse.json(
        { error: 'Paper was created but its seed questions could not be inserted' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Paper "${name}" created with ${seedRows.length} seed questions`,
      paper: data
    }, { status: 201 });

  } catch (err: unknown) {
    console.error('Error creating paper:', err);
    return NextResponse.json(
      { error: 'Failed to create paper' },
      { status: 500 }
    );
  }
}
