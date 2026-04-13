import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminTransactions from './pages/AdminTransactions'
import AdminItems from './pages/AdminItems'
import AdminSuppliers from './pages/AdminSuppliers'
import AdminOffices from './pages/AdminOffices'
import AdminDefectiveItems from './pages/AdminDefectiveItems'
import AdminBorrowed from './pages/AdminBorrowed'
import OfficeDashboard from './pages/OfficeDashboard'
import OfficeTransactions from './pages/OfficeTransactions'
import OfficeItems from './pages/OfficeItems'
import OfficeDefectiveItems from './pages/OfficeDefectiveItems'
import OfficeBorrowed from './pages/OfficeBorrowed'
import Layout from './components/Layout'
import { ToastProvider } from './context/ToastContext'
import { ConfirmProvider } from './context/ConfirmContext'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes inside Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/login" replace />} />
                
                {/* Main Administrator Routes */}
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/transactions" element={<AdminTransactions />} />
                <Route path="admin/items" element={<AdminItems />} />
                <Route path="admin/suppliers" element={<AdminSuppliers />} />
                <Route path="admin/offices" element={<AdminOffices />} />
                <Route path="admin/defective" element={<AdminDefectiveItems />} />
                <Route path="admin/borrowed" element={<AdminBorrowed />} />

                {/* Individual Office Route */}
                <Route path="office" element={<OfficeDashboard />} />
                <Route path="office/transactions" element={<OfficeTransactions />} />
                <Route path="office/items" element={<OfficeItems />} />
                <Route path="office/defective" element={<OfficeDefectiveItems />} />
                <Route path="office/borrowed" element={<OfficeBorrowed />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </ConfirmProvider>
    </ToastProvider>
  )
}

export default App
