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

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const imageId = params.imageId;
    
    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Fetch image from database
    const { data, error } = await supabase
      .from('assessment_question_images')
      .select('id, image_data_base64, mime_type, image_title, question_id')
      .eq('id', imageId)
      .single();

    if (error) {
      console.error('Error fetching image:', error);
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    if (!data || !data.image_data_base64) {
      return NextResponse.json(
        { error: 'Image data not found in database' },
        { status: 404 }
      );
    }

    // Return base64 encoded image data
    return NextResponse.json({
      id: data.id,
      data: data.image_data_base64,
      mimeType: data.mime_type || 'image/png',
      title: data.image_title,
      questionId: data.question_id
    });

  } catch (err: unknown) {
    console.error('Error retrieving image:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve image' },
      { status: 500 }
    );
  }
}
