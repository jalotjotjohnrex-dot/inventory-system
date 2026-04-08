import { useState, useEffect } from 'react'
import { PlusCircle, Search, Filter, Box, Package } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function OfficeItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ product_name: '', product_type: '', serial_number: '', quantity: 1, office_id: '' })
  const userOffice = localStorage.getItem('userOffice') || 'Unknown Office'

  const fetchItems = () => {
    fetch(`/api/items/available?office=${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => {
        // [SYNC LOGIC] - Items menu strictly excludes Defective/Maintenance items
        const serviceableItems = data.filter(i => i.quality !== 'Defective' && i.quality !== 'Maintenance');
        setItems(serviceableItems)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching items:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchItems()
  }, [userOffice])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        office_id: userOffice, // Always register to the logged-in office
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
      setFormData({ product_name: '', product_type: '', serial_number: '', quantity: 1, office_id: '' })
      fetchItems()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Hardware</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review the live condition and status of assigned material</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> {showAddForm ? 'Cancel Form' : 'Register Local Hardware'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100"><Box className="w-5 h-5 text-indigo-600" /></div>
             <div>
               <h3 className="text-lg font-bold text-slate-900">Register New Hardware</h3>
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
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Quantity *</label>
              <input required type="number" min="1" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assigned Office *</label>
              <div className="relative">
                <select required name="office_id" value={formData.office_id} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 appearance-none outline-none text-slate-700">
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
            <div className="lg:col-span-1 pt-4 flex justify-end items-end">
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-colors">
                Save Assset
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
           <div className="relative group w-full sm:w-auto flex-1 max-w-md">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
             <input type="text" placeholder="Search specific assigned hardware..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full" />
           </div>
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
                  <th className="px-6 py-4 rounded-tl-xl w-1/3">Item Identity</th>
                  <th className="px-6 py-4 w-1/4">Serial No.</th>
                  <th className="px-6 py-4 text-center">Assigned QTY</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Quality State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item, index) => (
                  <tr key={`${item.serial_number}-${index}`} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                           <Box className="w-4 h-4" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.product_name}</p>
                           <p className="text-xs font-semibold text-slate-500 capitalize">{item.product_type}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 font-medium">{item.serial_number}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-slate-800 bg-slate-100/80 px-3 py-1 rounded-md border border-slate-200/60 shadow-inner">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shadow-sm border ${item.quality === 'New' || item.quality === 'Good Condition' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                        {item.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
