import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string | null;
  message: string;
  created_at: string;
}

export async function GET() {
  try {
    let submissions: Submission[] = [];

    // Try to fetch from Supabase first
    try {
      const db = getSupabaseServiceClient();
      console.log('[Contact Submissions API] Fetching from Supabase...');
      
      const { data, error } = await db
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Contact Submissions API] Supabase error:', error);
      } else if (data && data.length > 0) {
        console.log(`[Contact Submissions API] Fetched ${data.length} submissions from Supabase`);
        submissions = data;
        return NextResponse.json({ success: true, data: submissions });
      } else {
        console.log('[Contact Submissions API] No data from Supabase, trying fallback...');
      }
    } catch (dbErr) {
      console.warn('[Contact Submissions API] Supabase connection error:', dbErr);
    }

    // Fallback: try to read from local JSON file
    try {
      const filePath = path.join(process.cwd(), 'data', 'contact-submissions.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      submissions = Array.isArray(parsed) ? parsed.reverse() : [];
      console.log(`[Contact Submissions API] Loaded ${submissions.length} submissions from local file`);
    } catch (fileErr) {
      console.warn('[Contact Submissions API] Local file not found or error parsing:', fileErr);
      submissions = [];
    }

    return NextResponse.json({ success: true, data: submissions });
  } catch (err) {
    console.error('[Contact Submissions API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
