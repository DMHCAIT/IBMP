#!/usr/bin/env node

/**
 * Test Assessment API - Add test question
 */

import http from 'http';

const testQuestion = {
  title: 'Test Question - Pain Medicine',
  type: 'MCQ',
  marks: 1,
  module: 'Acute Pain Management',
  questionText: 'What is the first-line treatment for acute post-operative pain?',
  options: [
    { text: 'Opioids', isCorrect: false },
    { text: 'Multimodal analgesia', isCorrect: true },
    { text: 'NSAIDs only', isCorrect: false },
    { text: 'Paracetamol only', isCorrect: false }
  ],
  correctOption: 'Multimodal analgesia'
};

console.log('\n🧪 Testing Assessment API - Adding Test Question\n');
console.log('Request payload:', JSON.stringify(testQuestion, null, 2));

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/assessment/questions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': JSON.stringify(testQuestion).length
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
        console.log('\n🎉 Question created successfully!');
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

req.write(JSON.stringify(testQuestion));
req.end();
