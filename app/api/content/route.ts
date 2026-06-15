import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { defaultContent, SiteContent } from '@/lib/content-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// In-memory cache: avoids hitting disk on every request
let memCache: SiteContent | null = null;

function invalidateCache() { memCache = null; }

// Sanitize content for serialization - removes undefined values
function sanitizeForJSON(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForJSON);
  
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = sanitizeForJSON(value);
    }
  }
  return cleaned;
}

// Ensure the data directory exists (only needed on writes)
async function ensureDataDirectory() {
  try { 
    await fs.access(DATA_DIR); 
  } catch (error) { 
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      console.log(`Created data directory: ${DATA_DIR}`);
    } catch (mkdirError) {
      console.error('Failed to create data directory:', mkdirError);
      throw new Error(`Cannot create data directory at ${DATA_DIR}: ${mkdirError}`);
    }
  }
}

// Read content — serve from memory cache if available
async function readContentFromFile(): Promise<SiteContent> {
  if (memCache) return memCache as SiteContent;
  try {
    console.log(`Reading content from: ${CONTENT_FILE_PATH}`);
    const data = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    memCache = { ...defaultContent, ...parsed };
    return memCache as SiteContent;
  } catch (error) {
    console.warn(`Failed to read content file: ${error}. Using defaults.`);
    return defaultContent;
  }
}

// Write content to file and invalidate cache
async function writeContentToFile(content: SiteContent): Promise<void> {
  invalidateCache();
  await ensureDataDirectory();
  
  try {
    // Sanitize the content to ensure it's JSON serializable
    const sanitized = sanitizeForJSON(content);
    const jsonString = JSON.stringify(sanitized, null, 2);
    
    console.log(`Writing content to: ${CONTENT_FILE_PATH}`);
    console.log(`Content size: ${jsonString.length} bytes`);
    
    await fs.writeFile(CONTENT_FILE_PATH, jsonString, 'utf-8');
    memCache = content; // repopulate cache with what was just written
    console.log('Content written successfully');
  } catch (error) {
    console.error(`Failed to write content file at ${CONTENT_FILE_PATH}:`, error);
    throw new Error(`Cannot write content file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// GET - Retrieve all content (served from memory cache after first load)
export async function GET() {
  try {
    const content = await readContentFromFile();
    return NextResponse.json(
      { success: true, data: content },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error reading content:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
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
    const existingContent = await readContentFromFile();
    const mergedContent = { ...existingContent, ...body.content };
    
    // Validate that content can be serialized to JSON
    try {
      const testSerialize = JSON.stringify(mergedContent);
      console.log(`Serialized content size: ${testSerialize.length} bytes`);
    } catch (serializeError) {
      console.error('Content serialization error:', serializeError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Content contains non-serializable data',
          details: serializeError instanceof Error ? serializeError.message : String(serializeError)
        },
        { status: 400 }
      );
    }
    
    await writeContentToFile(mergedContent);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully',
      data: mergedContent 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error saving content:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save content', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

// DELETE - Reset content to defaults
export async function DELETE() {
  try {
    await writeContentToFile(defaultContent);
    return NextResponse.json({ 
      success: true, 
      message: 'Content reset to defaults',
      data: defaultContent 
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error resetting content:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { success: false, error: 'Failed to reset content', details: errorMessage },
      { status: 500 }
    );
  }
}
