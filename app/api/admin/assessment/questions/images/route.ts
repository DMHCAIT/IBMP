import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const questionId = formData.get('questionId') as string;
    const imageTitle = formData.get('imageTitle') as string;

    if (!file || !questionId) {
      return NextResponse.json(
        { error: 'File and question ID are required' },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const timestamp = Date.now();
    const fileName = `question-${questionId}-${timestamp}-${file.name}`;
    const filePath = `assessment-questions/${fileName}`;

    const buffer = await file.arrayBuffer();

    const { error: uploadError, data: _uploadData } = await supabase.storage
      .from('uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    // Save to assessment_question_images table
    const { data: imageRecord, error: dbError } = await supabase
      .from('assessment_question_images')
      .insert([
        {
          question_id: questionId,
          image_url: imageUrl,
          image_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          image_title: imageTitle || file.name,
        },
      ])
      .select();

    if (dbError) {
      // Delete uploaded file if DB insert fails
      await supabase.storage.from('uploads').remove([filePath]);
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      );
    }

    // Update question with image URL if it's the first image
    await supabase
      .from('assessment_questions')
      .update({ image_url: imageUrl })
      .eq('id', questionId)
      .is('image_url', null);

    return NextResponse.json(imageRecord[0], { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    let query = supabase
      .from('assessment_question_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    // If questionId is provided, filter by it; otherwise return all
    if (questionId) {
      query = query.eq('question_id', questionId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      );
    }

    // Get image path
    const { data: imageRecord, error: fetchError } = await supabase
      .from('assessment_question_images')
      .select('image_path')
      .eq('id', imageId)
      .single();

    if (fetchError || !imageRecord) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    await supabase.storage
      .from('uploads')
      .remove([imageRecord.image_path]);

    // Delete from database
    const { error: deleteError } = await supabase
      .from('assessment_question_images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
