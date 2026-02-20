import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, X, CreditCard } from 'lucide-react'
import './StudentProfile.css'

export default function StudentProfile() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [payForm, setPayForm] = useState({ amount: '', date: '', mode: 'UPI' })

  useEffect(() => { fetchStudent() }, [id])

  const fetchStudent = async () => {
    try { const { data } = await axios.get(`/api/students/${id}`); setStudent(data) }
    catch { toast.error('Failed to load student') }
  }

  const addPayment = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`/api/students/${id}/payments`, { ...payForm, amount: Number(payForm.amount) })
      toast.success('Payment recorded & receipt generated!')
      setShowPayment(false)
      setPayForm({ amount: '', date: '', mode: 'UPI' })
      fetchStudent()
    } catch { toast.error('Failed to record payment') }
  }

  if (!student) return <div className="text-center text-muted" style={{ padding: 60 }}>Loading...</div>

  const remaining = student.totalFees - student.paidAmount
  const pct = Math.round((student.paidAmount / student.totalFees) * 100)
  const initials = student.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const formatCurrency = (n) => '₹' + (n || 0).toLocaleString('en-IN')

  return (
    <div className="profile-page">
      <Link to="/admin/students" className="back-link"><ArrowLeft size={16} /> Back to Students</Link>

      {/* Profile Header */}
      <div className="profile-header card">
        <div className="avatar avatar-xl" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{initials}</div>
        <div className="profile-info">
          <h2>{student.name}</h2>
          <p className="text-muted">{student.course} · {student.batch}</p>
          <p className="fs-sm text-muted">Started: {new Date(student.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowPayment(true)}><Plus size={18} /> Add Payment</button>
      </div>

      {/* Fee Progress */}
      <div className="card mb-lg">
        <h3 className="card-title"><CreditCard size={18} className="text-gold" /> Fee Progress</h3>
        <div className="fee-summary">
          <div><span className="text-muted fs-sm">Total Fees</span><div className="fw-600">{formatCurrency(student.totalFees)}</div></div>
          <div><span className="text-muted fs-sm">Paid</span><div className="fw-600 text-success">{formatCurrency(student.paidAmount)}</div></div>
          <div><span className="text-muted fs-sm">Remaining</span><div className={`fw-600 ${remaining > 0 ? 'text-danger' : 'text-success'}`}>{formatCurrency(remaining)}</div></div>
        </div>
        <div className="progress-bar mt-md">
          <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <p className="text-muted fs-sm mt-sm text-center">{pct}% Complete</p>
      </div>

      {/* Payment History */}
      <div className="card">
        <h3 className="card-title">Payment History</h3>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Amount</th><th>Mode</th><th>Receipt</th></tr></thead>
            <tbody>
              {student.payments && student.payments.map((p, i) => (
                <tr key={i}>
                  <td>{new Date(p.date).toLocaleDateString('en-IN')}</td>
                  <td className="fw-600 text-success">{formatCurrency(p.amount)}</td>
                  <td><span className="badge badge-info">{p.mode}</span></td>
                  <td>{p.receiptId ? <Link to="/admin/receipts" className="text-gold fs-sm">View Receipt</Link> : '—'}</td>
                </tr>
              ))}
              {(!student.payments || student.payments.length === 0) && (
                <tr><td colSpan="4" className="text-center text-muted" style={{ padding: '30px' }}>No payments recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Payment</h3>
              <button className="btn-icon" onClick={() => setShowPayment(false)}><X size={18} /></button>
            </div>
            <form onSubmit={addPayment}>
              <div className="form-group"><label className="form-label">Amount (₹) *</label><input type="number" className="form-input" required value={payForm.amount} onChange={e => setPayForm({...payForm, amount: e.target.value})} placeholder="Enter amount" /></div>
              <div className="form-group"><label className="form-label">Date *</label><input type="date" className="form-input" required value={payForm.date} onChange={e => setPayForm({...payForm, date: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Payment Mode *</label>
                <select className="form-select" value={payForm.mode} onChange={e => setPayForm({...payForm, mode: e.target.value})}>
                  <option>Cash</option><option>UPI</option><option>Cheque</option><option>NEFT</option>
                </select>
              </div>
              <button className="btn btn-primary w-full mt-md" type="submit">Record Payment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
