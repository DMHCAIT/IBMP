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

async function checkQuestionData() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log('📊 Checking question_data for Q1-Q9:\n');
    
    for (let i = 1; i <= 9; i++) {
      const qNum = `Q${String(i).padStart(2, '0')}`;
      const result = await client.query(
        'SELECT question_number, question_data FROM assessment_questions WHERE question_number = $1',
        [qNum]
      );
      
      if (result.rows.length > 0) {
        const q = result.rows[0];
        if (q.question_data) {
          console.log(`✅ ${qNum}: question_data EXISTS`);
        } else {
          console.log(`❌ ${qNum}: question_data IS NULL`);
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

checkQuestionData();
