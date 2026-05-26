import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const submission = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || null,
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    let savedToDb = false;

    // Try Supabase first
    try {
      const db = getSupabaseServiceClient();
      const { error } = await db.from('contact_submissions').insert(submission);
      if (!error) savedToDb = true;
      else console.warn('[Contact API] Supabase insert error:', error.message);
    } catch (dbErr) {
      console.warn('[Contact API] Supabase unavailable:', dbErr);
    }

    // Fallback: save to local JSON file when DB table doesn't exist
    if (!savedToDb) {
      try {
        const filePath = path.join(process.cwd(), 'data', 'contact-submissions.json');
        let existing: typeof submission[] = [];
        try {
          const raw = await fs.readFile(filePath, 'utf-8');
          existing = JSON.parse(raw);
        } catch { /* file doesn't exist yet */ }
        existing.push(submission);
        await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');
      } catch (fileErr) {
        console.error('[Contact API] File fallback also failed:', fileErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
