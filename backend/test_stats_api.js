const http = require('http');

const offices = ['SB Leg', 'SB Sec', "Mayor's", "Vice Mayor's", 'ICTS'];

async function testStatsAPI() {
  for (const office of offices) {
    const encoded = encodeURIComponent(office);
    const url = `http://localhost:3000/api/stats?office=${encoded}`;
    
    await new Promise((resolve) => {
      http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          console.log(`Office: ${office} | Stats Status: ${res.statusCode} | Data: ${data}`);
          resolve();
        });
      }).on('error', (err) => {
        console.log(`Office: ${office} | Stats Error: ${err.message}`);
        resolve();
      });
    });
  }
}

testStatsAPI();
