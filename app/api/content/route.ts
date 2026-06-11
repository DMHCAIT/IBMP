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

// Ensure the data directory exists (only needed on writes)
async function ensureDataDirectory() {
  try { await fs.access(DATA_DIR); } catch { await fs.mkdir(DATA_DIR, { recursive: true }); }
}

// Read content — serve from memory cache if available
async function readContentFromFile(): Promise<SiteContent> {
  if (memCache) return memCache as SiteContent;
  try {
    const data = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    memCache = { ...defaultContent, ...parsed };
    return memCache as SiteContent;
  } catch {
    return defaultContent;
  }
}

// Write content to file and invalidate cache
async function writeContentToFile(content: SiteContent): Promise<void> {
  invalidateCache();
  await ensureDataDirectory();
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
  memCache = content; // repopulate cache with what was just written
}

// GET - Retrieve all content (served from memory cache after first load)
export async function GET() {
  try {
    const content = await readContentFromFile();
    return NextResponse.json(
      { success: true, data: content },
      { headers: { 'Cache-Control': 'private, max-age=5, stale-while-revalidate=10' } }
    );
  } catch (error) {
    console.error('Error reading content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read content' },
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
    
    await writeContentToFile(mergedContent);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully',
      data: mergedContent 
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save content' },
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
    console.error('Error resetting content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset content' },
      { status: 500 }
    );
  }
}
