const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system'
  });

  console.log('--- PRODUCTS with SN m15 ---');
  const [products] = await pool.query('SELECT * FROM products WHERE serial_number = "m15"');
  console.log(JSON.stringify(products, null, 2));

  console.log('--- TRANSACTIONS with SN m15 ---');
  const [txs] = await pool.query('SELECT * FROM transactions WHERE serial_number = "m15"');
  console.log(JSON.stringify(txs, null, 2));

  process.exit();
}

check().catch(console.error);
