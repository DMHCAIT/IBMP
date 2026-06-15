import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { defaultContent, SiteContent } from '@/lib/content-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const TABLE_NAME = 'site_content';
const RECORD_ID = 'main'; // single record to store all content

// In-memory cache: avoids hitting database on every request
let memCache: SiteContent | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

function invalidateCache() { 
  memCache = null; 
  lastCacheTime = 0;
}

function isCacheValid(): boolean {
  return memCache !== null && Date.now() - lastCacheTime < CACHE_TTL_MS;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

// Sanitize content for serialization - removes undefined values
function sanitizeForJSON(obj: unknown): JsonValue {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj as JsonPrimitive;
  if (Array.isArray(obj)) return obj.map(sanitizeForJSON);
  
  const cleaned: { [key: string]: JsonValue } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForJSON(value);
    }
  }
  return cleaned;
}

// Read content from Supabase with caching
async function readContentFromDatabase(): Promise<SiteContent> {
  if (isCacheValid() && memCache) {
    console.log('Serving content from cache');
    return memCache as SiteContent;
  }

  try {
    const supabase = getSupabaseServiceClient();
    console.log(`Reading content from Supabase table: ${TABLE_NAME}`);
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('content')
      .eq('id', RECORD_ID)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record doesn't exist, return defaults
        console.log('Content record not found, using defaults');
        memCache = defaultContent;
        lastCacheTime = Date.now();
        return defaultContent;
      }
      throw error;
    }

    const parsed = data?.content || defaultContent;
    memCache = { ...defaultContent, ...parsed };
    lastCacheTime = Date.now();
    console.log('Content loaded from Supabase and cached');
    return memCache as SiteContent;
  } catch (error) {
    console.warn(`Failed to read content from Supabase: ${error}. Using defaults.`);
    return defaultContent;
  }
}

// Write content to Supabase
async function writeContentToDatabase(content: SiteContent): Promise<void> {
  invalidateCache();

  try {
    const supabase = getSupabaseServiceClient();
    const sanitized = sanitizeForJSON(content);
    
    console.log(`Writing content to Supabase table: ${TABLE_NAME}`);
    console.log(`Content size: ${JSON.stringify(sanitized).length} bytes`);

    const { error: upsertError, data } = await supabase
      .from(TABLE_NAME)
      .upsert(
        { id: RECORD_ID, content: sanitized, updated_at: new Date() },
        { onConflict: 'id' }
      )
      .select();

    if (upsertError) {
      const errorMsg = upsertError instanceof Error 
        ? upsertError.message 
        : typeof upsertError === 'object' && upsertError !== null
        ? JSON.stringify(upsertError)
        : String(upsertError);
      console.error('Supabase upsert error:', errorMsg);
      throw new Error(`Supabase error: ${errorMsg}`);
    }

    console.log('Content written to Supabase successfully:', data);
    memCache = content;
    lastCacheTime = Date.now();
  } catch (error) {
    const errorMsg = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error)
      : String(error);
    console.error(`Failed to write content to Supabase: ${errorMsg}`, error);
    throw new Error(`Cannot write content to database: ${errorMsg}`);
  }
}

// GET - Retrieve all content (served from cache after first load)
export async function GET() {
  try {
    const content = await readContentFromDatabase();
    return NextResponse.json(
      { success: true, data: content },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error reading content:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Failed to read content', details: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Save all content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    // Merge with existing content to preserve any fields not included
    const existingContent = await readContentFromDatabase();
    const mergedContent = { ...existingContent, ...body.content };
    
    // Validate that content can be serialized to JSON
    try {
      const testSerialize = JSON.stringify(mergedContent);
      console.log(`Serialized content size: ${testSerialize.length} bytes`);
    } catch (serializeError) {
      console.error('Content serialization error:', serializeError);
      const errMsg = serializeError instanceof Error ? serializeError.message : String(serializeError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content contains non-serializable data',
          details: errMsg
        },
        { status: 400 }
      );
    }
    
    await writeContentToDatabase(mergedContent);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully',
      data: mergedContent 
    });
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error)
      : String(error);
    console.error('Error saving content:', errorMessage);
    
    // Check if it's a table not found error
    const isTableNotFound = errorMessage.includes('relation') && errorMessage.includes('does not exist');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save content', 
        details: errorMessage,
        ...(isTableNotFound && {
          hint: 'The site_content table may not exist. Run the migration: migrations/001_create_site_content_table.sql'
        })
      },
      { status: 500 }
    );
  }
}

// DELETE - Reset content to defaults
export async function DELETE() {
  try {
    await writeContentToDatabase(defaultContent);
    return NextResponse.json({ 
      success: true, 
      message: 'Content reset to defaults',
      data: defaultContent 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error resetting content:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Failed to reset content', details: errorMessage },
      { status: 500 }
    );
  }
}
