import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://postgres.nfpvilygpjosfujdpcdg:Dmhcawebsite123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, 'migrations/005_add_question_data_and_parts.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('Executing migration...\n');
    console.log('='.repeat(60));
    
    await client.query(migrationSQL);
    
    console.log('='.repeat(60));
    console.log('\n✅ Migration executed successfully!\n');

    // Verify the column was added
    console.log('Verifying question_data column...');
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'assessment_questions' 
      AND column_name = 'question_data'
    `);

    if (result.rows.length > 0) {
      console.log(`✅ Column confirmed: ${result.rows[0].column_name} (${result.rows[0].data_type})`);
    } else {
      console.log('❌ Column not found after migration');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === '42701') {
      console.log('ℹ️  Column already exists - that\'s ok!');
    }
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

runMigration();
