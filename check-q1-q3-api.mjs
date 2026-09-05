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

async function checkQ1Q9API() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log('📊 Checking Q01-Q03 as returned by API:\n');
    
    for (let i = 1; i <= 3; i++) {
      const qNum = `Q${String(i).padStart(2, '0')}`;
      const result = await client.query(
        'SELECT * FROM assessment_questions WHERE question_number = $1',
        [qNum]
      );
      
      if (result.rows.length > 0) {
        const q = result.rows[0];
        console.log(`\n${qNum}:`);
        console.log(`  question_data exists: ${q.question_data ? '✅ YES' : '❌ NO'}`);
        if (q.question_data) {
          console.log(`  question_data.options: ${q.question_data.options ? `✅ YES (${q.question_data.options.length} items)` : '❌ NO'}`);
          if (q.question_data.options) {
            q.question_data.options.forEach((opt, idx) => {
              const text = typeof opt === 'string' ? opt : (opt.text || opt.label || opt);
              console.log(`    ${String.fromCharCode(65 + idx)}: ${text}`);
            });
          }
        }
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkQ1Q9API();
