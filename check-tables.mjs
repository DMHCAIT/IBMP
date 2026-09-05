#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const DATABASE_URL = envContent.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=')[1];

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  console.log('\n📊 Existing Assessment Tables:\n');

  const result = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'assessment_%'
    ORDER BY table_name;
  `);

  if (result.rows.length === 0) {
    console.log('  ❌ No assessment tables found\n');
  } else {
    result.rows.forEach(row => console.log('  ✅', row.table_name));
    console.log(`\n  Total: ${result.rows.length} tables\n`);
  }

  await client.end();
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
