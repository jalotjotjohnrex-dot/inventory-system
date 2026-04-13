import { useState, useEffect } from 'react'
import { Search, Filter, Package, ArrowRightLeft, Building2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminBorrowed() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBorrowedItems = () => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => { 
        // Filter for active borrows only
        const activeBorrows = data.filter(t => {
           const b = t.borrowed_by;
           return b && b !== '-' && b !== '' && b !== '- Returned -' && !b.includes('(Returned)');
        });
        setItems(activeBorrows); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showToast("Could not load borrowed items", "error");
      })
  }

  useEffect(() => {
    fetchBorrowedItems()
  }, [])

  const filteredItems = items.filter(item =>
    (item.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.office_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.borrowed_by || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System-Wide Borrowed Assets</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Tracking all equipment currently deployed across municipal offices</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold text-sm shadow-sm">
          <ArrowRightLeft className="w-4 h-4" /> Live Tracking
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative group w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by S/N, name, or office..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full sm:w-72 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Displaying {filteredItems.length} active borrows</span>
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Items</th>
                <th className="px-6 py-4">Serial Number</th>
                <th className="px-6 py-4">Original Owner</th>
                <th className="px-6 py-4">Current Borrower</th>
                <th className="px-6 py-4">Assigned Date</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-110 transition-transform">
                        <Package className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-700">{t.product_name}</p>
                        <p className="text-[10px] font-semibold text-slate-500">{t.product_type} • {t.product_model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {t.serial_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-bold text-slate-700">{t.office_name || t.office_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                       <span className="font-black text-amber-600 uppercase text-[11px] tracking-tight">{t.borrowed_by}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {t.transaction_date ? t.transaction_date.split('T')[0] : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase ${t.quality === 'New' || t.quality === 'Good Condition' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'}`}>
                      {t.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Synchronizing active logs...</p>
            </div>
          ) : filteredItems.length === 0 && (
            <div className="p-20 text-center bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <ArrowRightLeft className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-900 font-black text-xl">Zero Active Borrows</p>
              <p className="text-slate-500 text-sm mt-2 max-w-[320px] mx-auto font-medium leading-relaxed">All system assets are currently stationed within their respective parent offices.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
