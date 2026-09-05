#!/usr/bin/env node

/**
 * Test Assessment API - Get candidates list
 */

import http from 'http';

console.log('\n🧪 Testing Assessment API - Get Candidates List\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/assessment/candidates',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📊 Response Status:', res.statusCode);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n✅ Response:');
      console.log(JSON.stringify(parsed, null, 2));
      
      if (Array.isArray(parsed)) {
        console.log(`\n🎉 Retrieved ${parsed.length} candidate(s)`);
        parsed.forEach((c, i) => {
          console.log(`  [${i + 1}] ${c.full_name} (${c.enrollment_id})`);
        });
      } else if (parsed.success || parsed.candidates) {
        console.log(`\n🎉 Retrieved candidates successfully`);
      }
    } catch (e) {
      console.log('\n❌ Parse error:', e.message);
      console.log('Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.end();
