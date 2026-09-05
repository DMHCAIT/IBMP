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

async function populateQuestionData() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('📋 Populating question_data with parts for Q41-Q60...\n');

    // Load seed data to get parts array
    const seedPath = path.join(__dirname, 'public', 'exam.seed.json');
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    const seedQuestionsMap = {};
    seedData.questions.forEach(q => {
      seedQuestionsMap[q.id] = q;
    });

    // Get all image and short questions (Q41-Q60)
    const result = await client.query(
      'SELECT id, question_number, type, stem, marks, options, correct_answer FROM assessment_questions WHERE question_number >= $1 ORDER BY sort_order ASC',
      ['Q41']
    );

    let updated = 0;

    for (const q of result.rows) {
      const seedQ = seedQuestionsMap[q.question_number];
      if (!seedQ) {
        console.warn(`⚠️  ${q.question_number}: Not found in seed data`);
        continue;
      }

      // Build question_data object
      let questionData = {
        id: q.question_number,
        number: parseInt(q.question_number.replace(/\D/g, '')),
        type: q.type,
        stem: q.stem,
        maxUnits: q.marks,
      };

      // Add image URL if present
      if (seedQ.asset) {
        questionData.asset = seedQ.asset;
      }

      // Add parts array if present (for image and short questions)
      if (seedQ.parts && Array.isArray(seedQ.parts)) {
        questionData.parts = seedQ.parts.map(part => ({
          id: part.id,
          prompt: part.prompt
        }));
      }

      // Add scoring rubric
      if (seedQ.scoring) {
        questionData.scoring = {
          rubric: seedQ.scoring.rubric.map(r => ({
            partId: r.partId,
            maxUnits: r.maxUnits,
            answer: r.answer
          }))
        };
      }

      // Update database
      const updateResult = await client.query(
        'UPDATE assessment_questions SET question_data = $1 WHERE id = $2',
        [JSON.stringify(questionData), q.id]
      );

      if (updateResult.rowCount > 0) {
        console.log(`✅ ${q.question_number}: Updated with parts`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} questions with parts array`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populateQuestionData();
