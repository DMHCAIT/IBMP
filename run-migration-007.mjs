#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').trim();
      if (key.trim()) {
        process.env[key.trim()] = value;
      }
    }
  });
}

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not set in .env.local');
  process.exit(1);
}

async function runMigration() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('📋 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    console.log('📋 Running migration 007: Add exam_type to assessment_config...');

    // Add exam_type and exam_title columns
    await client.query(`
      ALTER TABLE assessment_config ADD COLUMN IF NOT EXISTS exam_type TEXT DEFAULT 'Pain Medicine';
      ALTER TABLE assessment_config ADD COLUMN IF NOT EXISTS exam_title TEXT DEFAULT 'Pain Medicine (Set A)';
    `);

    console.log('✅ Columns added');

    // Update default record
    console.log('📋 Updating default configuration...');
    await client.query(`
      UPDATE assessment_config 
      SET 
        exam_type = 'Pain Medicine',
        exam_title = 'Pain Medicine (Set A)',
        updated_at = NOW()
      WHERE id = 'default';
    `);

    // Verify
    const result = await client.query('SELECT * FROM assessment_config WHERE id = $1;', ['default']);
    
    if (result.rows.length > 0) {
      const config = result.rows[0];
      console.log('\n✅ Migration complete! Updated config:');
      console.log('   Exam Type:', config.exam_type);
      console.log('   Exam Title:', config.exam_title);
      console.log('   Duration:', config.duration_minutes, 'minutes');
      console.log('   Total Marks:', config.total_marks);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
