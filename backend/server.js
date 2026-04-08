require('dotenv').config({ path: '../.env' });
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '12345678',
  database: process.env.DB_NAME || 'inventory_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});

// Helper to extract and normalize office name from request
const getOfficeName = (req) => {
  let name = req.query.office || req.params.officeName || '';
  try {
    name = decodeURIComponent(name);
  } catch (e) {
    // Already decoded or malformed
  }
  // Robust normalization: replace underscores/dashes with spaces and trim
  return name.replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Test DB Connection on startup
pool.query('SELECT 1').then(() => console.log('✅ Connected to MySQL Database')).catch(err => {
    console.error('❌ Failed to connect to MySQL database:', err.message);
});

// Request Logging Middleware for debugging
app.use((req, res, next) => {
  const logMsg = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  fs.appendFileSync(path.join(__dirname, 'api_requests.log'), logMsg);
  next();
});

// ----------------------------------------------------------------------
// AUTHENTICATION API
// ----------------------------------------------------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query accounts table and join with offices to get official name
    const [rows] = await pool.query(`
      SELECT a.username, a.role, o.office_name 
      FROM accounts a
      LEFT JOIN offices o ON a.office_id = o.office_id
      WHERE a.username = ? AND a.password = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    res.json({
      success: true,
      role: user.role === 'Administrator' ? 'admin' : 'office',
      officeName: user.role === 'Administrator' ? 'Administrator' : user.office_name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// ----------------------------------------------------------------------
// DASHBOARD STATS API
// ----------------------------------------------------------------------
// Unified Statistics Endpoint
app.get(['/api/stats', '/api/stats/:officeName'], async (req, res) => {
  try {
    const officeName = getOfficeName(req);
    
    if (officeName) {
      // Resolve Office Name to ID early for transactions
      const [[office]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(TRIM(office_name)) = LOWER(?)', [officeName]);
      if (!office) {
        return res.status(404).json({ error: `Office "${officeName}" not found` });
      }
      const officeId = office.office_id;

      // Total Office Items (From products table)
      const [[{ totalItems }]] = await pool.query('SELECT SUM(quantity) as totalItems FROM products WHERE office_id = ?', [officeId]);
      
      // Total Office Transactions (Both as Owner and Borrower)
      const [[{ totalTransactions }]] = await pool.query(`
        SELECT COUNT(*) as totalTransactions FROM transactions 
        WHERE office_id = ? 
           OR LOWER(TRIM(borrowed_by)) = LOWER(?)
           OR LOWER(TRIM(borrowed_by)) = LOWER(CONCAT(?, ' (Returned)'))
      `, [officeId, officeName, officeName]);

      // Total Borrowed (Exclude all forms of returned)
      const [[{ borrowedItems }]] = await pool.query(`
        SELECT SUM(quantity) as borrowedItems 
        FROM transactions 
        WHERE office_id = ? AND borrowed_by IS NOT NULL AND borrowed_by != '' AND borrowed_by != '-' 
          AND borrowed_by != '- Returned -' AND borrowed_by NOT LIKE '%(Returned)%'
      `, [officeId]);

      // Total Defective
      const [[{ defectiveItems }]] = await pool.query(`
        SELECT SUM(quantity) as defectiveItems
        FROM transactions
        WHERE office_id = ? AND quality = 'Defective'
      `, [officeId]);

      const actualTotalItems = (totalItems || 0) - (defectiveItems || 0);
      const availableItems = actualTotalItems - (borrowedItems || 0);

      return res.json({
        totalSystemItems: actualTotalItems < 0 ? 0 : actualTotalItems,
        totalTransactions: totalTransactions || 0,
        stockedAvailable: availableItems < 0 ? 0 : availableItems,
        totalBorrowed: borrowedItems || 0,
        totalDefective: defectiveItems || 0
      });
    } else {
      // GLOBAL STATS
      const [[{ totalItems }]] = await pool.query('SELECT SUM(quantity) as totalItems FROM products');
      const [[{ totalTransactions }]] = await pool.query('SELECT COUNT(*) as totalTransactions FROM transactions');
      const [[{ borrowedItems }]] = await pool.query(`
        SELECT SUM(quantity) as borrowedItems 
        FROM transactions 
        WHERE borrowed_by IS NOT NULL AND borrowed_by != '' AND borrowed_by != '-' 
          AND borrowed_by NOT LIKE '%(Returned)%' AND borrowed_by != '- Returned -'
      `);
      const [[{ defectiveItems }]] = await pool.query(`
        SELECT SUM(quantity) as defectiveItems
        FROM transactions
        WHERE quality = 'Defective'
      `);

      const actualTotalItems = (totalItems || 0) - (defectiveItems || 0);
      const availableItems = actualTotalItems - (borrowedItems || 0);

      return res.json({
        totalSystemItems: actualTotalItems < 0 ? 0 : actualTotalItems,
        totalTransactions: totalTransactions || 0,
        stockedAvailable: availableItems < 0 ? 0 : availableItems,
        totalBorrowed: borrowedItems || 0,
        totalDefective: defectiveItems || 0
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to aggregate statistics' });
  }
});

// ----------------------------------------------------------------------
// TRANSACTIONS API (Inventory Base)
// ----------------------------------------------------------------------

// GET all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM view_all_inventory ORDER BY transaction_id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET all defective items (Optional filter by office)
app.get(['/api/transactions/defective', '/api/transactions/defective/:officeName'], async (req, res) => {
  try {
    const officeName = getOfficeName(req);
    let query = "SELECT * FROM view_all_inventory WHERE quality = 'Defective'";
    let params = [];

    if (officeName) {
      query += " AND (LOWER(TRIM(office_name)) = LOWER(?) OR LOWER(TRIM(borrowed_by)) = LOWER(?))";
      params = [officeName, officeName];
    }

    query += " ORDER BY transaction_id DESC";
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch defective items' });
  }
});

// GET specific office transactions
app.get(['/api/transactions/office', '/api/transactions/office/:officeName'], async (req, res) => {
  try {
    const officeName = getOfficeName(req);
    if (!officeName) return res.status(400).json({ error: 'Office name is required' });

    // Logic: Show all transactions where the office is either the owner or borrower.
    // We match 'Office' or 'Office (Returned)' to preserve history.
    const [rows] = await pool.query(
      `SELECT * FROM view_all_inventory 
       WHERE LOWER(TRIM(office_name)) = LOWER(?) 
          OR LOWER(TRIM(borrowed_by)) = LOWER(?)
          OR LOWER(TRIM(borrowed_by)) = LOWER(CONCAT(?, ' (Returned)'))
       ORDER BY transaction_id DESC`, 
      [officeName, officeName, officeName]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch office transactions' });
  }
});

// PUT (Return) an item
app.put('/api/transactions/:id/return', async (req, res) => {
  try {
    const { quality } = req.body || {};
    
    // We append ' (Returned)' to the existing borrower name to preserve history
    // We also update the quality if specified (e.g. from 'New' to 'Defective')
    const [result] = await pool.query(`
      UPDATE transactions 
      SET borrowed_by = CASE 
        WHEN borrowed_by IS NOT NULL AND borrowed_by != '-' AND borrowed_by != '' 
        THEN CONCAT(borrowed_by, ' (Returned)')
        ELSE '- Returned -'
      END,
      quality = COALESCE(?, quality)
      WHERE transaction_id = ? AND borrowed_by NOT LIKE '%(Returned)%'
    `, [quality || null, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or already returned' });
    }

    // [NOTIFICATION] Notify both owner and borrower about return
    try {
      const [[tx]] = await pool.query('SELECT office_id, borrowed_by, product_name FROM transactions WHERE transaction_id = ?', [req.params.id]);
      if (tx) {
        const msg = `Asset Returned: ${tx.product_name}`;
        // Notify owner
        await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [tx.office_id, req.params.id, msg]);
        
        // [ADMIN NOTIFICATION]
        const ADMIN_OFFICE_ID = 24; 
        if (tx.office_id !== ADMIN_OFFICE_ID) {
           await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [ADMIN_OFFICE_ID, req.params.id, msg]);
        }

        // Notify borrower if it's an office
        if (tx.borrowed_by && tx.borrowed_by !== '-' && tx.borrowed_by !== '') {
           const borrowerName = tx.borrowed_by.split(' (Returned)')[0].trim();
           const [[borrowerOffice]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(office_name) = LOWER(?)', [borrowerName]);
           if (borrowerOffice) {
              await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [borrowerOffice.office_id, req.params.id, msg]);
           }
        }
      }
    } catch (notifErr) { console.error('Failed to create return notification:', notifErr); }

    res.json({ success: true, message: 'Item returned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to return item' });
  }
});

// PUT (Edit) an existing transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { 
      product_name, product_type, product_model, serial_number, property_number,
      office_id, received_by, borrowed_by, transaction_date, quality, quantity
    } = req.body;

    // First resolve the 'Item From' office
    const [[assignedOffice]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(TRIM(office_name)) = LOWER(TRIM(?))', [office_id]);
    
    if (!assignedOffice) {
       return res.status(400).json({ error: `Validation Failed: Office '${office_id}' not found.` });
    }

    // [STRICT VALIDATION] Check if serial number, product name AND assigned office match
    const [[product]] = await pool.query(
      'SELECT product_id, office_id FROM products WHERE LOWER(TRIM(serial_number)) = LOWER(TRIM(?)) AND LOWER(TRIM(item_name)) = LOWER(TRIM(?)) AND office_id = ?', 
      [serial_number, product_name, assignedOffice.office_id]
    );

    if (!product) {
       return res.status(400).json({ 
         error: `Validation Failed: Asset mismatch. Ensure Serial Number '${serial_number}', Name '${product_name}', and Item From '${office_id}' are exactly correct.` 
       });
    }

    const [result] = await pool.query(`
      UPDATE transactions 
      SET product_name = ?, product_type = ?, product_model = ?, serial_number = ?, property_number = ?,
          office_id = ?, received_by = ?, borrowed_by = ?, transaction_date = ?, quality = ?, quantity = ?
      WHERE transaction_id = ?
    `, [product_name, product_type, product_model, serial_number, property_number || '', product.office_id, received_by || '-', borrowed_by || '-', transaction_date, quality, quantity || 1, req.params.id]);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Serial number already exists.' });
    } else {
        res.status(500).json({ error: error.message || 'Failed to update transaction.' });
    }
  }
});

// POST new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { 
      product_name, product_type, product_model, serial_number, property_number,
      office_id, received_by, borrowed_by, transaction_date, quality, quantity
    } = req.body;

    // First resolve the 'Item From' office
    const [[assignedOffice]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(TRIM(office_name)) = LOWER(TRIM(?))', [office_id]);
    
    if (!assignedOffice) {
       return res.status(400).json({ error: `Validation Failed: Office '${office_id}' not found.` });
    }

    // [STRICT VALIDATION] Check if serial number, product name AND assigned office match
    const [[product]] = await pool.query(
      'SELECT product_id, office_id FROM products WHERE LOWER(TRIM(serial_number)) = LOWER(TRIM(?)) AND LOWER(TRIM(item_name)) = LOWER(TRIM(?)) AND office_id = ?', 
      [serial_number, product_name, assignedOffice.office_id]
    );

    if (!product) {
       return res.status(400).json({ 
         error: `Validation Failed: Asset mismatch. Ensure Serial Number '${serial_number}', Name '${product_name}', and Item From '${office_id}' are exactly correct.` 
       });
    }

    const [result] = await pool.query(`
      INSERT INTO transactions 
      (product_id, product_name, product_type, product_model, serial_number, property_number, office_id, received_by, borrowed_by, transaction_date, quality, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [product.product_id, product_name, product_type, product_model, serial_number, property_number || '', product.office_id, received_by || '-', borrowed_by || '-', transaction_date, quality, quantity || 1]);

    const txId = result.insertId;

    // [NOTIFICATION] Notify involved offices
    try {
        const msg = `New Transaction: ${product_name}`;
        // 1. Notify the owner office (the one assigned in office_id)
        await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [product.office_id, txId, msg]);
        
        // [ADMIN NOTIFICATION]
        const ADMIN_OFFICE_ID = 24;
        if (product.office_id !== ADMIN_OFFICE_ID) {
           await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [ADMIN_OFFICE_ID, txId, msg]);
        }

        // 2. Notify the borrower if it's an office
        if (borrowed_by && borrowed_by !== '-' && borrowed_by !== '') {
           const [[borrowerOffice]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(office_name) = LOWER(?)', [borrowed_by.toLowerCase()]);
           if (borrowerOffice && borrowerOffice.office_id !== product.office_id) {
              await pool.query('INSERT INTO notifications (office_id, transaction_id, message) VALUES (?, ?, ?)', [borrowerOffice.office_id, txId, msg]);
           }
        }
    } catch (notifErr) { console.error('Failed to create notification:', notifErr); }

    res.status(201).json({ success: true, transactionId: txId });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Serial number already exists.' });
    } else {
        res.status(500).json({ error: error.message || 'Failed to create transaction.' });
    }
  }
});

// GET items - optionally filtered by ?office=OfficeName or /:officeName (case-insensitive)
app.get(['/api/items/available', '/api/items/available/:officeName'], async (req, res) => {
  try {
    const officeFilter = getOfficeName(req);

    let products;
    if (officeFilter) {
      [products] = await pool.query(`
        SELECT p.item_name AS product_name, p.product_type, p.serial_number, o.office_name, p.quality, p.quantity
        FROM products p
        JOIN offices o ON p.office_id = o.office_id
        WHERE LOWER(TRIM(o.office_name)) = LOWER(?)
        ORDER BY p.item_name ASC
      `, [officeFilter]);
    } else {
      [products] = await pool.query(`
        SELECT p.item_name AS product_name, p.product_type, p.serial_number, o.office_name, p.quality, p.quantity
        FROM products p
        JOIN offices o ON p.office_id = o.office_id
        ORDER BY o.office_name ASC
      `);
    }

    const [defects] = await pool.query(`
      SELECT serial_number, SUM(quantity) as defective_qty, quality
      FROM transactions
      WHERE quality = 'Defective' OR quality = 'Maintenance'
      GROUP BY serial_number, quality
    `);

    const finalItems = [];

    products.forEach(p => {
      const matchingDefects = defects.filter(d => d.serial_number === p.serial_number);
      let healthyQty = p.quantity;

      // Slice out defective/maintenance amounts into their own visual rows
      matchingDefects.forEach(d => {
         const defQty = parseInt(d.defective_qty) || 0;
         if (defQty > 0) {
            healthyQty -= defQty;
            finalItems.push({
               ...p,
               quantity: defQty,
               quality: d.quality // Spawns a 'Defective' row dynamically
            });
         }
      });

      // Spawn remaining items as Healthy block
      if (healthyQty > 0) {
         finalItems.push({
            ...p,
            quantity: healthyQty,
            quality: 'New' // Baseline healthy state
         });
      }
    });

    res.json(finalItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch available items' });
  }
});

// Backward compatibility for path param
// Handled by array routing above

// POST new base item (and instantly allocate to office)
app.post('/api/items', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      product_name, product_type, serial_number, quantity, office_id, supplier_name 
    } = req.body;

    // 1. Resolve the string office_name to an office_id from DB
    const [[office]] = await connection.query('SELECT office_id FROM offices WHERE office_name = ?', [office_id]);
    if (!office) {
       throw new Error(`Office '${office_id}' not found in system.`);
    }

    // 2. Insert ONLY into products database with full tracking details
    const [prodResult] = await connection.query(
      'INSERT INTO products (item_name, product_type, supplier_name, serial_number, quantity, office_id, quality) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [product_name, product_type, supplier_name || 'System Default', serial_number, quantity || 1, office.office_id, 'New']
    );
    const productId = prodResult.insertId;

    await connection.commit();
    res.status(201).json({ success: true, productId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Serial number already exists.' });
    } else {
        res.status(500).json({ error: error.message || 'Failed to create product' });
    }
  } finally {
    connection.release();
  }
});

// OFFICES API
app.get('/api/offices', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT office_name FROM offices ORDER BY office_name ASC');
    res.json(rows.map(r => r.office_name));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch offices' });
  }
});

app.get('/api/offices/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.office_name, COALESCE(SUM(p.quantity), 0) as total_items
      FROM offices o
      LEFT JOIN products p ON o.office_id = p.office_id
      GROUP BY o.office_id, o.office_name
      ORDER BY o.office_name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch office stats' });
  }
});

// ----------------------------------------------------------------------
// SUPPLIERS API
// ----------------------------------------------------------------------
app.get('/api/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const { name, contact_number, organization, location } = req.body;
    const [result] = await pool.query(
      'INSERT INTO suppliers (name, contact_number, organization, location) VALUES (?, ?, ?, ?)',
      [name, contact_number, organization, location]
    );
    res.status(201).json({ success: true, supplierId: result.insertId, name, contact_number, organization, location });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});


// ----------------------------------------------------------------------
// NOTIFICATIONS API
// ----------------------------------------------------------------------

// GET unread notifications for an office
app.get('/api/notifications/:officeName', async (req, res) => {
  try {
    const { officeName } = req.params;
    const [[office]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(office_name) = LOWER(?)', [officeName]);
    if (!office) return res.json([]);

    const [rows] = await pool.query(`
      SELECT n.*, t.transaction_date
      FROM notifications n
      JOIN transactions t ON n.transaction_id = t.transaction_id
      WHERE n.office_id = ? AND n.is_read = FALSE
      ORDER BY n.created_at DESC
    `, [office.office_id]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// [NEW] GET all unread notifications for Admin
app.get('/api/notifications/admin/all', async (req, res) => {
  try {
    // Admin ID is physically 24 in the office table OR let's just fetch everything unread globally for the Master Admin
    const [rows] = await pool.query(`
      SELECT n.*, t.transaction_date
      FROM notifications n
      JOIN transactions t ON n.transaction_id = t.transaction_id
      WHERE n.is_read = FALSE
      ORDER BY n.created_at DESC LIMIT 50
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch admin notifications' });
  }
});

// Mark office notifications as read
app.put('/api/notifications/:officeName/read', async (req, res) => {
  try {
    const { officeName } = req.params;
    const [[office]] = await pool.query('SELECT office_id FROM offices WHERE LOWER(office_name) = LOWER(?)', [officeName]);
    if (!office) return res.status(404).json({ error: 'Office not found' });

    await pool.query('UPDATE notifications SET is_read = TRUE WHERE office_id = ?', [office.office_id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// [NEW] Mark all notifications as read for Admin
app.put('/api/notifications/admin/all/read', async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE'); // Global clear
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear global notifications' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Inventory API Server running on port ${PORT}`);
});
