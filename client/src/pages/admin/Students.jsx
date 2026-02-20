import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, X, Eye } from 'lucide-react'
import './Students.css'

export default function Students() {
  const [students, setStudents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', course: '', batch: '', startDate: '', totalFees: '', paymentSchedule: 'Monthly', parentName: '', phone: '' })

  useEffect(() => { fetchStudents() }, [])

  const fetchStudents = async () => {
    try { const { data } = await axios.get('/api/students'); setStudents(data) }
    catch { toast.error('Failed to load students') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/students', { ...form, totalFees: Number(form.totalFees) })
      toast.success('Student added!')
      setShowForm(false)
      setForm({ name: '', course: '', batch: '', startDate: '', totalFees: '', paymentSchedule: 'Monthly', parentName: '', phone: '' })
      fetchStudents()
    } catch { toast.error('Failed to add student') }
  }

  const formatCurrency = (n) => '₹' + (n || 0).toLocaleString('en-IN')

  return (
    <div className="students-page">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1>Student <span className="text-gold">Management</span></h1>
          <p className="text-muted">Manage enrolled students and track their progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={18} /> Add Student</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Course</th><th>Batch</th><th>Total Fees</th><th>Paid</th><th>Remaining</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {students.map(s => {
              const remaining = s.totalFees - s.paidAmount
              const pct = Math.round((s.paidAmount / s.totalFees) * 100)
              return (
                <tr key={s._id}>
                  <td className="fw-600">{s.name}</td>
                  <td>{s.course}</td>
                  <td>{s.batch}</td>
                  <td>{formatCurrency(s.totalFees)}</td>
                  <td className="text-success">{formatCurrency(s.paidAmount)}</td>
                  <td className={remaining > 0 ? 'text-danger' : 'text-success'}>{formatCurrency(remaining)}</td>
                  <td>
                    <span className={`badge ${pct >= 100 ? 'badge-success' : pct >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                      {pct >= 100 ? 'Paid' : `${pct}% Paid`}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/students/${s._id}`} className="btn-icon"><Eye size={16} /></Link>
                  </td>
                </tr>
              )
            })}
            {students.length === 0 && (
              <tr><td colSpan="8" className="text-center text-muted" style={{ padding: '40px' }}>No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Student</h3>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Parent Name</label><input className="form-input" value={form.parentName} onChange={e => setForm({...form, parentName: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Course *</label>
                <select className="form-select" required value={form.course} onChange={e => setForm({...form, course: e.target.value})}>
                  <option value="">Select</option><option>Foundation</option><option>IIT-JEE</option><option>NEET</option><option>Crash Course</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Batch *</label><input className="form-input" required value={form.batch} onChange={e => setForm({...form, batch: e.target.value})} placeholder="e.g. JEE-2026-A" /></div>
              <div className="form-group"><label className="form-label">Start Date *</label><input type="date" className="form-input" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Total Fees (₹) *</label><input type="number" className="form-input" required value={form.totalFees} onChange={e => setForm({...form, totalFees: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Payment Schedule</label>
                <select className="form-select" value={form.paymentSchedule} onChange={e => setForm({...form, paymentSchedule: e.target.value})}>
                  <option>Monthly</option><option>Quarterly</option><option>Lump Sum</option>
                </select>
              </div>
              <button className="btn btn-primary w-full mt-md" type="submit">Add Student</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
