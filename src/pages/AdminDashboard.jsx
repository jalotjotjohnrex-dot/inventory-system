import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Package, ArrowUpRight, TrendingUp, MoreHorizontal, ArrowRight, ClipboardList, AlertTriangle } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalSystemItems: 0,
    totalTransactions: 0,
    stockedAvailable: 0,
    totalBorrowed: 0,
    totalDefective: 0
  })

  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // 1. Fetch Global Summary Stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err))

    // 2. Fetch Global Recent Transactions
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err))


  }, [])

  const SUMMARY_CARDS = [
    { title: 'Total System Items', value: stats.totalSystemItems, icon: Package, color: 'indigo', desc: 'Across all offices', path: '/admin/items' },
    { title: 'Total Transactions', value: stats.totalTransactions, icon: ClipboardList, color: 'slate', desc: 'Recorded movements', path: '/admin/transactions' },
    { title: 'Stocked (Available)', value: stats.stockedAvailable, icon: TrendingUp, color: 'emerald', desc: 'Currently in offices', path: '/admin/items' },
    { title: 'Total Borrowed', value: stats.totalBorrowed, icon: 'IndigoIcon', color: 'indigo_light', desc: 'Out of office', path: '/admin/borrowed' },
    { title: 'Total Defective', value: stats.totalDefective, icon: AlertTriangle, color: 'rose', desc: 'Broken or maintenance', path: '/admin/defective' },
  ]
  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {SUMMARY_CARDS.map((card) => {
          const Icon = card.icon === 'IndigoIcon' ? Package : card.icon
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
            <div 
              key={card.title} 
              onClick={() => navigate(card.path)}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
            >
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

      <div className="h-[500px]">
        {/* Recent Transactions Preview */}
        <div className="h-full bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900 z-10 relative">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Recent Transactions</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">Latest items checked in or out across all offices</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
             {transactions.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                  <ClipboardList className="w-10 h-10 mb-3 opacity-20" />
                  <p className="text-sm font-bold text-slate-500">No global transactions traced.</p>
               </div>
             ) : (
                transactions.slice(0, 15).map((t, index) => (
                   <div key={index} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                       <Package className="w-5 h-5" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between">
                         <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{t.product_name}</h4>
                         <p className="text-xs font-bold text-slate-900">{t.transaction_date}</p>
                       </div>
                       <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                             S/N: <span className="font-mono text-slate-700 font-bold">{t.serial_number}</span> 
                             {t.property_number && (
                               <>
                                 <span className="text-slate-200">|</span>
                                 P/N: <span className="font-mono text-indigo-600 font-extrabold">{t.property_number}</span>
                               </>
                             )}
                             <span className="text-slate-200 ml-1">●</span>
                             <span className="text-indigo-600 font-bold tracking-tight">{t.office_name}</span>
                           </p>
                         <p className={`text-[10px] font-bold uppercase ${t.quality === 'New' || t.quality === 'Good Condition' ? 'text-emerald-500' : 'text-rose-500'}`}>{t.quality}</p>
                       </div>
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
