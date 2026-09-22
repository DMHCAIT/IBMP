#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from "@supabase/supabase-js";
import path from 'path';

// Read .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envLines = envContent.split('\n');
const env = {};

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials");
  console.log("URL:", supabaseUrl ? "✓" : "✗");
  console.log("Key:", supabaseKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function main() {
  console.log("🔍 Checking assessment papers...\n");
  
  try {
    // Get all papers
    const { data: papers, error } = await supabase
      .from('assessment_exam_papers')
      .select('id, name, slug, is_active, total_questions')
      .eq('is_active', true);
    
    if (error) {
      console.error("❌ Error fetching papers:", error.message);
      process.exit(1);
    }
    
    if (!papers || papers.length === 0) {
      console.log("⚠️  No active papers found in database");
      process.exit(1);
    }
    
    console.log(`✅ Found ${papers.length} active paper(s):\n`);
    
    papers.forEach(paper => {
      const url = `http://localhost:3000/assessment-${paper.slug}`;
      console.log(`📋 Paper: "${paper.name}"`);
      console.log(`   Slug: ${paper.slug}`);
      console.log(`   Questions: ${paper.total_questions || 0}`);
      console.log(`   URL: ${url}`);
      console.log("");
    });
    
    // Look for arthroscopy paper specifically
    const arthro = papers.find(p => p.name.toLowerCase().includes('arthroscopy'));
    if (arthro) {
      console.log(`🎯 Found Arthroscopy paper!`);
      console.log(`   Test URL: http://localhost:3000/assessment-${arthro.slug}`);
    } else {
      console.log("⚠️  Arthroscopy paper not found");
    }
    
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
