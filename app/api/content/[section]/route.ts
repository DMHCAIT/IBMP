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
    return { ...defaultContent, ...parsed };
  } catch {
    return defaultContent;
  }
}

// Write content to file
async function writeContentToFile(content: SiteContent): Promise<void> {
  await ensureDataDirectory();
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), 'utf-8');
}

// Valid section keys
const validSections = [
  'hero', 'whatWeDo', 'missionVision', 'stats', 'cta',
  'aboutHero', 'board', 'values',
  'accreditationHero', 'process', 'applicationCTA',
  'contact', 'programs', 'verification',
  'header', 'footer'
] as const;

type SectionKey = keyof SiteContent;

function isValidSection(section: string): section is SectionKey {
  return validSections.includes(section as typeof validSections[number]);
}

// GET - Retrieve specific section content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    
    if (!isValidSection(section)) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}. Valid sections: ${validSections.join(', ')}` },
        { status: 400 }
      );
    }

    const content = await readContentFromFile();
    const sectionContent = content[section];

    return NextResponse.json({ 
      success: true, 
      section,
      data: sectionContent 
    });
  } catch (error) {
    console.error('Error reading section content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read section content' },
      { status: 500 }
    );
  }
}

// PUT - Update specific section content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    
    if (!isValidSection(section)) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}. Valid sections: ${validSections.join(', ')}` },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    if (!body.data) {
      return NextResponse.json(
        { success: false, error: 'Section data is required' },
        { status: 400 }
      );
    }

    const content = await readContentFromFile();
    content[section] = body.data;
    await writeContentToFile(content);

    return NextResponse.json({ 
      success: true, 
      message: `Section "${section}" updated successfully`,
      section,
      data: content[section]
    });
  } catch (error) {
    console.error('Error updating section content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update section content' },
      { status: 500 }
    );
  }
}

// DELETE - Reset specific section to defaults
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;
    
    if (!isValidSection(section)) {
      return NextResponse.json(
        { success: false, error: `Invalid section: ${section}. Valid sections: ${validSections.join(', ')}` },
        { status: 400 }
      );
    }

    const content = await readContentFromFile();
    // TypeScript can't infer that section matches on both sides, so we use type assertion
    (content as unknown as Record<string, unknown>)[section] = defaultContent[section];
    await writeContentToFile(content);

    return NextResponse.json({ 
      success: true, 
      message: `Section "${section}" reset to defaults`,
      section,
      data: content[section]
    });
  } catch (error) {
    console.error('Error resetting section content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset section content' },
      { status: 500 }
    );
  }
}
