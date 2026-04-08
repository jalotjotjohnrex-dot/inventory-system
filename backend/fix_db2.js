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
    
    console.log("Adding property_number column...");
    await p.query('ALTER TABLE transactions ADD COLUMN property_number VARCHAR(100) DEFAULT NULL');
    console.log("Done adding column.");

    console.log("Recreating view...");
    await p.query('DROP VIEW IF EXISTS view_all_inventory');
    await p.query(`CREATE VIEW view_all_inventory AS SELECT t.transaction_id, t.product_id, t.product_name, t.product_type, t.product_model, t.serial_number, t.property_number, t.office_id, t.received_by, t.borrowed_by, t.transaction_date, t.quality, t.quantity, o.office_name FROM transactions t JOIN offices o ON t.office_id = o.office_id`);
    console.log("Done recreating view.");
  } catch(e) {
    console.log("Error or already added:", e.message);
  }
  process.exit();
}

fixDB();
