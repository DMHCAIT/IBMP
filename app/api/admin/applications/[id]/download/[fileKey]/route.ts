import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// Define interface for document data structure
interface DocumentData {
  name?: string;
  size?: number;
  type?: string;
  content?: string;
}

interface DocumentsCollection {
  additionalDocuments?: { [key: string]: DocumentData };
  [key: string]: DocumentData | { [key: string]: DocumentData } | undefined;
}

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
    console.log(`[Download] Fetching document: ${params.fileKey} for application ${params.id}`);
    
    // Get the application with documents
    const { data: application, error } = await db
      .from('applications')
      .select('documents')
      .eq('application_number', params.id)
      .single();

    if (error || !application) {
      console.error(`[Download] Application not found: ${params.id}`, error);
      return NextResponse.json({
        success: false,
        message: 'Application not found',
      }, { status: 404 });
    }

    const documents = application.documents as DocumentsCollection;
    if (!documents) {
      console.error(`[Download] No documents in application: ${params.id}`);
      return NextResponse.json({
        success: false,
        message: 'No documents found',
      }, { status: 404 });
    }

    console.log(`[Download] Available document keys:`, Object.keys(documents));

    let fileData: DocumentData | null = null;
    
    // Check if it's an additional document
    if (params.fileKey.startsWith('additionalDoc_') && documents.additionalDocuments) {
      console.log(`[Download] Looking for additional document: ${params.fileKey}`);
      fileData = documents.additionalDocuments[params.fileKey] || null;
    } else {
      console.log(`[Download] Looking for regular document: ${params.fileKey}`);
      const directDoc = documents[params.fileKey];
      if (directDoc && typeof directDoc === 'object' && 'content' in directDoc) {
        fileData = directDoc as DocumentData;
      }
    }

    if (!fileData) {
      console.error(`[Download] File data not found for key: ${params.fileKey}`);
      return NextResponse.json({
        success: false,
        message: 'File not found',
      }, { status: 404 });
    }

    if (!fileData.content) {
      console.error(`[Download] File has no content for key: ${params.fileKey}`);
      return NextResponse.json({
        success: false,
        message: 'File has no content',
      }, { status: 400 });
    }

    console.log(`[Download] Found file: ${fileData.name}, size: ${fileData.size}`);

    // Convert base64 back to bytes
    try {
      const binary = atob(fileData.content);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      
      // Set appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', fileData.type || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${fileData.name || 'download'}"`);
      headers.set('Content-Length', bytes.length.toString());
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      console.log(`[Download] Returning file: ${fileData.name}, type: ${fileData.type}, bytes: ${bytes.length}`);
      return new NextResponse(bytes, { headers, status: 200 });
    } catch (decodeError) {
      console.error(`[Download] Failed to decode base64 content:`, decodeError);
      return NextResponse.json({
        success: false,
        message: 'Failed to decode file content',
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({
      success: false,
      message: 'Error downloading file',
    }, { status: 500 });
  }
}