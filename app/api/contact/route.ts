import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Send lead to TeleCRM API (fire-and-forget)
async function sendToTeleCRM(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string | null;
  website_url?: string;
}) {
  const telecrmToken = process.env.TELECRM_SYNC_TOKEN;
  const telecrmApiUrl = process.env.TELECRM_API_URL;
  const telecrmEnterpriseId = process.env.TELECRM_ENTERPRISE_ID;

  if (!telecrmToken || !telecrmApiUrl) {
    console.warn('Skipping TeleCRM - missing configuration');
    return;
  }

  try {
    const cleanedPhone = data.phone.replace(/\D/g, '');

    // Prepare candidate payloads; try multiple formats
    const candidates = [
      {
        // wrapped under 'fields' (accepted by this enterprise)
        fields: {
          name: data.name,
          email: data.email,
          phone: cleanedPhone,
          message: data.message,
          subject: data.subject || undefined,
          website_url: data.website_url || undefined,
        },
      },
      {
        // flat top-level fields
        name: data.name,
        email: data.email,
        phone: cleanedPhone,
        message: data.message,
        subject: data.subject || undefined,
        website_url: data.website_url || undefined,
      },
      {
        // wrapped under 'lead'
        lead: {
          name: data.name,
          email: data.email,
          phone: cleanedPhone,
          message: data.message,
          subject: data.subject || undefined,
          website_url: data.website_url || undefined,
        },
      },
    ];

    const normalizedApiUrl = telecrmApiUrl.replace(/\/$/, '');
    let baseUrl = normalizedApiUrl;
    if (/autoupdate\/v2/i.test(normalizedApiUrl) && telecrmEnterpriseId) {
      baseUrl = `https://next-api.telecrm.in/enterprise/${telecrmEnterpriseId}/autoupdatelead`;
    } else if (!/autoupdate|autoupdatelead|enterprise/i.test(normalizedApiUrl)) {
      baseUrl = `${normalizedApiUrl}/leads`;
    }

    let sent = false;
    for (const payload of candidates) {
      try {
        console.log('[TeleCRM] Attempt URL:', baseUrl);
        console.log('[TeleCRM] Attempt payload:', payload);

        const res = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${telecrmToken}`,
          },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        console.log('[TeleCRM] Attempt status:', res.status, 'body:', text);

        if (res.ok) {
          console.log('[TeleCRM] Lead successfully sent with payload variant');
          sent = true;
          break;
        }
      } catch (err) {
        console.error('[TeleCRM] Error sending attempt:', err);
      }
    }

    if (!sent) {
      console.error('[TeleCRM] All payload attempts failed. See logs above for details.');
    }
  } catch (err) {
    console.error('[TeleCRM] Error sending lead:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim() || !phone?.trim()) {
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
      phone: phone.trim(),
      subject: subject?.trim() || null,
      message: message.trim(),
      website_url: 'https://www.ibmpractitioner.us/',
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

    // Fire-and-forget: send lead to TeleCRM (do not block main request)
    sendToTeleCRM({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      message: submission.message,
      subject: submission.subject,
      website_url: 'https://www.ibmpractitioner.us/',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
