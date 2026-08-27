import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { bucketName } = await request.json();

    if (!bucketName) {
      return NextResponse.json(
        { error: 'Bucket name is required' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key (server-side)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });

    if (error) {
      console.error('Error creating bucket:', error);
      
      // If bucket already exists, that's fine
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { message: 'Bucket already exists', success: true },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Bucket created successfully:', data);

    // Now disable RLS on the storage.objects table for public access
    try {
      console.log('Attempting to disable RLS for public bucket...');
      
      // Use Supabase admin API to disable RLS on storage.objects table
      const rpcResponse = await fetch(
        `${supabaseUrl}/rest/v1/rpc/alter_policy_to_public`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bucket: bucketName }),
        }
      ).catch(() => null);

      if (rpcResponse && rpcResponse.ok) {
        console.log('RLS successfully disabled');
      } else {
        console.log('RLS policy update attempted (may need manual setup in dashboard)');
      }
    } catch (rpcErr) {
      console.log('RLS setup skipped, bucket should be accessible:', rpcErr);
    }

    return NextResponse.json(
      { message: 'Bucket created successfully', data },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in create-bucket API:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}
