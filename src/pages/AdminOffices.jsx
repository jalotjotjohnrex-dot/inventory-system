import { useState, useEffect } from 'react'
import { Users, Building2, ExternalLink, Package } from 'lucide-react'
import { useToast } from '../context/ToastContext'

export default function AdminOffices() {
  const { showToast } = useToast()
  const [offices, setOffices] = useState([])

  useEffect(() => {
    fetch('/api/offices/stats')
      .then(res => res.json())
      .then(data => setOffices(data))
      .catch(err => {
        console.error(err);
        showToast("Failed to fetch office statistics", "error");
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Offices</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Complete breakdown of all 24 departments and their linked items</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden p-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
          {offices.map((office) => (
            <div key={office.office_name} className="group border border-slate-200 hover:border-indigo-300 rounded-xl p-4 bg-white hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-indigo-50 border border-slate-100 group-hover:border-indigo-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-indigo-700 transition-colors">{office.office_name}</h3>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> Account Active
              </p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Package className="w-3.5 h-3.5" /> Total Items</span>
                <span className="text-sm font-extrabold text-slate-900 bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 px-2 py-0.5 rounded transition-colors">
                  {office.total_items}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
