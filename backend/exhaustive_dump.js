const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function dump() {
  const p = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system'
  });

  const [t] = await p.query('SHOW TABLES');
  for (let row of t) {
    const table = Object.values(row)[0];
    console.log(`--- TABLE: ${table} ---`);
    const [cols] = await p.query(`SHOW COLUMNS FROM ${table}`);
    console.log(cols.map(c => c.Field).join(', '));
  }
  process.exit();
}

dump().catch(console.error);
