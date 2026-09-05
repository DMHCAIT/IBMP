#!/usr/bin/env node

/**
 * Test Assessment API - Verify candidate can start assessment
 */

import http from 'http';

const verifyData = {
  enrollmentId: 'TEST-001',
  password: 'TestPassword123@'
};

console.log('\n🧪 Testing Assessment API - Verify Candidate\n');
console.log('Request payload:', verifyData);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/assessment/verify-candidate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(verifyData).length
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📊 Response Status:', res.statusCode);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n✅ Response:');
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        console.log('\n🎉 Candidate verified! Can start assessment.');
        if (parsed.message && parsed.message.includes('already')) {
          console.log('⚠️  One-time attempt limit enforced - candidate already took assessment');
        }
      } else {
        console.log('\n❌ Error:', parsed.error);
      }
    } catch (e) {
      console.log('\n❌ Response (raw):', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
});

req.write(JSON.stringify(verifyData));
req.end();
