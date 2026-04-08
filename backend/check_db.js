const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function check_everything() {
  const p = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system'
  });

  console.log('--- ALL PRODUCTS ---');
  const [prods] = await p.query('SELECT product_id, item_name, serial_number, office_id FROM products LIMIT 5');
  console.log(prods);

  console.log('--- ALL OFFICES ---');
  const [offices] = await p.query('SELECT office_id, office_name FROM offices');
  console.log(offices);

  console.log('--- DUPLICATE SN in TRANSACTIONS? ---');
  const [dupes] = await p.query('SELECT serial_number, COUNT(*) FROM transactions GROUP BY serial_number HAVING COUNT(*) > 1');
  console.log(dupes);

  console.log('--- LATEST TRANSACTIONS ---');
  const [txs] = await p.query('SELECT * FROM transactions ORDER BY transaction_id DESC LIMIT 5');
  console.log(txs);

  process.exit();
}

check_everything().catch(console.error);
