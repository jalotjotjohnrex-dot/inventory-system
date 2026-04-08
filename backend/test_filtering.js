const fetch = require('node-fetch');

async function testTransactions() {
  const office = 'Accounting';
  const res = await fetch(`http://localhost:5173/api/transactions/office?office=${encodeURIComponent(office)}`);
  const data = await res.json();
  console.log(`Transactions for ${office}:`, data.length);
  data.forEach(t => {
    console.log(`- ${t.product_name} (Owner: ${t.office_name}, Borrower: ${t.borrowed_by})`);
  });
}

testTransactions();
