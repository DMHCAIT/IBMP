import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://nfpvilygpjosfujdpcdg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8'
);

async function checkQ41() {
  try {
    console.log('Fetching Q41 from database...\n');
    
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('question_number', 'Q41');

    if (error) {
      console.error('Error fetching Q41:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Q41 not found in database');
      return;
    }

    const q41 = data[0];
    console.log('Q41 Database Record:');
    console.log('='.repeat(60));
    console.log(`ID: ${q41.id}`);
    console.log(`Question Number: ${q41.question_number}`);
    console.log(`Type: ${q41.type}`);
    console.log(`Marks: ${q41.marks}`);
    console.log(`Module: ${q41.module}`);
    console.log(`Stem: ${q41.stem}`);
    console.log('\nquestion_data column:');
    console.log('='.repeat(60));
    
    if (q41.question_data) {
      console.log('✅ question_data EXISTS:');
      console.log(JSON.stringify(q41.question_data, null, 2));
      
      if (q41.question_data.parts) {
        console.log('\n✅ Parts found:', q41.question_data.parts.length, 'parts');
      } else {
        console.log('\n❌ NO PARTS in question_data');
      }
      
      if (q41.question_data.scoring?.rubric) {
        console.log('✅ Rubric found:', q41.question_data.scoring.rubric.length, 'rubric items');
      } else {
        console.log('❌ NO RUBRIC in question_data');
      }
    } else {
      console.log('❌ question_data is NULL or empty');
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkQ41();
