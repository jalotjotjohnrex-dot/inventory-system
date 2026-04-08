require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');

async function fullTest() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '12345678',
    database: process.env.DB_NAME || 'inventory_system',
  });

  // Test 1: Check all offices with products
  console.log('\n===== ALL OFFICES WITH PRODUCTS =====');
  const [allProducts] = await pool.query(`
    SELECT o.office_name, COUNT(*) as item_count, SUM(p.quantity) as total_qty, o.office_id
    FROM products p
    JOIN offices o ON p.office_id = o.office_id
    GROUP BY o.office_id, o.office_name
    ORDER BY o.office_name
  `);
  allProducts.forEach(r => console.log(`  "${r.office_name}" (id:${r.office_id}) => ${r.item_count} items, qty: ${r.total_qty}`));

  // Test 2: Simulate encodeURIComponent + query param + decodeURIComponent for problematic offices
  console.log('\n===== SIMULATE QUERY PARAM FETCH FOR PROBLEM OFFICES =====');
  const problemOffices = ['SB Leg', 'SB Sec', "Mayor's", "Vice Mayor's"];
  for (const office of problemOffices) {
    // Simulate what browser sends: encodeURIComponent(office)
    const encoded = encodeURIComponent(office);
    // Simulate what Express receives in req.query.office (auto-decoded)
    const expressDecoded = decodeURIComponent(encoded); // Express auto-decodes query strings
    // Then our code does decodeURIComponent again
    let doubleDecoded;
    try { doubleDecoded = decodeURIComponent(expressDecoded); } catch(e) { doubleDecoded = expressDecoded; }
    
    console.log(`\n  Office: "${office}"`);
    console.log(`  encoded: "${encoded}"`);
    console.log(`  expressDecoded (req.query.office): "${expressDecoded}"`);
    console.log(`  After our decodeURIComponent: "${doubleDecoded}"`);
    
    // Test actual SQL with this value
    const [rows] = await pool.query(
      'SELECT item_name, quantity FROM products p JOIN offices o ON p.office_id=o.office_id WHERE LOWER(o.office_name)=LOWER(?)',
      [doubleDecoded]
    );
    console.log(`  SQL result: ${rows.length} rows`);
    rows.forEach(r => console.log(`    -> ${r.item_name} (qty:${r.quantity})`));
  }

  // Test 3: Check if view_all_inventory exists and what it contains
  console.log('\n===== VIEW_ALL_INVENTORY DEFINITION CHECK =====');
  const [views] = await pool.query(`SHOW CREATE VIEW view_all_inventory`);
  if (views.length > 0) {
    console.log('VIEW EXISTS. First 500 chars:', views[0]['Create View'].substring(0, 500));
  }

  await pool.end();
}
fullTest().catch(console.error);
