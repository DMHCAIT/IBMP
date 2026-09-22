#!/usr/bin/env node

import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/assessment/arthroscopy-and-arthroplasty/questions',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`\nAPI Response Status: ${res.statusCode}\n`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Response:', JSON.stringify(parsed, null, 2).substring(0, 500));
    } catch (e) {
      console.log('Response (raw):', data.substring(0, 500));
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
