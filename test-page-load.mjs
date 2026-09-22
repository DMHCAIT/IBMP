#!/usr/bin/env node

import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/assessment-arthroscopy-and-arthroplasty',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`\nPage Response Status: ${res.statusCode}\n`);
  
  if (res.statusCode === 200) {
    console.log('✅ SUCCESS! Page is loading.');
  } else {
    console.log(`❌ Error: ${res.statusCode}`);
  }
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();
