import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('file');
    const action = searchParams.get('action') || 'view'; // 'view' or 'download'

    if (!filePath) {
      return NextResponse.json({ success: false, message: 'Missing file parameter' }, { status: 400 });
    }

    console.log('Request for file:', filePath, 'action:', action);

    // Construct the Supabase storage URL with service role authentication
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    // Use Supabase REST API to download file with service role header
    const downloadUrl = `${supabaseUrl}/storage/v1/object/accreditation-files/${filePath}`;
    
    console.log('Fetching from:', downloadUrl);

    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Request failed with status ${response.status}:`, await response.text());
      return NextResponse.json({ success: false, message: `Request failed: ${response.statusText}` }, { status: response.status });
    }

    // Get the file data
    const fileData = await response.arrayBuffer();

    // Extract filename from path
    const fileName = filePath.split('/').pop() || 'download';

    // Determine content type based on file extension
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.png')) {
      contentType = 'image/png';
    } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      contentType = 'image/jpeg';
    } else if (fileName.endsWith('.pdf')) {
      contentType = 'application/pdf';
    }

    // Set Content-Disposition based on action
    const disposition = action === 'download' 
      ? `attachment; filename="${fileName}"`
      : `inline; filename="${fileName}"`;

    // Return file with proper headers
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': disposition,
        'Content-Length': fileData.byteLength.toString(),
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Download error:', err);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
