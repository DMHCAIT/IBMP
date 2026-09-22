#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function checkDatabase() {
  console.log('\n🔍 Checking Database...\n');

  try {
    // Test 1: Check if table exists
    console.log('1️⃣  Checking if assessment_exam_papers table exists...');
    const { data: tableData, error: tableError } = await supabase
      .from('assessment_exam_papers')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('   ❌ Table check failed:', tableError.message);
      console.log('   Error details:', tableError);
    } else {
      console.log('   ✅ Table exists');
      console.log('   📊 Current records:', Array.isArray(tableData) ? tableData.length : 0);
    }

    // Test 2: Try to insert a test paper
    console.log('\n2️⃣  Testing INSERT operation...');
    const testPaper = {
      name: 'Test Paper ' + Date.now(),
      slug: 'test-paper-' + Date.now(),
      description: 'This is a test paper',
      duration_minutes: 120,
      total_questions: 60,
      total_marks: 80,
      passing_marks: 50,
      passing_percentage: 62.5,
      exam_type: 'Standard',
      max_attempts: 1,
      is_active: true,
    };

    const { data: insertData, error: insertError } = await supabase
      .from('assessment_exam_papers')
      .insert(testPaper)
      .select();

    if (insertError) {
      console.log('   ❌ INSERT failed:', insertError.message);
      console.log('   Error code:', insertError.code);
      console.log('   Full error:', JSON.stringify(insertError, null, 2));
    } else {
      console.log('   ✅ INSERT successful');
      console.log('   Created paper:', insertData?.[0]?.id);

      // Clean up: Delete the test paper
      if (insertData?.[0]?.id) {
        await supabase
          .from('assessment_exam_papers')
          .delete()
          .eq('id', insertData[0].id);
        console.log('   🧹 Cleaned up test data');
      }
    }

    // Test 3: Check other tables
    console.log('\n3️⃣  Checking other tables...');
    const tables = [
      'assessment_candidates',
      'assessment_questions',
      'assessment_attempts',
      'assessment_results'
    ];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: ${count} records`);
        }
      } catch (e) {
        console.log(`   ❌ ${table}: Error - ${e.message}`);
      }
    }

    console.log('\n✅ Database check complete!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
