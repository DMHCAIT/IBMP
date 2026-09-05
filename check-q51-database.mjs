import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfpvilygpjosfujdpcdg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8'
);

async function checkQ51() {
  try {
    console.log('Fetching Q51 from database...\n');
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('question_number', 'Q51');

    if (error) {
      console.error('Error fetching Q51:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Q51 not found in database');
      return;
    }

    const q51 = data[0];
    console.log('Q51 Database Record:');
    console.log('='.repeat(60));
    console.log(`Question Number: ${q51.question_number}`);
    console.log(`Type: ${q51.type}`);
    console.log(`Stem: ${q51.stem}`);
    console.log(`Marks: ${q51.marks}`);
    
    console.log('\nExpected Answer from question_data:');
    console.log('='.repeat(60));
    
    if (q51.question_data && q51.question_data.scoring?.rubric?.[0]?.answer) {
      console.log('✅ Expected Answer:');
      console.log(q51.question_data.scoring.rubric[0].answer);
      console.log('\n✅ Max Units:', q51.question_data.scoring.rubric[0].maxUnits);
    } else {
      console.log('❌ No expected answer found in question_data');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkQ51();
