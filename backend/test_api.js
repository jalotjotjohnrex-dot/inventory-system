const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function test_query() {
  const p = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system'
  });

  const serial_number = "m15";
  const product_name = "Screw Driver";

  console.log(`Testing query with SN="${serial_number}", Name="${product_name}"`);
  
  const [rows] = await p.query(
    'SELECT product_id, office_id FROM products WHERE LOWER(TRIM(serial_number)) = LOWER(TRIM(?)) AND LOWER(TRIM(item_name)) = LOWER(TRIM(?))', 
    [serial_number, product_name]
  );

  console.log("Found rows:", rows);
  process.exit();
}

test_query().catch(console.error);
