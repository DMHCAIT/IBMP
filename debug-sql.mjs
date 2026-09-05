#!/usr/bin/env node

/**
 * Debug: Run SQL statements one at a time with full error output
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

async function main() {
  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('\n🔍 Debug: Running SQL statements with full error output\n');

    // Read SQL file
    const sqlPath = resolve(__dirname, 'ASSESSMENT_SQL_MIGRATION.sql');
    let sql = readFileSync(sqlPath, 'utf-8');

    // Split into statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Total statements parsed: ${statements.length}\n`);
    
    // Log first 10 statements to see what we have
    console.log('First 10 statements:');
    statements.slice(0, 10).forEach((s, i) => {
      const type = s.split(/\s+/)[0];
      const tableName = s.match(/FROM\s+(\w+)|TABLE\s+IF\s+NOT\s+EXISTS\s+(\w+)|TABLE\s+(\w+)/)?.[1] || s.match(/(\w+)/)?.[1] || 'unknown';
      const preview = s.substring(0, 50).replace(/\n/g, ' ');
      console.log(`  [${i + 1}] ${type} (table: ${tableName}): ${preview}...`);
    });
    console.log();

    // List all statements that mention "assessment"
    console.log('Statements mentioning "assessment":');
    statements.forEach((s, i) => {
      if (s.includes('assessment')) {
        const type = s.split(/\s+/)[0];
        const preview = s.substring(0, 80).replace(/\n/g, ' ');
        console.log(`  [${i + 1}] ${type}: ${preview}...`);
      }
    });
    console.log();

    // Run only the CREATE TABLE statements
    const createTableStatements = statements.filter(s => s.startsWith('CREATE TABLE'));

    console.log(`📋 Found ${createTableStatements.length} CREATE TABLE statements\n`);

    for (let i = 0; i < createTableStatements.length; i++) {
      const statement = createTableStatements[i];
      const tableName = statement.match(/CREATE TABLE.*?(\w+)\s*\(/i)?.[1];
      
      console.log(`[${i + 1}/${createTableStatements.length}] ${tableName}`);
      console.log('SQL:', statement.substring(0, 80) + '...\n');

      try {
        const result = await client.query(statement);
        console.log(`  ✅ Success\n`);
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}\n`);
        console.log(`  Full error:\n${error.detail || error.stack}\n`);
      }
    }

    await client.end();

  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
}

main();
