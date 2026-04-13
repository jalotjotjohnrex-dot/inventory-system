import { Bell, Search, UserCircle, Command, Grip, X, Clock } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { useState } from 'react'

export default function Header() {
  const location = useLocation()
  
  const userOffice = localStorage.getItem('userOffice') || 'Unknown User'
  const userRole = localStorage.getItem('userRole') || 'guest'

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes('/admin/offices')) return 'Manage Offices'
    if (path.includes('/transactions')) return 'Transactions'
    if (path.includes('/settings')) return 'System Settings'
    if (path.includes('/items')) return userRole === 'admin' ? 'Available Items Overview' : 'Active Hardware'
    if (path.includes('/admin')) return 'System Dashboard'
    return 'Office Dashboard'
  }

  const getPageSubtitle = () => {
    const path = location.pathname
    if (path.includes('/items')) return userRole === 'admin' ? 'System-wide available non-borrowed assets' : 'Review the live condition and status of assigned material'
    if (path.includes('/admin')) return 'Real-time insight across all departments'
    return 'Your department inventory metrics'
  }

  const { notifications, unreadCount, markAllAsRead } = useNotifications()
  const [showNotif, setShowNotif] = useState(false)

  const title = getPageTitle()
  const subtitle = getPageSubtitle()

  return (
    <header className="h-24 px-8 flex items-center justify-between z-10 w-full bg-transparent mt-2">
      <div className="flex flex-col animate-slide-up">
        {title && <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-5 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:border-indigo-300 hover:bg-slate-50 transition-all text-slate-600 relative group"
          >
            <Bell className="w-5 h-5 group-hover:text-indigo-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold rounded-lg border-2 border-white shadow-sm animate-bounce group-hover:scale-110 transition-transform">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div 
              className="absolute right-0 mt-4 w-96 rounded-2xl border border-slate-200 shadow-[0_30px_60px_rgba(0,0,0,0.3)] p-0 overflow-hidden notification-tray-solid"
              style={{ 
                backgroundColor: '#ffffff', 
                background: '#ffffff', 
                opacity: 1, 
                zIndex: 99999,
                position: 'absolute',
                display: 'block'
              }}
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50" style={{ backgroundColor: '#f8fafc' }}>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Alert Notifications</h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 tracking-wide uppercase">Department Feed</p>
                </div>
                <button onClick={() => setShowNotif(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-rose-500 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-2 max-h-[440px] overflow-y-auto bg-white" style={{ backgroundColor: 'white' }}>
                <div className="space-y-1.5 pt-1">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.notification_id} className="p-4 bg-white border border-transparent hover:border-slate-100 hover:bg-slate-50/50 rounded-xl transition-all group !opacity-100">
                        <div className="flex items-start gap-3.5">
                          <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 border border-slate-100/50">
                                <Clock className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">{n.transaction_date}</span>
                              </div>
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                         <Bell className="w-7 h-7 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">All caught up</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-[180px] mx-auto">You've seen all recent transaction alerts for your portal.</p>
                    </div>
                  )}
                </div>
              </div>

              {unreadCount > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 pt-3">
                  <button 
                    onClick={() => { markAllAsRead(); setShowNotif(false); }}
                    className="w-full py-2.5 text-[11px] font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Mark all as cleared
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 cursor-pointer group bg-white border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-1.5 pr-4 rounded-xl hover:border-indigo-200 transition-all">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-inner">
             <span className="font-bold text-sm">
               {userRole === 'admin' ? 'AD' : userOffice.substring(0,2).toUpperCase()}
             </span>
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
              {userRole === 'admin' ? 'Administrator' : userOffice}
            </p>
            <p className="text-[11px] font-medium text-slate-500 leading-none capitalize">{userRole} Account</p>
          </div>
        </div>
      </div>
    </header>
  )
}
