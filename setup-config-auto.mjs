#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Import pg after env is loaded
import pg from 'pg';

const { Client } = pg;
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not set in .env.local');
  process.exit(1);
}

async function setupTable() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('📋 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    console.log('📋 Creating assessment_config table...');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS assessment_config (
        id TEXT PRIMARY KEY DEFAULT 'default',
        duration_minutes INT NOT NULL DEFAULT 120,
        total_marks NUMERIC NOT NULL DEFAULT 80,
        passing_marks NUMERIC NOT NULL DEFAULT 50,
        passing_percentage NUMERIC NOT NULL DEFAULT 62.5,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Table created');

    // Enable RLS
    console.log('📋 Setting up RLS policies...');
    await client.query('ALTER TABLE assessment_config ENABLE ROW LEVEL SECURITY;');

    // Drop existing policies if they exist
    await client.query(`
      DROP POLICY IF EXISTS "Admins can read assessment config" ON assessment_config;
      DROP POLICY IF EXISTS "Admins can update assessment config" ON assessment_config;
      DROP POLICY IF EXISTS "Service role can manage config" ON assessment_config;
    `);

    // Create policies
    await client.query(`
      CREATE POLICY "Admins can read assessment config" 
        ON assessment_config 
        FOR SELECT 
        USING (true);
    `);

    await client.query(`
      CREATE POLICY "Admins can update assessment config" 
        ON assessment_config 
        FOR UPDATE 
        USING (true);
    `);

    console.log('✅ RLS policies created');

    // Create index
    console.log('📋 Creating index...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_assessment_config_id ON assessment_config(id);');
    console.log('✅ Index created');

    // Insert or update default config
    console.log('📋 Inserting default configuration...');
    await client.query(`
      INSERT INTO assessment_config (id, duration_minutes, total_marks, passing_marks, passing_percentage, description)
      VALUES ('default', 120, 80, 50, 62.5, 'Pain Medicine specialization assessment')
      ON CONFLICT (id) DO UPDATE SET 
        duration_minutes = 120,
        total_marks = 80,
        passing_marks = 50,
        passing_percentage = 62.5,
        description = 'Pain Medicine specialization assessment',
        updated_at = NOW();
    `);

    // Verify
    const result = await client.query('SELECT * FROM assessment_config WHERE id = $1;', ['default']);
    
    if (result.rows.length > 0) {
      const config = result.rows[0];
      console.log('\n✅ Setup complete! Current config:');
      console.log('   Duration:', config.duration_minutes, 'minutes');
      console.log('   Total Marks:', config.total_marks);
      console.log('   Passing Marks:', config.passing_marks);
      console.log('   Passing %:', config.passing_percentage + '%');
      console.log('   Description:', config.description);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupTable();
