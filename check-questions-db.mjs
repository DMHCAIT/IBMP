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

async function checkQuestions() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('📋 Connecting to database...');
    await client.connect();

    // Check Q1-Q9
    console.log('\n📊 Checking Q1-Q9:');
    for (let i = 1; i <= 9; i++) {
      const qNum = `Q${String(i).padStart(2, '0')}`;
      const result = await client.query(
        'SELECT id, question_number, type, stem, is_active FROM assessment_questions WHERE question_number = $1',
        [qNum]
      );
      
      if (result.rows.length > 0) {
        const q = result.rows[0];
        console.log(`✅ ${qNum}: Found (${q.type}, active=${q.is_active})`);
      } else {
        console.log(`❌ ${qNum}: NOT FOUND in database`);
      }
    }

    // Count total questions
    console.log('\n📊 Total questions in database:');
    const countResult = await client.query('SELECT COUNT(*) as count FROM assessment_questions');
    console.log(`Total: ${countResult.rows[0].count} questions`);

    // Check active status
    const activeResult = await client.query(
      'SELECT COUNT(*) as count FROM assessment_questions WHERE is_active = true'
    );
    console.log(`Active: ${activeResult.rows[0].count} questions`);

    // Show first 10 questions
    console.log('\n📋 First 10 questions:');
    const firstResult = await client.query(
      'SELECT question_number, type, is_active FROM assessment_questions ORDER BY sort_order ASC LIMIT 10'
    );
    firstResult.rows.forEach((row) => {
      console.log(`  ${row.question_number}: ${row.type} (active=${row.is_active})`);
    });

    // Set all questions as active
    console.log('\n🔄 Setting all questions as active...');
    await client.query('UPDATE assessment_questions SET is_active = true WHERE is_active = false');
    const updateResult = await client.query('SELECT COUNT(*) as count FROM assessment_questions WHERE is_active = true');
    console.log(`✅ Active questions updated: ${updateResult.rows[0].count}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkQuestions();
