const mysql = require('mysql2/promise');

async function debugStats() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'inventory_system'
  });

  try {
    const officeId = 13;
    const [products] = await pool.query('SELECT * FROM products WHERE office_id = ?', [officeId]);
    const [allTx] = await pool.query('SELECT * FROM transactions WHERE office_id = 13');
    
    const borrowed = allTx.filter(t => {
      const b = t.borrowed_by;
      const cond = b !== null && b !== '' && b !== '-' && !b.includes('(Returned)') && b !== '- Returned -';
      if (cond) {
        console.log('MATCHED AS BORROWED:', t.transaction_id, '| Name:', t.product_name, '| Bor:', b);
      }
      return cond;
    });

    console.log('Total Borrowed Count (JS Simulation):', borrowed.length);

    console.log('--- PRODUCTS ---');
    console.table(products);
    console.log('--- BORROWED TRANSACTIONS ---');
    console.table(transactions);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

debugStats();
