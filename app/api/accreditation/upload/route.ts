import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return NextResponse.json({ success: false, message: 'Missing file or path' }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    const buffer = await file.arrayBuffer();

    // Generate a unique filename with timestamp
    const fileName = `${Date.now()}_${file.name}`;
    const fullPath = `${path}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('accreditation-files')
      .upload(fullPath, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      filePath: data?.path || fullPath
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
