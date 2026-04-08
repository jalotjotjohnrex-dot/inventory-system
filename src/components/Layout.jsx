import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden text-slate-800 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Elements for subtle texture */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-indigo-50 via-white to-sky-50 -z-10"></div>
      
      {/* Floating Sidebar Container */}
      <div className="py-4 pl-4 z-20">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <div className="relative z-[100]">
          <Header />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-8 pb-8 pt-6 animate-fade-in relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
