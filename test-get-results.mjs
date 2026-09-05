#!/usr/bin/env node

/**
 * Test Assessment API - Get results/attempts
 */

import http from 'http';

console.log('\n🧪 Testing Assessment API - Get Results/Attempts\n');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/assessment/results',
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
        console.log(`\n🎉 Retrieved ${parsed.length} attempt(s)`);
      } else if (parsed.success || parsed.attempts) {
        const attempts = parsed.attempts || [];
        console.log(`\n🎉 Retrieved ${attempts.length} attempt(s)`);
        attempts.forEach((a, i) => {
          const candidateName = a.candidate?.full_name || a.full_name || 'Unknown';
          console.log(`  [${i + 1}] ${candidateName} - Status: ${a.status}, Score: ${a.total_score || 'N/A'}`);
        });
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
