import { useState, useEffect } from 'react'
import { Search, Filter, Package, ArrowRightLeft, Building2, UserCheck } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function OfficeBorrowed() {
  const { showToast } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const userOffice = localStorage.getItem('userOffice') || 'Unknown Office'

  const fetchBorrowedItems = () => {
    // We use the same office-filtering logic as the transaction log
    fetch(`/api/transactions/office?office=${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => { 
        // Filter for items where THIS office IS the borrower 
        const itemsWeBorrowed = data.filter(t => {
           const b = t.borrowed_by;
           // We are the borrower IF our office name is in borrowed_by AND it's not a return record
           return b === userOffice && !b.includes('(Returned)');
        });
        setItems(itemsWeBorrowed); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        showToast("Could not load your borrowed items", "error");
      })
  }

  useEffect(() => {
    fetchBorrowedItems()
  }, [userOffice])

  const filteredItems = items.filter(item =>
    (item.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.serial_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.office_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Assets Borrowed by {userOffice}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">List of items your department is currently utilizing from other offices</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl font-bold text-sm shadow-sm">
          <ArrowRightLeft className="w-4 h-4" /> Usage Tracking
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative group w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by S/N or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full sm:w-72 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Total active borrows: {filteredItems.length}</span>
            <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg transition-colors shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl text-indigo-600 font-bold">Items</th>
                <th className="px-6 py-4">Serial / Tag</th>
                <th className="px-6 py-4">Lender Office</th>
                <th className="px-6 py-4">Status / Quality</th>
                <th className="px-6 py-4">Assigned Date</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((t) => (
                <tr key={t.transaction_id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                        <Package className="w-4.5 h-4.5 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-700">{t.product_name}</p>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">{t.product_type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] font-black text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      {t.serial_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                       <span className="font-bold text-slate-800">{t.office_name || t.office_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${t.quality === 'New' || t.quality === 'Good Condition' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {t.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-bold text-xs italic">
                    {t.transaction_date ? t.transaction_date.split('T')[0] : 'Historical Log'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-600">
                       <UserCheck className="w-4 h-4" />
                       <span className="text-[10px] font-bold">In Possession</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading ? (
             <div className="p-16 text-center">
               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
               <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Scanning department usage logs...</p>
             </div>
          ) : filteredItems.length === 0 && (
            <div className="p-20 text-center bg-slate-50/50">
              <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                <ArrowRightLeft className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-900 font-black text-xl">No Borrowed Assets</p>
              <p className="text-slate-500 text-sm mt-3 max-w-[320px] mx-auto font-medium leading-relaxed">Your office is currently only utilizing internally owned inventory equipment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
