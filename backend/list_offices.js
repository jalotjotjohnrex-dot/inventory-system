const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system'
  });

  try {
    const [rows] = await pool.query('SELECT * FROM offices');
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
