require("dotenv").config({ path: "./.env" });
const mysql = require("mysql2/promise");

(async function () {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "12345678",
    database: process.env.DB_NAME || "inventory_system",
  });

  const officeName = "Accounting";

  const [[office]] = await pool.query(
    "SELECT office_id FROM offices WHERE LOWER(TRIM(office_name)) = LOWER(?)",
    [officeName]
  );
  const officeId = office.office_id;

  let productsQuery =
    "SELECT office_id, quantity, serial_number FROM products WHERE office_id = ?";
  const [products] = await pool.query(productsQuery, [officeId]);

  const [transactions] = await pool.query(
    "SELECT office_id, borrowed_by, serial_number, quality, quantity FROM transactions ORDER BY transaction_id DESC"
  );

  let totalItems = 0;
  let availableItems = 0;
  let lentItems = 0;
  let defectiveItems = 0;
  let borrowedFromOthers = 0;

  const scopeSerials = new Set();
  products.forEach((p) => {
    totalItems += parseInt(p.quantity, 10) || 0;
    scopeSerials.add(p.serial_number);
  });

  const seenSerials = new Set();
  for (const tx of transactions) {
    if (!seenSerials.has(tx.serial_number)) {
      seenSerials.add(tx.serial_number);

      const isScopeOwner = tx.office_id === officeId;
      const borrower = tx.borrowed_by;
      const isActiveBorrow =
        borrower &&
        borrower !== "-" &&
        borrower !== "" &&
        borrower !== "- Returned -" &&
        !borrower.includes("(Returned)");
      const isDefective = tx.quality === "Defective";

      const txQty = parseInt(tx.quantity, 10) || 0;

      if (
        isActiveBorrow &&
        borrower.toLowerCase().trim() === officeName.toLowerCase().trim()
      ) {
        borrowedFromOthers += txQty;
      }

      if (isScopeOwner && scopeSerials.has(tx.serial_number)) {
        if (isDefective) {
          defectiveItems += txQty;
        } else if (isActiveBorrow) {
          lentItems += txQty;
        }
      }
    }
  }

  const actualOwnedStock = totalItems - defectiveItems;
  const stockedAvailable =
    totalItems - lentItems - defectiveItems + borrowedFromOthers;

  console.log({
    totalSystemItems: actualOwnedStock < 0 ? 0 : actualOwnedStock,
    totalTransactions: transactions.length,
    stockedAvailable: stockedAvailable < 0 ? 0 : stockedAvailable,
    totalBorrowed: borrowedFromOthers < 0 ? 0 : borrowedFromOthers,
    totalDefective: defectiveItems < 0 ? 0 : defectiveItems,
  });

  process.exit(0);
})();
