import { createClient } from '@supabase/supabase-js';

// Use the service role key for admin operations
const SUPABASE_URL = 'https://lpvqjffzocosqyvxzyjn.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdnFqZmZ6b2Nvc3F5dnh6eWpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MjkxMTczNSwiZXhwIjoxOTk4NDg3NzM1fQ.a9_cY8DLgZplP2Ux2mVHr4g6_1W_KxpOjVDjYLZUgXU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function createTestCandidate() {
  try {
    // Create a new test candidate
    const { data, error } = await supabase
      .from('assessment_candidates')
      .insert([
        {
          first_name: 'Test',
          last_name: 'Candidate Fresh 003',
          enrollment_id: 'TEST-FRESH-003',
          email: 'testfresh003@example.com',
          password: 'password123',
          status: 'active',
        },
      ])
      .select();

    if (error) {
      console.error('Error creating candidate:', error);
      return;
    }

    console.log('✅ Test candidate created successfully:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestCandidate();
