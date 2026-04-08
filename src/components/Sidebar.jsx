import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Building2, LogOut, Database, Users } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()
  
  // This is a placeholder for actual auth logic
  const isAdmin = location.pathname.includes('admin')
  const baseUrl = isAdmin ? '/admin' : '/office'

  const links = [
    { name: 'Dashboard', path: baseUrl, icon: LayoutDashboard },
    { name: 'Inventory Base', path: `${baseUrl}/transactions`, icon: Database },
    { name: 'Items', path: `${baseUrl}/items`, icon: Package },
    { name: 'Defective Items', path: `${baseUrl}/defective`, icon: Package },
    ...(isAdmin ? [{ name: 'Suppliers', path: '/admin/suppliers', icon: Building2 }] : []),
    ...(isAdmin ? [{ name: 'Offices', path: '/admin/offices', icon: Users }] : []),
  ]

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 transition-all duration-300 relative overflow-hidden backdrop-blur-xl">

      <div>
        <div className="h-24 flex items-center justify-start px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 tracking-wide">Optima<span className="text-indigo-600">Track</span></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Inventory System</span>
            </div>
          </div>
        </div>
        
        <div className="px-5 py-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Menu</div>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'text-indigo-700 bg-indigo-50 shadow-sm border border-indigo-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_2px_rgba(99,102,241,0.2)]"></div>
                  )}
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600 group-hover:scale-110'}`} />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="p-5 border-t border-slate-100">

        <Link 
          to="/login"
          onClick={() => localStorage.clear()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  )
}
