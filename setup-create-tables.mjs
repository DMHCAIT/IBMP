#!/usr/bin/env node

/**
 * Assessment Database Setup - Fixed SQL Execution
 * Properly handles multi-line SQL statements
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🚀 Assessment Database - Fixed Table Creation');
console.log('=' .repeat(55));
console.log();

// Read environment
const envPath = resolve(__dirname, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const DATABASE_URL = env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('✅ Found DATABASE_URL');
console.log('🔗 Connecting to Supabase PostgreSQL...\n');

async function main() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase\n');

    // Read SQL file
    const sqlPath = resolve(__dirname, 'ASSESSMENT_SQL_MIGRATION.sql');
    let sql = readFileSync(sqlPath, 'utf-8');

    // Split into statements and filter properly
    let statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Remove comment-only statements, but keep statements that have code
    statements = statements.map(s => {
      // Split by newlines and remove comment-only lines
      const lines = s.split('\n');
      let hasCode = false;
      const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('--')) {
          return false; // Skip pure comment lines
        }
        if (trimmed.length > 0) {
          hasCode = true;
        }
        return true;
      });
      
      return cleanedLines.join('\n').trim();
    }).filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Executing ${statements.length} SQL statements...\n`);

    let successCount = 0;
    let errorCount = 0;
    let ignoredCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Extract statement type for logging
      const type = statement.split(/\s+/)[0];
      
      try {
        await client.query(statement);
        successCount++;
        process.stdout.write(`  ✅ [${i + 1}/${statements.length}] ${type}\n`);
      } catch (error) {
        // Ignore "already exists" errors - these are expected on re-runs
        if (error.message.includes('already exists') || 
            error.message.includes('already defined') ||
            error.message.includes('does not exist')) {
          ignoredCount++;
          process.stdout.write(`  ℹ️  [${i + 1}/${statements.length}] ${type} (ignored)\n`);
        } else {
          errorCount++;
          console.log(`  ⚠️  [${i + 1}/${statements.length}] ${type} - ${error.message.split('\n')[0]}`);
        }
      }
    }

    console.log(`\n📊 Results: ${successCount} executed, ${ignoredCount} ignored, ${errorCount} errors\n`);

    // Verify tables
    console.log('🔍 Verifying tables...\n');

    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'assessment_%'
      ORDER BY table_name;
    `);

    const expectedTables = [
      'assessment_candidates',
      'assessment_attempts',
      'assessment_responses',
      'assessment_question_images',
      'assessment_settings'
    ];

    let tableCount = 0;
    expectedTables.forEach(table => {
      if (result.rows.some(r => r.table_name === table)) {
        console.log(`  ✅ ${table}`);
        tableCount++;
      } else {
        console.log(`  ❌ ${table} - NOT CREATED`);
      }
    });

    console.log(`\n  Created: ${tableCount}/${expectedTables.length} tables\n`);

    if (tableCount === expectedTables.length) {
      console.log('✨ All assessment database tables created successfully!\n');
      console.log('🎯 Next Steps:');
      console.log('  1. Go to: http://localhost:3000/admin/assessment/candidates');
      console.log('  2. Click "Add Candidate"');
      console.log('  3. Fill in test data and save');
      console.log('  4. Access assessment: http://localhost:3000/assessment\n');
    } else {
      console.log('⚠️  Some tables may not have been created. Check the Supabase dashboard.\n');
    }

    await client.end();

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
