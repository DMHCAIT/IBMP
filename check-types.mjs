import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfpvilygpjosfujdpcdg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8'
);

async function checkTypes() {
  const { data, error } = await supabase
    .from('assessment_questions')
    .select('question_number, type')
    .in('question_number', ['Q51', 'Q52', 'Q60']);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Types in Database:');
  data.forEach(q => {
    console.log(`${q.question_number}: type="${q.type}"`);
  });
}

checkTypes();
