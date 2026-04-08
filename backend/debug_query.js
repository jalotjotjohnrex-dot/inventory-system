require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function debugQuery() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system',
  });

  const officesToTest = ['SB Leg', 'ICTS', 'Accounting', 'Engineering', 'Supply'];
  
  for (const office of officesToTest) {
    const [rows] = await pool.query(`
      SELECT p.item_name AS product_name, p.product_type, p.serial_number, o.office_name, p.quantity
      FROM products p
      JOIN offices o ON p.office_id = o.office_id
      WHERE LOWER(o.office_name) = LOWER(?)
      ORDER BY p.item_name ASC
    `, [office]);
    console.log(`\n"${office}" => ${rows.length} items found`);
    rows.forEach(r => console.log(`  - ${r.product_name} (qty: ${r.quantity}, office_name_in_db: "${r.office_name}")`));
  }

  // Also test with encodeURIComponent equivalents
  console.log('\n=== Testing with URL-decoded values ===');
  const [decoded] = await pool.query(`
    SELECT p.item_name AS product_name, o.office_name, p.quantity
    FROM products p
    JOIN offices o ON p.office_id = o.office_id
    WHERE LOWER(o.office_name) = LOWER(?)
  `, ['SB%20Leg']); // URL-encoded version
  console.log(`"SB%20Leg" (URL encoded) => ${decoded.length} items (should be 0, URL decode must happen first)`);

  await pool.end();
}

debugQuery().catch(console.error);
