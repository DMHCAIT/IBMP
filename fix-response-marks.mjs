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

async function fixResponses() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('🔧 Fixing assessment responses...\n');

    // Fix MCQ responses (Q01-Q40): should be max_marks=1
    console.log('Fixing MCQ responses (Q01-Q40)...');
    let mcqResult = await client.query(
      `UPDATE assessment_responses 
       SET max_marks = 1
       WHERE question_id ~ '^Q[0-3][0-9]$' AND max_marks != 1`
    );
    console.log(`✅ Updated ${mcqResult.rowCount} MCQ responses`);

    // Fix Image responses (Q41-Q50): each part should be max_marks=1
    console.log('\nFixing Image part responses (Q41-Q50)...');
    let imgResult = await client.query(
      `UPDATE assessment_responses 
       SET max_marks = 1
       WHERE question_id ~ '^Q(4[1-9]|50)\.[a-c]$' AND max_marks != 1`
    );
    console.log(`✅ Updated ${imgResult.rowCount} image part responses`);

    // Fix Short answer responses (Q51-Q60): should be max_marks=1
    console.log('\nFixing Short answer responses (Q51-Q60)...');
    let shortResult = await client.query(
      `UPDATE assessment_responses 
       SET max_marks = 1
       WHERE question_id ~ '^Q(5[0-9]|60)$' AND max_marks != 1`
    );
    console.log(`✅ Updated ${shortResult.rowCount} short answer responses`);

    // Recalculate all attempt total_score
    console.log('\nRecalculating attempt total_score...');
    const attResult = await client.query(
      `SELECT DISTINCT attempt_id FROM assessment_responses`
    );

    let recalcCount = 0;
    for (const row of attResult.rows) {
      const attemptId = row.attempt_id;
      
      // Sum marks for this attempt
      const sumResult = await client.query(
        `SELECT SUM(marks_obtained) as total FROM assessment_responses WHERE attempt_id = $1`,
        [attemptId]
      );
      
      const newTotal = sumResult.rows[0]?.total || 0;
      
      await client.query(
        `UPDATE assessment_attempts SET total_score = $1 WHERE id = $2`,
        [newTotal, attemptId]
      );
      recalcCount++;
    }
    console.log(`✅ Recalculated ${recalcCount} attempts`);

    console.log('\n✅ All fixes complete!');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixResponses();
