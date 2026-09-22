import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

export async function POST(request: NextRequest) {
  try {
    const { questionId, imageData, fileName, mimeType = 'image/png', title } = await request.json();

    // Validate inputs
    if (!questionId || !imageData || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: questionId, imageData, fileName' },
        { status: 400 }
      );
    }

    // Validate that imageData is valid base64
    let base64Data = imageData;
    if (imageData.startsWith('data:')) {
      // Extract base64 from data URI
      const matches = imageData.match(/base64,(.+)$/);
      if (!matches) {
        return NextResponse.json(
          { error: 'Invalid data URI format' },
          { status: 400 }
        );
      }
      base64Data = matches[1];
    }

    // Validate base64
    try {
      Buffer.from(base64Data, 'base64');
    } catch {
      return NextResponse.json(
        { error: 'Invalid base64 data' },
        { status: 400 }
      );
    }

    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('assessment_questions')
      .select('id, question_number, topic')
      .eq('id', questionId)
      .single();

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Prepare image record
    const imageTitle = title || `${question.question_number} - ${fileName}`;
    const fileSize = Buffer.from(base64Data, 'base64').length;

    // Insert image record
    const { data: imageRecord, error: insertError } = await supabase
      .from('assessment_question_images')
      .insert({
        question_id: questionId,
        image_url: `/quiz-assets/${fileName}`, // Fallback URL
        image_path: fileName,
        image_title: imageTitle,
        file_size: fileSize,
        mime_type: mimeType,
        description: `Image uploaded for ${question.question_number}`,
        sort_order: 0,
        is_active: true,
        image_data_base64: base64Data,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting image:', insertError);
      return NextResponse.json(
        { error: `Failed to upload image: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Image uploaded for question ${question.question_number}`,
      image: {
        id: imageRecord.id,
        questionId: imageRecord.question_id,
        title: imageRecord.image_title,
        fileName: imageRecord.image_path,
        mimeType: imageRecord.mime_type,
        fileSize: imageRecord.file_size,
      }
    });

  } catch (error: unknown) {
    console.error('Error uploading image to database:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');

    let query = supabase
      .from('assessment_question_images')
      .select('id, question_id, image_title, mime_type, file_size, is_active, created_at')
      .eq('is_active', true);

    if (questionId) {
      query = query.eq('question_id', questionId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      count: data?.length || 0,
      images: data || []
    });

  } catch (error: unknown) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}
