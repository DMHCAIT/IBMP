#!/usr/bin/env node

/**
 * Test Assessment API - Add test candidate
 */

import http from 'http';

const testCandidate = {
  fullName: 'Dr. Test Candidate',
  enrollmentId: 'TEST-001',
  password: 'TestPassword123@',
  email: 'test@example.com',
  phone: '9876543210',
  examType: 'Pain Medicine'
};

console.log('\n🧪 Testing Assessment API - Adding Test Candidate\n');
console.log('Request payload:', testCandidate);

// Use the Supabase key from .env.local
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/assessment/candidates',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(testCandidate).length
  }
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n📊 Response Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    try {
      const parsed = JSON.parse(data);
      console.log('\n✅ Response:');
      console.log(JSON.stringify(parsed, null, 2));
      
      if (parsed.success) {
        console.log('\n🎉 Candidate created successfully!');
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

req.write(JSON.stringify(testCandidate));
req.end();
