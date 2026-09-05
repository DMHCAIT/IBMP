import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrationViaPSQL() {
  try {
    console.log('Attempting to run migration via psql...\n');
    
    const migrationPath = path.join(__dirname, 'migrations/005_add_question_data_and_parts.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // DATABASE_URL from .env.local
    const databaseUrl = 'postgresql://postgres.nfpvilygpjosfujdpcdg:Dmhcawebsite123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres';
    
    // Write SQL to a temporary file
    const tempSqlFile = path.join(__dirname, 'temp_migration.sql');
    fs.writeFileSync(tempSqlFile, migrationSQL);
    
    console.log('Running migration...\n');
    
    try {
      // Try to execute using psql if available
      const command = `psql "${databaseUrl}" -f "${tempSqlFile}"`;
      console.log('Executing:', command);
      
      const output = execSync(command, { encoding: 'utf-8' });
      console.log('\n✅ Migration executed successfully!\n');
      console.log(output);
      
      // Clean up temp file
      fs.unlinkSync(tempSqlFile);
      
    } catch (psqlError) {
      console.log('⚠️  psql not installed or not in PATH');
      console.log('Trying alternative method...\n');
      
      // Try with node-postgres if available
      console.log('Please execute the following SQL in Supabase SQL Editor:');
      console.log('='.repeat(60));
      console.log(migrationSQL);
      console.log('='.repeat(60));
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runMigrationViaPSQL();
