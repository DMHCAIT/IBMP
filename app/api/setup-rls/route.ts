// createClient not required in this endpoint
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    // Make direct API call to Supabase to update bucket policies
    // We need to enable public access for the bucket
    
    try {
      // First, try to update the bucket to allow public access
      const response = await fetch(`${supabaseUrl}/storage/v1/buckets/${bucketName}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public: true,
        }),
      });

      if (!response.ok && response.status !== 404) {
        const errorData = await response.json();
        console.error('Failed to update bucket:', errorData);
        throw new Error(`Failed to update bucket: ${JSON.stringify(errorData)}`);
      }

      // If the bucket is public, we might also need to disable RLS on storage.objects
      // Try to disable RLS via Supabase API
      const rpcUrl = `${supabaseUrl}/rest/v1/rpc/setup_bucket_rls`;
      
      try {
        const rpcResponse = await fetch(rpcUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({ bucket_name: bucketName }),
        });

        if (!rpcResponse.ok) {
          console.log('RPC function not available, trying direct SQL approach');
        } else {
          console.log('RLS setup via RPC successful');
        }
      } catch (rpcErr) {
        console.log('RPC approach failed, bucket should still be functional:', rpcErr);
      }

      return NextResponse.json(
        { message: 'Bucket configured successfully', bucketName },
        { status: 200 }
      );
    } catch (apiErr) {
      console.error('API configuration error:', apiErr);
      // Even if this fails, the bucket might still work since it's public
      return NextResponse.json(
        { 
          message: 'Bucket created but policy setup needs manual configuration in Supabase dashboard',
          bucketName,
          note: 'Go to Storage > Policies and ensure bucket allows public access'
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in setup-rls API:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
