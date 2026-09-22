#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyImageStorage() {
  console.log('🔍 Verifying Database Image Storage Setup...\n');

  try {
    // 1. Check if columns exist
    console.log('1️⃣  Checking database schema...');
    const { data: schemaInfo, error: schemaError } = await supabase
      .from('assessment_question_images')
      .select('*')
      .limit(1);

    if (schemaError && schemaError.code === 'PGRST116') {
      console.log('❌ assessment_question_images table not found');
      return;
    }

    // Get the first image to check if columns exist
    const testImage = schemaInfo?.[0];
    if (testImage && 'image_data_base64' in testImage) {
      console.log('✅ image_data_base64 column exists');
    } else {
      console.log('⚠️  image_data_base64 column not found (need to run migration)');
    }

    // 2. Count total images
    console.log('\n2️⃣  Counting images in database...');
    const { count: totalImages, error: countError } = await supabase
      .from('assessment_question_images')
      .select('*', { count: 'exact' });

    if (!countError) {
      console.log(`✅ Total images in database: ${totalImages}`);
    }

    // 3. Check images with base64 data
    console.log('\n3️⃣  Checking images with stored data...');
    const { data: imagesWithData, error: dataError } = await supabase
      .from('assessment_question_images')
      .select('id, image_title, mime_type, file_size, image_data_base64')
      .not('image_data_base64', 'is', null);

    if (!dataError) {
      console.log(`✅ Images with base64 data: ${imagesWithData?.length || 0}`);
      
      if (imagesWithData && imagesWithData.length > 0) {
        console.log('\n   Sample images:');
        imagesWithData.slice(0, 3).forEach((img: any) => {
          const dataSize = img.image_data_base64?.length || 0;
          console.log(`   - ${img.image_title} (${img.mime_type}) - ${dataSize} bytes`);
        });
      }
    }

    // 4. Check API endpoints
    console.log('\n4️⃣  Testing API endpoints...');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const imagesResponse = await fetch(`${apiUrl}/api/admin/assessment/questions/images-data?format=base64`);
      
      if (imagesResponse.ok) {
        const images = await imagesResponse.json();
        console.log(`✅ API endpoint working - returned ${images.length} images`);
        
        if (images.length > 0 && images[0].dataUri) {
          console.log(`✅ Images have dataUri property (base64 embedded)`);
        }
      } else {
        console.log(`⚠️  API endpoint returned status ${imagesResponse.status}`);
      }
    } catch (apiErr) {
      console.log(`⚠️  Could not test API (server may not be running): ${apiErr}`);
    }

    // 5. Summary
    console.log('\n📊 Summary:');
    console.log('━'.repeat(50));
    
    if (imagesWithData && imagesWithData.length === totalImages && totalImages > 0) {
      console.log('✅ All images stored in database with base64 data');
      console.log('✅ Database image storage is fully configured');
      console.log('\nNext step: Test assessment page at http://localhost:3000/assessment');
    } else if (imagesWithData && imagesWithData.length > 0) {
      console.log(`⚠️  Only ${imagesWithData.length} of ${totalImages} images have base64 data`);
      console.log('   Run: node upload-question-images.mjs');
    } else {
      console.log('❌ No images with base64 data found');
      console.log('   Steps to fix:');
      console.log('   1. Apply migration: migrations/006_add_image_data_column.sql');
      console.log('   2. Run: node upload-question-images.mjs');
    }

    console.log('━'.repeat(50));

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

verifyImageStorage();
