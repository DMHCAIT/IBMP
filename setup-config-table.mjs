#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('📋 Running assessment_config table setup...');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations/006_create_assessment_config_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Execute using Supabase admin API
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error && error.message.includes('function exec_sql')) {
      // If exec_sql doesn't exist, try direct execute via SQL
      console.log('ℹ️  Using direct SQL execution...');
      
      // Split by semicolons and execute each statement
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (!statement.trim()) continue;
        
        try {
          const { error: stmtError } = await supabase.rpc('sql_exec', { 
            sql_query: statement.trim() + ';' 
          });
          
          if (stmtError && !stmtError.message.includes('does not exist')) {
            console.warn('⚠️  Statement warning:', stmtError.message);
          }
        } catch (err) {
          // Continue on error
        }
      }
    } else if (error) {
      console.warn('⚠️  Migration note:', error.message);
    }

    // Verify the table was created by querying it
    const { data, error: verifyError } = await supabase
      .from('assessment_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (verifyError && !verifyError.message.includes('not found')) {
      console.error('❌ Error verifying table:', verifyError.message);
      process.exit(1);
    }

    if (data) {
      console.log('✅ assessment_config table ready!');
      console.log('📊 Default Config:', {
        duration_minutes: data.duration_minutes,
        total_marks: data.total_marks,
        passing_marks: data.passing_marks,
        passing_percentage: data.passing_percentage,
        description: data.description,
      });
    } else {
      // Table exists but no default record - insert it
      console.log('ℹ️  Creating default config...');
      const { error: insertError } = await supabase
        .from('assessment_config')
        .insert([
          {
            id: 'default',
            duration_minutes: 120,
            total_marks: 80,
            passing_marks: 50,
            passing_percentage: 62.5,
            description: 'Pain Medicine specialization assessment',
          },
        ]);

      if (insertError && !insertError.message.includes('duplicate')) {
        console.error('❌ Error inserting default config:', insertError.message);
        process.exit(1);
      }

      console.log('✅ Default config created!');
    }
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

runMigration();
