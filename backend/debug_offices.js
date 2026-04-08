require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function debug() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system',
  });

  console.log('\n=== OFFICES TABLE (exact values) ===');
  const [offices] = await pool.query('SELECT office_id, office_name FROM offices ORDER BY office_name');
  offices.forEach(o => console.log(`  ID=${o.office_id} | NAME="${o.office_name}"`));

  console.log('\n=== PRODUCTS TABLE (office_id + item counts) ===');
  const [products] = await pool.query(`
    SELECT o.office_name, COUNT(*) as item_count, SUM(p.quantity) as total_qty
    FROM products p
    JOIN offices o ON p.office_id = o.office_id
    GROUP BY o.office_id, o.office_name
    ORDER BY o.office_name
  `);
  products.forEach(p => console.log(`  OFFICE="${p.office_name}" | Items=${p.item_count} | TotalQty=${p.total_qty}`));

  console.log('\n=== PRODUCTS with office_id NULL or unmatched ===');
  const [unmatched] = await pool.query(`
    SELECT p.item_name, p.serial_number, p.office_id
    FROM products p
    LEFT JOIN offices o ON p.office_id = o.office_id
    WHERE o.office_id IS NULL
  `);
  if (unmatched.length === 0) console.log('  None — all products have valid office_id links');
  else unmatched.forEach(u => console.log(`  UNMATCHED: item="${u.item_name}" office_id=${u.office_id}`));

  await pool.end();
}

debug().catch(console.error);
