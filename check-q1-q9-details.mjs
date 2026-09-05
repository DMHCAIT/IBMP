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
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

async function checkQuestionDetails() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    console.log('📊 Checking Q1-Q9 in database:\n');
    
    for (let i = 1; i <= 9; i++) {
      const qNum = `Q${String(i).padStart(2, '0')}`;
      const result = await client.query(
        'SELECT question_number, type, stem, marks, options, correct_answer FROM assessment_questions WHERE question_number = $1',
        [qNum]
      );
      
      if (result.rows.length > 0) {
        const q = result.rows[0];
        console.log(`\n${qNum}:`);
        console.log(`  Type: ${q.type}`);
        console.log(`  Marks: ${q.marks}`);
        console.log(`  Stem: ${q.stem.substring(0, 60)}...`);
        console.log(`  Correct Answer: ${q.correct_answer || '(none)'}`);
        
        if (q.options) {
          try {
            const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            console.log(`  Options: ${Array.isArray(opts) ? opts.length : 'N/A'} items`);
            if (Array.isArray(opts)) {
              opts.forEach((opt, idx) => {
                const optText = typeof opt === 'string' ? opt : (opt.text || opt);
                console.log(`    ${String.fromCharCode(65 + idx)}: ${optText}`);
              });
            }
          } catch (e) {
            console.log(`  Options: ${q.options}`);
          }
        } else {
          console.log(`  Options: (empty)`);
        }
      }
    }

    // Check total marks
    console.log('\n\n📊 Marks Summary:');
    const marksResult = await client.query(
      'SELECT question_number, marks FROM assessment_questions ORDER BY sort_order ASC'
    );
    
    let totalMarks = 0;
    let mcqMarks = 0;
    marksResult.rows.forEach(row => {
      totalMarks += row.marks;
      const qNum = parseInt(row.question_number.replace(/\D/g, ''));
      if (qNum <= 40) mcqMarks += row.marks;
    });
    
    console.log(`Total Marks in Database: ${totalMarks}`);
    console.log(`MCQ Marks (Q1-Q40): ${mcqMarks}`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkQuestionDetails();
