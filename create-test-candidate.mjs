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

async function createTestCandidate() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    const fullName = 'Test Candidate 2';
    const enrollmentId = 'TEST-FRESH-002';
    const password = 'TestFresh@234';

    console.log('📝 Creating new test candidate...\n');
    
    const result = await client.query(
      'INSERT INTO assessment_candidates (full_name, enrollment_id, password, email, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, enrollment_id',
      [fullName, enrollmentId, password, `${enrollmentId}@test.com`, 'active']
    );
    
    if (result.rows.length > 0) {
      const candidate = result.rows[0];
      console.log('✅ Candidate created successfully!');
      console.log('');
      console.log('Login credentials:');
      console.log(`Full Name: ${fullName}`);
      console.log(`Enrollment ID: ${enrollmentId}`);
      console.log(`Password: ${password}`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestCandidate();
