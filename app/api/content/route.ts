import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { defaultContent, SiteContent } from '@/lib/content-data';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read content from file
async function readContentFromFile(): Promise<SiteContent> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(CONTENT_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    // Merge with defaults to ensure all fields exist
    return { ...defaultContent, ...parsed };
  } catch {
    // If file doesn't exist, return default content
    return defaultContent;
  }
}

// Write content to file
async function writeContentToFile(content: SiteContent): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
}

// GET - Retrieve all content
export async function GET() {
  try {
    const content = await readContentFromFile();
    return NextResponse.json({ success: true, data: content });
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
