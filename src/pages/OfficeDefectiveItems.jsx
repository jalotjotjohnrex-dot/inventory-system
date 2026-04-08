import { useState, useEffect } from 'react'
import { Search, Filter, AlertCircle, Package } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function OfficeDefectiveItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const userOffice = localStorage.getItem('userOffice') || ''

  const fetchDefectiveItems = () => {
    if (!userOffice) return;
    
    // We use the office-specific endpoint
    fetch(`/api/transactions/defective/${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => { 
        console.error(err); 
        setLoading(false); 
        showToast("Could not load local defective items", "error");
      })
  }

  useEffect(() => {
    fetchDefectiveItems()
  }, [userOffice])

  const filteredItems = items.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Defective reporting (My Office)</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Assets from {userOffice} marked as defective</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-sm shadow-sm animate-pulse">
          <AlertCircle className="w-4 h-4" /> Fixed needed
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="relative group w-full sm:w-auto">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
             <input 
               type="text" 
               placeholder="Search my defective assets..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full sm:w-72" 
             />
           </div>
           <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing: {userOffice}</span>
             <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg transition-colors">
               <Filter className="w-4 h-4" /> Filter
             </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Asset Details</th>
                <th className="px-6 py-4">Serial Number</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4">Possession Status</th>
                <th className="px-6 py-4">Date Reported</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-rose-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center border border-rose-200">
                        <Package className="w-4 h-4 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-rose-700">{t.product_name}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{t.product_type} • {t.product_model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-medium text-slate-600 bg-slate-50/30">{t.serial_number}</td>
                  <td className="px-6 py-4 font-bold text-center text-slate-700">{t.quantity || 1}</td>
                  <td className="px-6 py-4">
                     <p className="text-xs font-medium text-slate-700"><span className="text-slate-400">Owner:</span> {t.office_name}</p>
                     <p className="text-xs font-bold text-rose-600"><span className="text-slate-400 font-medium">Borrower:</span> {t.borrowed_by || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{t.transaction_date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-rose-600 text-white shadow-md shadow-rose-200">
                      {t.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Fetching defective items...</p>
            </div>
          ) : filteredItems.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold text-lg">No Defective Assets in {userOffice}</p>
              <p className="text-slate-400 text-sm mt-1 max-w-[300px] mx-auto">Nicely done! Your office currently has no items reported as defective.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
