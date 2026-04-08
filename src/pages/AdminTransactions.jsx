import { useState, useEffect } from 'react'
import { PlusCircle, Search, Filter, Box } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminTransactions() {
  const { showToast } = useToast()
  const [transactions, setTransactions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recentTxIds, setRecentTxIds] = useState([])
  const [editingTxId, setEditingTxId] = useState(null)
  
  const [formData, setFormData] = useState({
    product_name: '', product_type: '', product_model: '', serial_number: '', property_number: '',
    office_id: '', received_by: '', borrowed_by: '', transaction_date: '', quality: 'New', quantity: 1
  })

  const fetchTransactions = () => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => { 
        const sortedData = Array.isArray(data) ? [...data].sort((a, b) => b.transaction_id - a.transaction_id) : [];
        setTransactions(sortedData); 
        setLoading(false); 
      })
      .catch(err => { console.error(err); setLoading(false); })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingTxId(null)
    setFormData({ product_name: '', product_type: '', product_model: '', serial_number: '', property_number: '', office_id: '', received_by: '', borrowed_by: '', transaction_date: '', quality: 'New', quantity: 1 })
  }

  const handleEdit = (t) => {
    let formattedDate = '';
    if (t.transaction_date) {
      try {
        const d = new Date(t.transaction_date);
        const tzOffset = d.getTimezoneOffset() * 60000;
        formattedDate = new Date(d - tzOffset).toISOString().split('T')[0];
      } catch (e) {
        formattedDate = t.transaction_date;
      }
    }

    setFormData({
      product_name: t.product_name || '', product_type: t.product_type || '', product_model: t.product_model || '',
      serial_number: t.serial_number || '', 
      property_number: t.property_number || '',
      office_id: t.office_name || t.office_id || '', 
      received_by: t.received_by === '-' ? '' : (t.received_by || ''), 
      borrowed_by: t.borrowed_by === '-' ? '' : (t.borrowed_by || ''), 
      transaction_date: formattedDate, quality: t.quality || 'New', quantity: t.quantity || 1
    });
    setEditingTxId(t.transaction_id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingTxId ? `/api/transactions/${editingTxId}` : '/api/transactions';
      const method = editingTxId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Transaction submission failed');
      }
      
      const data = await res.json()
      if (!editingTxId && data.transactionId) {
         setRecentTxIds(prev => [...prev, data.transactionId])
      }

      showToast(editingTxId ? "Transaction updated successfully!" : "New transaction recorded successfully!", "success")
      fetchTransactions() 
      handleCancel()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Base</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage and record asset transactions</p>
        </div>
        <button 
          onClick={showAddForm ? handleCancel : () => setShowAddForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> {showAddForm ? 'Cancel Form' : 'Add New Transaction'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100"><Box className="w-5 h-5 text-indigo-600" /></div>
             <div>
               <h3 className="text-lg font-bold text-slate-900">{editingTxId ? 'Edit Transaction Details' : 'New Item Transaction'}</h3>
               <p className="text-xs font-medium text-slate-500">Enter asset deployment details</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Name *</label>
              <input required type="text" name="product_name" value={formData.product_name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. ThinkPad T14" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Type *</label>
              <input required type="text" name="product_type" value={formData.product_type} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Laptop" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Model</label>
              <input type="text" name="product_model" value={formData.product_model} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="e.g. Gen 3" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Serial Number *</label>
              <input required type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="SN-XXXX" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Property Number</label>
              <input type="text" name="property_number" value={formData.property_number} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="PN-XXXX" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Quantity *</label>
              <input required type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assigned Office *</label>
              <div className="relative">
                <select required name="office_id" value={formData.office_id} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 appearance-none">
                  <option value="">Select Office</option>
                  {[
                    'SB Leg', 'SB Sec', 'DILG', 'LIGA', 'Engineering', 'MPDO', 'ICTS', 
                    'Mayor\'s', 'HRMO', 'Budget', 'Vice Mayor\'s', 'Supply', 'Accounting', 
                    'MCR', 'Assessor', 'Treasurer', 'BPLO', 'Waterworks', 'Library', 
                    'Tourism', 'Agriculture', 'MSWDO', 'MDRRMO', 'Admin'
                  ].map(office => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Quality State</label>
              <select required name="quality" value={formData.quality} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700">
                <option value="New">New</option>
                <option value="Good Condition">Good Condition</option>
                <option value="Defective">Defective</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Received By</label>
              <input type="text" name="received_by" value={formData.received_by} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Borrowed By</label>
              <input type="text" name="borrowed_by" value={formData.borrowed_by} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Transaction Date *</label>
              <input required type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
            </div>
            
            <div className="lg:col-span-3 pt-4 border-t border-slate-100 flex justify-end gap-3">
              {editingTxId && (
                <button type="button" onClick={handleCancel} className="px-6 py-2.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-colors">
                {editingTxId ? 'Save Core Changes' : 'Confirm & Add Transaction'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="relative group w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
             <input type="text" placeholder="Search S/N, Name, Office..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full sm:w-72" />
           </div>
           <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg transition-colors">
             <Filter className="w-4 h-4" /> Filter Views
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl text-indigo-600 font-bold">Item Info</th>
                <th className="px-6 py-4">S/N & Property No.</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4">Office</th>
                <th className="px-6 py-4">Received / Borrowed</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 group-hover:text-indigo-700">{t.product_name}</p>
                    <p className="text-xs font-semibold text-slate-500">{t.product_type} • {t.product_model}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono text-xs font-medium text-slate-600">{t.serial_number}</p>
                    <p className="font-mono text-[10px] font-bold text-indigo-500/70 mt-1">{t.property_number || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-center text-slate-700">{t.quantity || 1}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{t.office_name || t.office_id}</td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-slate-700"><span className="text-slate-400">Rec:</span> {t.received_by || '-'}</p>
                    <p className={`text-xs font-bold ${t.borrowed_by === '- Returned -' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      <span className="text-slate-400 font-medium">Bor:</span> {t.borrowed_by || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{t.transaction_date}</td>
                  <td className="px-6 py-4 text-right flex justify-end items-center gap-3 h-full pt-6">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.quality === 'New' || t.quality === 'Good Condition' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {t.quality}
                    </span>
                    {t.borrowed_by !== '- Returned -' && !String(t.borrowed_by).includes('(Returned)') && (
                      <button onClick={() => handleEdit(t)} className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 shadow-sm flex items-center gap-1">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="p-8 text-center text-slate-500 font-medium text-sm">No transactions found. Adding one will display it here.</div>
          )}
        </div>
      </div>
    </div>
  )
}
