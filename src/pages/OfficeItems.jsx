import { useState, useEffect } from 'react'
import { PlusCircle, Search, Filter, Box, Package } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function OfficeItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ product_name: '', product_type: '', serial_number: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const userOffice = localStorage.getItem('userOffice') || 'Unknown Office'

  const fetchItems = async () => {
    try {
      const [rawItemsRes, txRes] = await Promise.all([
        fetch(`/api/items/available?office=${encodeURIComponent(userOffice)}`),
        fetch(`/api/transactions/office?office=${encodeURIComponent(userOffice)}`)
      ]);
      const rawItems = await rawItemsRes.json();
      const txData = await txRes.json();

      // Process loaned items
      const currentlyLent = new Map();
      const seenSerials = new Set();
      
      for (const tx of txData) {
        if (!seenSerials.has(tx.serial_number)) {
          seenSerials.add(tx.serial_number);
          // Is it our item?
          if (tx.office_name.toLowerCase() === userOffice.toLowerCase()) {
            // Is it currently borrowed by someone else?
            const b = tx.borrowed_by;
            if (b && b !== '-' && b !== '' && b !== '- Returned -' && !b.includes('(Returned)')) {
               currentlyLent.set(tx.serial_number, b);
            }
          }
        }
      }

      // Grouping
      const groups = {}
      rawItems.forEach(item => {
         if (!groups[item.product_name]) {
            groups[item.product_name] = {
              product_name: item.product_name,
              product_type: item.product_type,
              total_items: 0,
              total_available: 0,
              total_lent: 0,
              total_defective: 0,
              serials: []
            }
         }
         
         const g = groups[item.product_name]
         const isDefective = item.quality === 'Defective' || item.quality === 'Maintenance'
         const isLent = currentlyLent.has(item.serial_number)
         
         g.total_items += item.quantity
         
         if (isDefective) {
            g.total_defective += item.quantity
         } else if (isLent) {
            g.total_lent += item.quantity
         } else {
            g.total_available += item.quantity
         }
         
         let qualityStatus = item.quality;
         let borrower = null;
         if (!isDefective && isLent) {
            qualityStatus = 'Lent Out';
            borrower = currentlyLent.get(item.serial_number);
         }
         
         g.serials.push({
            serial_number: item.serial_number,
            quality: qualityStatus,
            quantity: item.quantity,
            borrowed_by: borrower
         })
      })

      setItems(Object.values(groups))
      setLoading(false)
    } catch (err) {
      console.error("Error fetching items:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [userOffice])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.serial_number && 1 > 1) { // Redundant but keeping structure
       return showToast("Items with a Serial Number must have a quantity of 1.", "error");
    }

    try {
      const payload = {
        ...formData,
        quantity: 1,
        office_id: userOffice,
        product_model: '-',
        received_by: '-',
        borrowed_by: '-',
        transaction_date: new Date().toISOString().split('T')[0],
        quality: 'New'
      };
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to add item')
      }
      
      showToast(`New Item added to ${userOffice} stock successfully!`, "success")
      setShowAddForm(false)
      setFormData({ product_name: '', product_type: '', serial_number: '' })
      fetchItems()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  const [modalItem, setModalItem] = useState(null);

  return (
    <div className="space-y-4 relative">
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100"><Box className="w-5 h-5 text-indigo-600" /></div>
             <div>
               <h3 className="text-lg font-bold text-slate-900">Add Items</h3>
               <p className="text-xs font-medium text-slate-500">Insert an asset directly into the {userOffice} system</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Item Name *</label>
              <input required type="text" name="product_name" value={formData.product_name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Laser Printer" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category *</label>
              <input required type="text" name="product_type" value={formData.product_type} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Hardware" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Serial No. *</label>
              <input required type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="SN-XXXX" />
            </div>
            <div className="md:col-span-3 lg:col-span-3 pt-4 flex justify-end items-end">
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-colors">
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
           <div className="relative group w-full sm:w-auto flex-1 max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
             <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or serial number..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full" 
              />
           </div>

           <button 
             onClick={() => setShowAddForm(!showAddForm)}
             className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
           >
             <Box className="w-4 h-4" /> {showAddForm ? 'Cancel Form' : 'Add Items'}
           </button>
        </div>

        {loading ? (
             <div className="p-12 text-center text-slate-500 font-medium">Scanning local inventory tags...</div>
        ) : items.length === 0 ? (
           <div className="flex-1 bg-slate-50/50 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center mb-5 relative">
                 <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-slate-800 text-lg font-bold mb-2">No Active Hardware Traced</h4>
              <p className="text-slate-500 text-sm font-medium max-w-md mx-auto">
                No active base items are physically recorded on {userOffice}'s location list. Register new hardware to populate the inventory.
              </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl w-full">Item Identity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.filter(item => {
                   const search = searchQuery.toLowerCase();
                   const matchesName = item.product_name.toLowerCase().includes(search);
                   const matchesSerial = item.serials.some(s => s.serial_number.toLowerCase().includes(search));
                   return matchesName || matchesSerial;
                }).map((item, index) => (
                  <tr 
                     key={index} 
                     onClick={() => setModalItem(item)}
                     className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                           <Box className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.product_name}</p>
                           <p className="text-xs font-semibold text-slate-500 capitalize">{item.product_type} • {item.total_items} Total Items</p>
                         </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-100">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">{modalItem.product_name}</h3>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">{modalItem.product_type}</p>
                    </div>
                 </div>
                 <button onClick={() => setModalItem(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 border-b border-slate-100 shrink-0">
                 <div className="bg-white p-5 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Owned</p>
                    <p className="text-3xl font-black text-slate-900">{modalItem.total_items}</p>
                 </div>
                 <div className="bg-white p-5 text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Available</p>
                    <p className="text-3xl font-black text-emerald-600">{modalItem.total_available}</p>
                 </div>
                 <div className="bg-white p-5 text-center">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Lent Out</p>
                    <p className="text-3xl font-black text-amber-600">{modalItem.total_lent}</p>
                 </div>
                 <div className="bg-white p-5 text-center">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Defective</p>
                    <p className="text-3xl font-black text-rose-500">{modalItem.total_defective}</p>
                 </div>
              </div>

              {/* Serials Table */}
              <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                       <tr>
                         <th className="px-6 py-4">Serial Number</th>
                         <th className="px-6 py-4 text-center">Quantity</th>
                         <th className="px-6 py-4 text-right">State</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {modalItem.serials.map((serial, idx) => (
                         <tr key={idx} className="hover:bg-slate-50/50">
                           <td className="px-6 py-3 font-mono text-xs font-bold text-slate-600">{serial.serial_number}</td>
                           <td className="px-6 py-3 font-bold text-slate-700 text-center">{serial.quantity}</td>
                           <td className="px-6 py-3 text-right">
                             {serial.quality === 'Lent Out' ? (
                                <div className="flex flex-col items-end gap-1">
                                   <span className="inline-flex px-2 py-1 rounded bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-wider">Lent Out</span>
                                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lent to: <span className="text-amber-600">{serial.borrowed_by}</span></span>
                                </div>
                             ) : serial.quality === 'Defective' || serial.quality === 'Maintenance' ? (
                                <span className="inline-flex px-2 py-1 rounded bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-wider">{serial.quality}</span>
                             ) : (
                                <span className="inline-flex px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">{serial.quality}</span>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
