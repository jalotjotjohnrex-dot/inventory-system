const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function debug() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system',
    dateStrings: true
  });

  const body = {
    product_name: "Screw Driver",
    product_type: "Hardware",
    product_model: "asdbv8!sad",
    serial_number: "m15",
    property_number: "sdfsd234jdfbasd",
    quantity: 1,
    office_id: "Accounting", // This is what the frontend sends
    received_by: "Kenneth",
    borrowed_by: "ICTS", // userOffice
    transaction_date: "2026-04-08",
    quality: "New"
  };

  try {
    const { product_name, serial_number } = body;
    console.log(`Checking product: Name="${product_name}", SN="${serial_number}"`);
    
    const [[product]] = await pool.query(
      'SELECT product_id, office_id FROM products WHERE LOWER(TRIM(serial_number)) = LOWER(TRIM(?)) AND LOWER(TRIM(item_name)) = LOWER(TRIM(?))', 
      [serial_number, product_name]
    );

    if (!product) {
       console.log("VALIDATION FAILED: Product not found");
       process.exit(1);
    }
    console.log("Validation Passed. Product found:", product);

    console.log("Attempting INSERT...");
    const [result] = await pool.query(`
      INSERT INTO transactions 
      (product_id, product_name, product_type, product_model, serial_number, property_number, office_id, received_by, borrowed_by, transaction_date, quality, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [product.product_id, body.product_name, body.product_type, body.product_model, body.serial_number, body.property_number || '', product.office_id, body.received_by || '-', body.borrowed_by || '-', body.transaction_date, body.quality, body.quantity || 1]);

    console.log("INSERT SUCCESS! ID:", result.insertId);

    // CLEANUP so we don't pollute the DB during testing
    await pool.query('DELETE FROM transactions WHERE transaction_id = ?', [result.insertId]);
    console.log("Cleanup done.");

  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    console.error("ERROR CODE:", error.code);
  }

  process.exit();
}

debug().catch(console.error);
