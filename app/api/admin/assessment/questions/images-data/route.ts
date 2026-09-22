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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('question_id');
    const format = searchParams.get('format') || 'base64'; // 'base64' or 'url'

    let query = supabase
      .from('assessment_question_images')
      .select('id, question_id, image_data_base64, mime_type, image_title, image_url, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (questionId) {
      query = query.eq('question_id', questionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching images:', error);
      return NextResponse.json(
        { error: 'Failed to fetch images' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    // Format response based on requested format
    if (format === 'base64') {
      // Return with embedded base64 data
      return NextResponse.json(
        data.map(img => ({
          id: img.id,
          questionId: img.question_id,
          title: img.image_title,
          mimeType: img.mime_type || 'image/png',
          data: img.image_data_base64, // Embedded base64 data
          dataUri: img.image_data_base64 
            ? `data:${img.mime_type || 'image/png'};base64,${img.image_data_base64}`
            : img.image_url, // Fallback to URL if no data
          sortOrder: img.sort_order
        }))
      );
    } else {
      // Return with URLs
      return NextResponse.json(
        data.map(img => ({
          id: img.id,
          questionId: img.question_id,
          title: img.image_title,
          mimeType: img.mime_type || 'image/png',
          image_url: img.image_url,
          hasData: !!img.image_data_base64,
          sortOrder: img.sort_order
        }))
      );
    }

  } catch (err: unknown) {
    console.error('Error retrieving images:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve images' },
      { status: 500 }
    );
  }
}
