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
    console.log('📋 Populating question_data for all questions...\n');

    // Get all questions
    const result = await client.query(
      'SELECT id, question_number, type, stem, marks, options, correct_answer FROM assessment_questions ORDER BY sort_order ASC'
    );

    let updated = 0;

    for (const q of result.rows) {
      // Parse options
      let options = [];
      if (q.options) {
        try {
          const parsed = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
          options = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.warn(`⚠️  Could not parse options for ${q.question_number}`);
          options = [];
        }
      }

      // Build question_data object
      let questionData = {
        id: q.question_number,
        number: parseInt(q.question_number.replace(/\D/g, '')),
        type: q.type,
        stem: q.stem,
        maxUnits: q.marks,
      };

      // Add type-specific fields
      if (q.type === 'mcq') {
        questionData.options = options;
        questionData.correctOptionId = options.findIndex(opt => 
          (typeof opt === 'string' ? opt : opt.text) === q.correct_answer
        ) >= 0 ? String.fromCharCode(65 + options.findIndex(opt => 
          (typeof opt === 'string' ? opt : opt.text) === q.correct_answer
        )) : null;
      } else if (q.type === 'image') {
        questionData.scoring = {
          rubric: [
            { partId: 'a', maxUnits: 1, answer: q.correct_answer },
            { partId: 'b', maxUnits: 1, answer: q.correct_answer },
            { partId: 'c', maxUnits: 1, answer: q.correct_answer }
          ]
        };
      } else if (q.type === 'short') {
        questionData.scoring = {
          rubric: [
            { partId: '1', maxUnits: 1, answer: q.correct_answer }
          ]
        };
      }

      // Update database
      const updateResult = await client.query(
        'UPDATE assessment_questions SET question_data = $1 WHERE id = $2',
        [JSON.stringify(questionData), q.id]
      );

      if (updateResult.rowCount > 0) {
        console.log(`✅ ${q.question_number}: Updated`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} questions with question_data`);

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populateQuestionData();
