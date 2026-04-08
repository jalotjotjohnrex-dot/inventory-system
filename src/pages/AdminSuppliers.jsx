import { useState, useEffect } from 'react'
import { Search, Building2, MapPin, Phone, Mail, PlusCircle, Trash2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useConfirm } from '../context/ConfirmContext'

export default function AdminSuppliers() {
  const { showToast } = useToast()
  const confirm = useConfirm()
  const [suppliers, setSuppliers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', contact_number: '', organization: '', location: '' })
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSuppliers = suppliers.filter(s => {
    const search = searchQuery.toLowerCase()
    return (
      (s.name && s.name.toLowerCase().includes(search)) ||
      (s.organization && s.organization.toLowerCase().includes(search)) ||
      (s.location && s.location.toLowerCase().includes(search)) ||
      (s.contact_number && s.contact_number.toLowerCase().includes(search))
    )
  })

  const fetchSuppliers = () => {
    fetch('/api/suppliers')
      .then(res => res.json())
      .then(data => setSuppliers(data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      showToast("Supplier profile saved successfully!", "success")
      fetchSuppliers()
      setShowForm(false)
      setFormData({ name: '', contact_number: '', organization: '', location: '' })
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: 'Remove Vendor Profile',
      message: 'Are you sure you want to permanently delete this supplier? This action cannot be undone.',
      confirmText: 'Delete Supplier',
      type: 'danger'
    });
    
    if (!isConfirmed) return
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete supplier')
      showToast("Supplier removed successfully", "success")
      fetchSuppliers()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Registered Suppliers</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage vendor information attached to inventory transactions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> {showForm ? 'Cancel Form' : 'Add Supplier'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] p-6 mb-8 animate-slide-up">
          <h3 className="text-lg font-bold text-slate-900 mb-4">New Supplier Profile</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Supplier Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Contact Number</label>
              <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="(123) 456-7890" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Organization</label>
              <input type="text" name="organization" value={formData.organization} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. TechSource Corp." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. New York, NY" />
            </div>
            <div className="lg:col-span-4 flex justify-end">
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-2.5 rounded-xl font-bold transition-colors">
                Save record
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative group w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suppliers by name, contact, or location..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Vendor Details</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4">Status / Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.map((s) => (
                <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-indigo-700">{s.organization || s.name}</p>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {s.location || 'Unknown Location'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs font-medium text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {s.contact_number}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left flex items-center gap-4">
                    <span className="inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                      Active Vendor
                    </span>
                    <button onClick={() => handleDelete(s.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSuppliers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">No suppliers match your search.</div>
          )}
        </div>
      </div>
    </div>
  )
}
