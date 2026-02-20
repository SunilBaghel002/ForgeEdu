import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { IndianRupee, Clock, AlertTriangle, CalendarDays, MessageSquare, X } from 'lucide-react'
import './Fees.css'

export default function Fees() {
  const [summary, setSummary] = useState({ totalCollected: 0, totalPending: 0, overdueCount: 0, thisMonthCollection: 0, monthlyData: [] })
  const [overdue, setOverdue] = useState([])
  const [reminderModal, setReminderModal] = useState(null)

  useEffect(() => {
    axios.get('/api/fees/summary').then(r => setSummary(r.data)).catch(() => {})
    axios.get('/api/fees/overdue').then(r => setOverdue(r.data)).catch(() => {})
  }, [])

  const formatCurrency = (n) => '₹' + (n || 0).toLocaleString('en-IN')

  const openReminder = (student) => {
    const msg = `Dear ${student.parentName || 'Parent'}, this is a reminder that ${formatCurrency(student.dueAmount)} fees for ${student.name} is due since ${new Date(student.dueSince).toLocaleDateString('en-IN')}. Please pay at the earliest. – ForgeEdu Team`
    setReminderModal({ student, msg, phone: student.phone || '9999999999' })
  }

  return (
    <div className="fees-page">
      <div className="page-header">
        <h1>Fee <span className="text-gold">Tracking</span></h1>
        <p className="text-muted">Monitor fee collection, pending dues, and overdue payments</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-lg">
        <div className="stat-card">
          <div className="stat-icon"><IndianRupee size={22} /></div>
          <div className="stat-value">{formatCurrency(summary.totalCollected)}</div>
          <div className="stat-label">Total Collected</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}><Clock size={22} /></div>
          <div className="stat-value">{formatCurrency(summary.totalPending)}</div>
          <div className="stat-label">Pending Fees</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}><AlertTriangle size={22} /></div>
          <div className="stat-value">{summary.overdueCount}</div>
          <div className="stat-label">Overdue Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}><CalendarDays size={22} /></div>
          <div className="stat-value">{formatCurrency(summary.thisMonthCollection)}</div>
          <div className="stat-label">This Month</div>
        </div>
      </div>

      {/* Chart */}
      <div className="card mb-lg">
        <h3 className="card-title">Monthly Fee Collection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v => '₹' + (v / 1000) + 'k'} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#f9fafb' }} formatter={(v) => ['₹' + v.toLocaleString('en-IN'), 'Collected']} />
            <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Overdue Table */}
      <div className="card">
        <h3 className="card-title"><AlertTriangle size={18} className="text-danger" /> Overdue Students</h3>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Course</th><th>Due Amount</th><th>Due Since</th><th>Action</th></tr></thead>
            <tbody>
              {overdue.map(s => (
                <tr key={s._id}>
                  <td className="fw-600">{s.name}</td>
                  <td>{s.course}</td>
                  <td className="text-danger fw-600">{formatCurrency(s.dueAmount)}</td>
                  <td className="text-muted fs-sm">{new Date(s.dueSince).toLocaleDateString('en-IN')}</td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => openReminder(s)}><MessageSquare size={14} /> Send Reminder</button></td>
                </tr>
              ))}
              {overdue.length === 0 && <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '30px' }}>No overdue payments 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Modal */}
      {reminderModal && (
        <div className="modal-overlay" onClick={() => setReminderModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Send Reminder</h3>
              <button className="btn-icon" onClick={() => setReminderModal(null)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Message Preview</label>
              <textarea className="form-textarea" rows={5} value={reminderModal.msg} readOnly />
            </div>
            <a
              href={`https://wa.me/91${reminderModal.phone}?text=${encodeURIComponent(reminderModal.msg)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary w-full"
              style={{ justifyContent: 'center', background: '#25D366' }}
            >
              <MessageSquare size={18} /> Open in WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
