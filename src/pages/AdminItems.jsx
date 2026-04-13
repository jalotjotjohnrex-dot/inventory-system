import { useState, useEffect } from 'react'
import { Package, Search, Briefcase, PlusCircle, Box } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [offices, setOffices] = useState([])
  const [formData, setFormData] = useState({ product_name: '', product_type: '', serial_number: '', office_id: '' })

  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      const [rawItemsRes, txRes] = await Promise.all([
        fetch('/api/items/available'),
        fetch('/api/transactions')
      ]);
      const rawItems = await rawItemsRes.json();
      const txData = await txRes.json();

      // Process loaned items globally
      const currentlyLent = new Map();
      const seenSerials = new Set();
      
      for (const tx of txData) {
        if (!seenSerials.has(tx.serial_number)) {
          seenSerials.add(tx.serial_number);
          const b = tx.borrowed_by;
          if (b && b !== '-' && b !== '' && b !== '- Returned -' && !b.includes('(Returned)')) {
             currentlyLent.set(tx.serial_number, b);
          }
        }
      }

      // Grouping by product_name AND office_name
      const groups = {}
      rawItems.forEach(item => {
         const groupKey = `${item.product_name}-${item.office_name}`
         if (!groups[groupKey]) {
            groups[groupKey] = {
              product_name: item.product_name,
              product_type: item.product_type,
              office_name: item.office_name,
              total_items: 0,
              total_available: 0,
              total_lent: 0,
              total_defective: 0,
              serials: []
            }
         }
         
         const g = groups[groupKey]
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
    fetch('/api/offices')
      .then(res => res.json())
      .then(data => setOffices(data))
      .catch(err => console.error(err))
  }, [])

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
      
      showToast("New Item added to stock successfully!", "success")
      setShowAddForm(false)
      setFormData({ product_name: '', product_type: '', serial_number: '', office_id: '' })
      fetchItems()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  const [activeTab, setActiveTab] = useState('All Offices')
  const [searchQuery, setSearchQuery] = useState('')
  const [modalItem, setModalItem] = useState(null)

  const filteredItems = items.filter(i => {
    const matchesOffice = activeTab === 'All Offices' || i.office_name === activeTab;
    const search = searchQuery.toLowerCase();
    
    const matchesName = i.product_name && i.product_name.toLowerCase().includes(search);
    const matchesType = i.product_type && i.product_type.toLowerCase().includes(search);
    const matchesSerial = i.serials && i.serials.some(s => s.serial_number && s.serial_number.toLowerCase().includes(search));
    
    return matchesOffice && (matchesName || matchesType || matchesSerial);
  })

  return (
    <div className="space-y-4 relative">
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100"><Box className="w-5 h-5 text-indigo-600" /></div>
             <div>
               <h3 className="text-lg font-bold text-slate-900">Add Items</h3>
               <p className="text-xs font-medium text-slate-500">Add an asset to an office system inventory</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assigned Office *</label>
              <div className="relative">
                <select required name="office_id" value={formData.office_id} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 appearance-none outline-none text-slate-700">
                  <option value="">Select Office</option>
                  {offices.map(office => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-colors">
                Save Asset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-0 overflow-hidden">
         <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
           <div className="relative group w-full md:w-96 flex-shrink-0">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search item type..." 
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
             />
           </div>

           <button 
             onClick={() => setShowAddForm(!showAddForm)}
             className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
           >
             <Box className="w-4 h-4" /> {showAddForm ? 'Cancel Form' : 'Add Items'}
           </button>
           
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="font-semibold text-slate-700 text-sm whitespace-nowrap">Filter Office:</div>
             <div className="relative w-full md:w-56">
               <select
                 value={activeTab}
                 onChange={(e) => setActiveTab(e.target.value)}
                 className="w-full px-4 py-2 font-bold text-sm bg-white border border-slate-200 rounded-lg text-slate-700 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
               >
                 <option value="All Offices">All Offices</option>
                 {[
                   'SB Leg', 'SB Sec', 'DILG', 'LIGA', 'Engineering', 'MPDO', 'ICTS', 
                   'Mayor\'s', 'HRMO', 'Budget', 'Vice Mayor\'s', 'Supply', 'Accounting', 
                   'MCR', 'Assessor', 'Treasurer', 'BPLO', 'Waterworks', 'Library', 
                   'Tourism', 'Agriculture', 'MSWDO', 'MDRRMO', 'Admin'
                 ].map(o => (
                   <option key={o} value={o}>{o}</option>
                 ))}
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
               </div>
             </div>
           </div>
         </div>

        {loading ? (
             <div className="p-12 text-center text-slate-500 font-medium">Scanning global inventory tags...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center border-t border-slate-100">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 mb-4">
               <Package className="w-8 h-8 text-indigo-500" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Item Directory</h3>
             <p className="text-slate-500 text-sm font-medium max-w-md">
               This displays absolute aggregates of all assets. Nothing matches the current base filter.
             </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item Identity</th>
                  <th className="px-6 py-4 text-right">Assigned Office</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr 
                     key={idx} 
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
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm">{item.office_name}</span>
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
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{modalItem.product_name}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase border border-slate-200 tracking-wider">
                          {modalItem.office_name}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">{modalItem.product_type}</p>
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
