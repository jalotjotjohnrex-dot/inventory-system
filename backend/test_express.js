const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '12345678',
  database: process.env.DB_NAME || 'inventory_system',
  dateStrings: true
});

app.post('/test-tx', async (req, res) => {
  try {
    const { product_name, serial_number } = req.body;
    console.log("Req Body:", req.body);

    const [[product]] = await pool.query(
      'SELECT product_id, office_id FROM products WHERE LOWER(TRIM(serial_number)) = LOWER(TRIM(?)) AND LOWER(TRIM(item_name)) = LOWER(TRIM(?))', 
      [serial_number, product_name]
    );

    if (!product) {
       console.log("Validation Failed: Product not found");
       return res.status(400).json({ error: "Product not found" });
    }
    console.log("Product found:", product);

    const [result] = await pool.query(`
      INSERT INTO transactions 
      (product_id, product_name, product_type, product_model, serial_number, office_id, received_by, borrowed_by, transaction_date, quality, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [product.product_id, product_name, "Hardware", "Model", serial_number, product.office_id, "Kenneth", "ICTS", "2026-04-08", "New", 1]);

    console.log("SUCCESS!");
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("ERROR:", err.message, err.code);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
    console.log("Test server on 3001");
});
