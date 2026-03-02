import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// CRITICAL: Force dynamic rendering so this route is never statically cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use service role client for admin operations (bypasses RLS)
function getAdminClient() {
  try {
    return getSupabaseServiceClient();
  } catch {
    return supabase;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; fileKey: string } }
) {
  try {
    const db = getAdminClient();
    
    // Get the application with documents
    const { data: application, error } = await db
      .from('applications')
      .select('documents')
      .eq('application_number', params.id)
      .single();

    if (error || !application) {
      return NextResponse.json({
        success: false,
        message: 'Application not found',
      }, { status: 404 });
    }

    const documents = application.documents as Record<string, any>;
    if (!documents) {
      return NextResponse.json({
        success: false,
        message: 'No documents found',
      }, { status: 404 });
    }

    let fileData = null;
    
    // Check if it's an additional document
    if (params.fileKey.startsWith('additionalDoc_') && documents.additionalDocuments) {
      fileData = documents.additionalDocuments[params.fileKey];
    } else {
      fileData = documents[params.fileKey];
    }

    if (!fileData || !fileData.content) {
      return NextResponse.json({
        success: false,
        message: 'File not found',
      }, { status: 404 });
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(fileData.content, 'base64');
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', fileData.type || 'application/octet-stream');
    headers.set('Content-Disposition', `attachment; filename="${fileData.name}"`);
    headers.set('Content-Length', buffer.length.toString());

    return new NextResponse(buffer, { headers });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({
      success: false,
      message: 'Error downloading file',
    }, { status: 500 });
  }
}