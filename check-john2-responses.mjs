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

async function checkResponses() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Get the latest attempt for john2
    const attResult = await client.query(
      `SELECT id, total_score FROM assessment_attempts 
       WHERE enrollment_id = 'IBMP-2026-12'
       ORDER BY created_at DESC 
       LIMIT 1`
    );
    
    if (attResult.rows.length === 0) {
      console.log('No attempts found for john2');
      return;
    }

    const attemptId = attResult.rows[0].id;
    const totalScore = attResult.rows[0].total_score;

    console.log(`📊 Attempt ID: ${attemptId}`);
    console.log(`Total Score in Attempt: ${totalScore}\n`);

    // Get all responses for this attempt
    const respResult = await client.query(
      `SELECT question_id, max_marks, marks_obtained FROM assessment_responses 
       WHERE attempt_id = $1
       ORDER BY question_id ASC`,
      [attemptId]
    );

    console.log(`Total Responses: ${respResult.rows.length}\n`);

    let totalMaxMarks = 0;
    let totalObtained = 0;

    respResult.rows.forEach(row => {
      totalMaxMarks += (row.max_marks || 0);
      totalObtained += (row.marks_obtained || 0);
      if (row.max_marks !== 1) {
        console.log(`⚠️  ${row.question_id}: max_marks=${row.max_marks}, obtained=${row.marks_obtained}`);
      }
    });

    console.log(`\nCalculated Total Max Marks: ${totalMaxMarks}`);
    console.log(`Calculated Total Obtained: ${totalObtained}`);
    console.log(`\nExpected Max Marks: 80`);
    console.log(`Difference: ${totalMaxMarks - 80}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkResponses();
