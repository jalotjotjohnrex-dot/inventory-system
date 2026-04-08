const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function fixDB() {
  try {
    const p = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '12345678',
      database: process.env.DB_NAME || 'inventory_system'
    });
    
    console.log("Dropping unique index...");
    await p.query('ALTER TABLE transactions DROP INDEX serial_number');
    console.log("Successfully dropped unique index on transactions.serial_number");
  } catch(e) {
    console.log("Error or already dropped:", e.message);
  }
  process.exit();
}

fixDB();
