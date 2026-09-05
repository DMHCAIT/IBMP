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

async function checkQ45() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log('📊 Checking Q45:\n');
    
    const result = await client.query(
      'SELECT marks, question_data FROM assessment_questions WHERE question_number = $1',
      ['Q45']
    );
    
    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log(`Marks field: ${row.marks}`);
      console.log(`\nQuestion Data:`);
      if (row.question_data) {
        console.log(JSON.stringify(row.question_data, null, 2));
      } else {
        console.log('(null)');
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkQ45();
