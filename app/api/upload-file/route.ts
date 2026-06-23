import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('=== VIDEO UPLOAD REQUEST ===');
  
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    
    // Only handle JSON requests
    if (!contentType.includes('application/json')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Parsed body keys:', Object.keys(body));
    } catch (parseErr) {
      console.error('Failed to parse JSON:', parseErr);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { fileData, fileName, filePath, bucketName = 'public', mimeType = 'video/mp4' } = body;

    // Validate required fields
    if (!fileData || !fileName) {
      console.error('Missing required fields:', { fileData: !!fileData, fileName: !!fileName });
      return NextResponse.json(
        { error: 'fileData and fileName are required' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    let fileBuffer;
    try {
      fileBuffer = Buffer.from(fileData, 'base64');
      console.log('Decoded base64 to buffer:', { size: fileBuffer.length, fileName });
    } catch (decodeErr) {
      console.error('Failed to decode base64:', decodeErr);
      return NextResponse.json(
        { error: 'Invalid base64 data' },
        { status: 400 }
      );
    }

    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Supabase config:', {
      urlExists: !!supabaseUrl,
      keyExists: !!serviceRoleKey,
    });

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const uploadPath = filePath || `videos/${fileName}`;
    console.log('Uploading to:', { bucket: bucketName, path: uploadPath, size: fileBuffer.length });

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uploadPath, fileBuffer, {
        upsert: true,
        contentType: mimeType,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadPath);

    const publicUrl = publicUrlData?.publicUrl;
    console.log('Public URL:', publicUrl);

    if (!publicUrl) {
      console.error('Failed to get public URL');
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      );
    }

    console.log('=== UPLOAD COMPLETE ===');
    return NextResponse.json({ url: publicUrl });

  } catch (err: unknown) {
    console.error('=== UPLOAD ERROR ===');
    console.error('Error:', err);
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Server error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
