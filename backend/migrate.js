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

    console.log('Connected to MySQL.');

    // 1. Add quantity to transactions
    try {
      await db.query('ALTER TABLE transactions ADD COLUMN quantity INT DEFAULT 1');
      console.log('Added quantity column to transactions.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('quantity column already exists in transactions.');
      } else {
        throw e;
      }
    }

    // 2. Create suppliers table
    await db.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_number VARCHAR(100),
        organization VARCHAR(255),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created suppliers table.');

    // Note: We might need to update a view if one exists.
    // Let's drop and recreate view_all_inventory if needed to include quantity
    try {
      await db.query(`
        CREATE OR REPLACE VIEW view_all_inventory AS
        SELECT t.*, o.office_name 
        FROM transactions t
        JOIN offices o ON t.office_id = o.office_id
      `);
      console.log('Updated view_all_inventory.');
    } catch (e) {
      console.log('Could not update view. Assuming view does not select * or similar.', e.message);
    }

    await db.end();
    console.log('Migration complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
