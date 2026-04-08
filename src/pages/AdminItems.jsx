import { useState, useEffect } from 'react'
import { Package, Search, Briefcase, PlusCircle, Box } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [offices, setOffices] = useState([])
  const [formData, setFormData] = useState({ product_name: '', product_type: '', serial_number: '', quantity: 1, office_id: '' })

  const fetchItems = () => {
    fetch('/api/items/available')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
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
    try {
      const payload = {
        ...formData,
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
      setFormData({ product_name: '', product_type: '', serial_number: '', quantity: 1, office_id: '' })
      fetchItems()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  const [activeTab, setActiveTab] = useState('All Offices')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = items.filter(i => {
    const matchesOffice = activeTab === 'All Offices' || i.office_name === activeTab;
    const search = searchQuery.toLowerCase();
    const matchesSearch = 
      (i.product_name && i.product_name.toLowerCase().includes(search)) ||
      (i.serial_number && i.serial_number.toLowerCase().includes(search)) ||
      (i.product_type && i.product_type.toLowerCase().includes(search));
    
    return matchesOffice && matchesSearch;
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Items Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">System-wide available non-borrowed assets</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> {showAddForm ? 'Cancel Form' : 'Add New Item'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100"><Box className="w-5 h-5 text-indigo-600" /></div>
             <div>
               <h3 className="text-lg font-bold text-slate-900">Register New Item</h3>
               <p className="text-xs font-medium text-slate-500">Add an asset to an office system inventory</p>
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
                  {offices.map(office => (
                    <option key={office} value={office}>{office}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 pt-4 border-t border-slate-100 flex justify-end">
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
               placeholder="Search items by name, serial number, or category..." 
               className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
             />
           </div>
           
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

        {filteredItems.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center border-t border-slate-100">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 mb-4">
               <Package className="w-8 h-8 text-indigo-500" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Item Directory</h3>
             <p className="text-slate-500 text-sm font-medium max-w-md">
               This displays absolute aggregates of all non-borrowed assets grouped by offices. Connect transactions to populate.
             </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                <tr>
                  <th className="px-6 py-4">Item Identity</th>
                  <th className="px-6 py-4">Serial No.</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4">Current Office</th>
                  <th className="px-6 py-4 text-right">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/30">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-xs text-slate-500">{item.product_type}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{item.serial_number}</td>
                    <td className="px-6 py-4 font-bold text-slate-700 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{item.office_name}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.quality === 'New' || item.quality === 'Good Condition' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
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
