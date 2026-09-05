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

async function checkScore() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log('📊 Checking TEST-FRESH-002 attempt score:\n');
    
    const result = await client.query(
      'SELECT aa.id, aa.total_score, aa.submitted_at FROM assessment_attempts aa JOIN assessment_candidates ac ON aa.candidate_id = ac.id WHERE ac.enrollment_id = $1 ORDER BY aa.created_at DESC LIMIT 1',
      ['TEST-FRESH-002']
    );
    
    if (result.rows.length > 0) {
      const attempt = result.rows[0];
      console.log(`Attempt ID: ${attempt.id}`);
      console.log(`Total Score: ${attempt.total_score}`);
      console.log(`Submitted At: ${attempt.submitted_at}`);
      
      // Get all responses for this attempt
      const respResult = await client.query(
        'SELECT question_id, marks_obtained, max_marks FROM assessment_responses WHERE attempt_id = $1 ORDER BY question_id',
        [attempt.id]
      );
      
      console.log(`\nResponses (${respResult.rows.length} total):`);
      let totalMarks = 0;
      respResult.rows.forEach(resp => {
        totalMarks += resp.marks_obtained;
        console.log(`  ${resp.question_id}: ${resp.marks_obtained}/${resp.max_marks}`);
      });
      
      console.log(`\nCalculated Total: ${totalMarks}`);
    } else {
      console.log('No attempts found for TEST-FRESH-002');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkScore();
