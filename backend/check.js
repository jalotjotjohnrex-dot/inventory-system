require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function migrate() {
  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '12345678',
      database: process.env.DB_NAME || 'inventory_system',
    });

    const [p] = await db.query('DESCRIBE products');
    console.log('PRODUCTS TABLE:');
    console.table(p);

    const [t] = await db.query('DESCRIBE transactions');
    console.log('TRANSACTIONS TABLE:');
    console.table(t);

    await db.end();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
