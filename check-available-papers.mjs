#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

(async () => {
  try {
    const { data: papers, error } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug, is_active')
      .order('name');

    if (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }

    console.log('\n📋 Available Assessment Papers:\n');
    if (papers && papers.length > 0) {
      papers.forEach(p => {
        console.log(`  • ${p.name}`);
        console.log(`    Slug: ${p.slug}`);
        console.log(`    URL: /assessment-${p.slug}`);
        console.log(`    Active: ${p.is_active ? '✅' : '❌'}\n`);
      });
    } else {
      console.log('  (No papers found)\n');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
