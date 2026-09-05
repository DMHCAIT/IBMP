#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not set in .env.local');
  process.exit(1);
}

async function runSqlFile() {
  return new Promise((resolve, reject) => {
    const sqlFile = path.join(__dirname, 'migrations/006_create_assessment_config_table.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Use psql to execute SQL
    const psql = spawn('psql', [databaseUrl, '-f', sqlFile], {
      stdio: 'pipe',
      shell: true,
    });

    let stdout = '';
    let stderr = '';

    psql.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    psql.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    psql.on('close', (code) => {
      if (code === 0) {
        console.log('✅ assessment_config table created successfully!');
        console.log(stdout);
        resolve(true);
      } else {
        console.error('❌ Failed to create table');
        console.error(stderr);
        reject(new Error(stderr));
      }
    });

    psql.on('error', (err) => {
      console.error('❌ Error:', err.message);
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('📋 Setting up assessment_config table...');
    console.log('🔗 Database:', databaseUrl.split('@')[1]);
    
    await runSqlFile();
  } catch (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
}

main();
