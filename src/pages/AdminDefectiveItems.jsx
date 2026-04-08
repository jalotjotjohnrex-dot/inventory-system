import { useState, useEffect } from 'react'
import { Search, Filter, AlertCircle, Package } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminDefectiveItems() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchDefectiveItems = () => {
    fetch('/api/transactions/defective')
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showToast("Could not load defective items", "error");
      })
  }

  useEffect(() => {
    fetchDefectiveItems()
  }, [])

  const filteredItems = items.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.office_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Defective Items</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Overview of all defective assets across offices</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl font-bold text-sm shadow-sm animate-pulse">
          <AlertCircle className="w-4 h-4" /> Action Required
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative group w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, S/N, or office..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full sm:w-72"
            />
          </div>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg transition-colors">
            <Filter className="w-4 h-4" /> Filter Range
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Item Information</th>
                <th className="px-6 py-4">Serial Number</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4">Office Location</th>
                <th className="px-6 py-4">Personnel Information</th>
                <th className="px-6 py-4">Reported Date</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Status</th>
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
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200 uppercase text-[10px] tracking-wider">
                      {t.office_name || t.office_id}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <p className="font-medium text-slate-700"><span className="text-slate-400">Received:</span> {t.received_by || '-'}</p>
                    <p className="font-medium text-slate-700"><span className="text-slate-400">Borrower:</span> {t.borrowed_by || '-'}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{t.transaction_date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-rose-600 text-white shadow-sm shadow-rose-200">
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
              <p className="text-slate-500 font-medium">Loading reports...</p>
            </div>
          ) : filteredItems.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold text-lg">No Defective Items Found</p>
              <p className="text-slate-400 text-sm mt-1 max-w-[300px] mx-auto">Great! There are no assets currently marked as defective across all offices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
