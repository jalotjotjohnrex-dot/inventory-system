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
    console.log('Creating notifications table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        office_id INT,
        transaction_id INT,
        message VARCHAR(255),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (office_id) REFERENCES offices(office_id),
        FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Notifications table created successfully.');
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    await pool.end();
  }
}

main();
