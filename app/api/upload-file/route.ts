import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let fileBuffer: Buffer | null = null;
    let bucketName = 'public';
    let filePath = '';
    let mimeType = 'application/octet-stream';

    // Handle FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      bucketName = (formData.get('bucketName') as string) || 'public';
      filePath = formData.get('filePath') as string;
      mimeType = file?.type || 'application/octet-stream';
      
      if (file) {
        fileBuffer = Buffer.from(await file.arrayBuffer());
      }
    } else if (contentType.includes('application/json')) {
      // Handle JSON with base64 encoded file
      const body = await request.json();
      const { fileData, fileName } = body;
      
      console.log('Received upload request:', { fileName, fileDataLength: fileData?.length, filePath: body.filePath });
      
      if (!fileData || !fileName) {
        return NextResponse.json(
          { error: 'fileData and fileName are required' },
          { status: 400 }
        );
      }

      // Convert base64 to buffer
      try {
        fileBuffer = Buffer.from(fileData, 'base64');
        filePath = body.filePath || `public/${fileName}`;
        bucketName = body.bucketName || 'public';
        mimeType = body.mimeType || 'application/octet-stream';
        
        console.log('Converted to buffer:', { bufferSize: fileBuffer.length, filePath, mimeType });
      } catch (decodeErr) {
        console.error('Failed to decode base64:', decodeErr);
        throw new Error('Invalid base64 data');
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!filePath) {
      return NextResponse.json(
        { error: 'No file path provided' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    // Create Supabase client with service role key for server-side upload
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    console.log('Starting upload:', { filePath, mimeType, bufferSize: fileBuffer.length });

    // Upload file with retries to tolerate transient network/DNS issues
    const maxAttempts = 4;
    let attempt = 0;
    let uploadData: unknown = null;
    let uploadError: unknown = null;

    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, fileBuffer, {
            upsert: true,
            contentType: mimeType,
          });

        if (error) {
          throw error;
        }

        uploadData = data;
        console.log(`File uploaded successfully (attempt ${attempt}):`, data);
        break;
      } catch (err) {
        uploadError = err;
        console.error(`Upload attempt ${attempt} failed:`, err);
        // exponential backoff
        if (attempt < maxAttempts) {
          const waitMs = 500 * Math.pow(2, attempt);
          await new Promise((res) => setTimeout(res, waitMs));
        }
      }
    }

    if (!uploadData) {
      console.error('Upload failed after retries:', uploadError);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (uploadError && typeof uploadError === 'object' && 'message' in (uploadError as Record<string, unknown>)) ? (uploadError as Record<string, any>).message : String(uploadError);
      throw new Error(msg || 'Upload failed after retries');
    }

    // Get public URL
    // Attempt to get public URL, with retry
    let publicUrl: unknown = null;
    attempt = 0;
    let publicErr: unknown = null;
    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const result = supabase.storage.from(bucketName).getPublicUrl(filePath);
        publicUrl = result.data;
        break;
      } catch (err) {
        publicErr = err;
        console.error(`getPublicUrl attempt ${attempt} failed:`, err);
        if (attempt < maxAttempts) await new Promise((res) => setTimeout(res, 300 * Math.pow(2, attempt)));
      }
    }

    if (!publicUrl) {
      console.error('Failed to retrieve public URL after retries:', publicErr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = (publicErr && typeof publicErr === 'object' && 'message' in (publicErr as Record<string, unknown>)) ? (publicErr as Record<string, any>).message : String(publicErr);
      throw new Error(msg || 'Failed to retrieve public URL');
    }

    // Narrow types for response
    const publicUrlObj = publicUrl as { publicUrl?: string };
    const uploadDataObj = uploadData as { path?: string };

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        url: publicUrlObj.publicUrl,
        path: uploadDataObj.path,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in upload API:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
