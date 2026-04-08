import { useState, useEffect } from 'react'
import { Package, ArrowUpRight, TrendingUp, ClipboardList, AlertTriangle, Box } from 'lucide-react'

export default function OfficeDashboard() {
  const [transactions, setTransactions] = useState([])
  const [items, setItems] = useState([])

  const [stats, setStats] = useState({
    totalSystemItems: 0,
    totalTransactions: 0,
    stockedAvailable: 0,
    totalBorrowed: 0,
    totalDefective: 0
  })

  const userOffice = localStorage.getItem('userOffice') || 'Unknown Office'

  useEffect(() => {
    // 1. Fetch mathematically correct backend stat block
    // Using query param to avoid URL routing issues with spaces/apostrophes
    fetch(`/api/stats?office=${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching office stats:", err))

    // 2. Fetch local transactions (For UI preview panes only)
    fetch(`/api/transactions/office?office=${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err))

    // 3. Fetch local active items baseline (server-side filtered)
    fetch(`/api/items/available?office=${encodeURIComponent(userOffice)}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err))
  }, [userOffice])

  const SUMMARY_CARDS = [
    { title: 'Total System Items', value: stats.totalSystemItems, icon: Package, color: 'indigo', desc: `Total ${userOffice} stock` },
    { title: 'Total Transactions', value: stats.totalTransactions, icon: ClipboardList, color: 'slate', desc: 'Department logbook' },
    { title: 'Stocked (Available)', value: stats.stockedAvailable, icon: TrendingUp, color: 'emerald', desc: `Currently inside ${userOffice}` },
    { title: 'Total Borrowed', value: stats.totalBorrowed, icon: ArrowUpRight, color: 'indigo_light', desc: 'Deployed temporary loans' },
    { title: 'Total Defective', value: stats.totalDefective, icon: AlertTriangle, color: 'rose', desc: 'Broken or maintenance' },
  ]

  return (
    <div className="space-y-6">

      {/* Metric Cards - Exact replica of Admin Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon
          const colorStyles = {
            indigo: 'from-indigo-600/20 to-indigo-600/5 text-indigo-700 border-indigo-200 bg-indigo-50/30',
            slate: 'from-slate-600/20 to-slate-600/5 text-slate-700 border-slate-200 bg-slate-50/30',
            emerald: 'from-emerald-600/20 to-emerald-600/5 text-emerald-700 border-emerald-200 bg-emerald-50/30',
            rose: 'from-rose-600/20 to-rose-600/5 text-rose-700 border-rose-200 bg-rose-50/30',
            indigo_light: 'from-indigo-400/20 to-indigo-400/5 text-indigo-500 border-indigo-100 bg-indigo-50/10',
          }[card.color]

          const iconBg = {
            indigo: 'bg-indigo-600 shadow-indigo-600/20',
            slate: 'bg-slate-700 shadow-slate-700/20',
            emerald: 'bg-emerald-600 shadow-emerald-600/20',
            rose: 'bg-rose-600 shadow-rose-600/20',
            indigo_light: 'bg-indigo-400 shadow-indigo-400/20',
          }[card.color]

          return (
            <div key={card.title} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-slate-300 transition-colors">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorStyles} rounded-bl-[100px] -z-0 opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>

              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl text-white ${iconBg} shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">{card.value}</h3>
                <p className="text-sm font-bold text-slate-800 mb-0.5">{card.title}</p>
                <p className="text-xs font-medium text-slate-500">{card.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[500px]">
        {/* Recent Transactions Preview */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900 z-10 relative">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Recent Transactions</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Latest items handled by {userOffice}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {transactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <ClipboardList className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-bold text-slate-500">No recent transactions traced.</p>
              </div>
            ) : (
              transactions.slice(0, 6).map((t, index) => {
                const isExternalBorrower = t.borrowed_by === userOffice;
                return (
                  <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Box className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{t.product_name}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-1">S/N: <span className="font-mono">{t.serial_number}</span></p>
                      {isExternalBorrower && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[9px] font-bold w-fit shadow-sm uppercase tracking-wider mt-0.5">
                          <Box className="w-2.5 h-2.5" /> Borrowed: {t.office_name || t.office_id}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{t.transaction_date}</p>
                      <p className={`text-[10px] font-bold uppercase mt-1 ${t.quality === 'New' || t.quality === 'Good Condition' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.quality}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Condition State Overview Preview */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden relative">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-sky-400 to-indigo-500"></div>
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold tracking-tight text-slate-900">Assigned Hardware State</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Package className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-bold text-slate-500">No physical hardware assigned.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.product_name}</h4>
                    <p className="text-xs font-medium text-slate-500 capitalize">{item.product_type} • S/N: {item.serial_number}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">Qty: {item.quantity}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border shadow-sm ${item.quality === 'New' || item.quality === 'Good Condition' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {item.quality}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
