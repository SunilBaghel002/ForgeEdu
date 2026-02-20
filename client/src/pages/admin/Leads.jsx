import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Search, Filter, X, MessageSquare } from 'lucide-react'
import './Leads.css'

const statusColors = {
  'New': 'badge-new', 'Contacted': 'badge-contacted',
  'Interested': 'badge-interested', 'Not Interested': 'badge-not-interested',
  'Converted': 'badge-converted'
}

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [notes, setNotes] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => { fetchLeads() }, [filterStatus, filterCourse])

  const fetchLeads = async () => {
    try {
      const params = {}
      if (filterStatus) params.status = filterStatus
      if (filterCourse) params.course = filterCourse
      const { data } = await axios.get('/api/leads', { params })
      setLeads(data)
    } catch { toast.error('Failed to load leads') }
  }

  const openPanel = (lead) => {
    setSelected(lead)
    setNotes(lead.notes || '')
    setNewStatus(lead.status)
  }

  const updateLead = async () => {
    try {
      await axios.patch(`/api/leads/${selected._id}`, { status: newStatus, notes })
      toast.success('Lead updated!')
      setSelected(null)
      fetchLeads()
    } catch { toast.error('Update failed') }
  }

  return (
    <div className="leads-page">
      <div className="page-header">
        <h1>Lead <span className="text-gold">Management</span></h1>
        <p className="text-muted">Track and manage all student inquiries</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <Filter size={16} className="text-muted" />
        <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Converted">Converted</option>
        </select>
        <select className="form-select" value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
          <option value="">All Courses</option>
          <option value="Foundation">Foundation</option>
          <option value="IIT-JEE">IIT-JEE</option>
          <option value="NEET">NEET</option>
          <option value="Crash Course">Crash Course</option>
        </select>
        {(filterStatus || filterCourse) && (
          <button className="btn btn-sm btn-secondary" onClick={() => { setFilterStatus(''); setFilterCourse('') }}>Clear Filters</button>
        )}
        <span className="text-muted fs-sm" style={{ marginLeft: 'auto' }}>{leads.length} leads</span>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Class</th><th>Phone</th><th>Course</th><th>City</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead._id} onClick={() => openPanel(lead)} className="clickable-row">
                <td className="fw-600">{lead.studentName}</td>
                <td>{lead.class}</td>
                <td>{lead.phone}</td>
                <td>{lead.course}</td>
                <td>{lead.city}</td>
                <td><span className={`badge ${statusColors[lead.status]}`}>{lead.status}</span></td>
                <td className="text-muted fs-sm">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>No leads found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-out panel */}
      {selected && (
        <>
          <div className="slide-panel-overlay" onClick={() => setSelected(null)} />
          <div className="slide-panel">
            <div className="modal-header">
              <h3 className="modal-title">Lead Details</h3>
              <button className="btn-icon" onClick={() => setSelected(null)}><X size={18} /></button>
            </div>

            <div className="lead-detail-grid">
              <div className="detail-row"><span className="detail-label">Student</span><span>{selected.studentName}</span></div>
              <div className="detail-row"><span className="detail-label">Parent</span><span>{selected.parentName}</span></div>
              <div className="detail-row"><span className="detail-label">Phone</span><span>{selected.phone}</span></div>
              <div className="detail-row"><span className="detail-label">Class</span><span>{selected.class}</span></div>
              <div className="detail-row"><span className="detail-label">Course</span><span>{selected.course}</span></div>
              <div className="detail-row"><span className="detail-label">City</span><span>{selected.city}</span></div>
              <div className="detail-row"><span className="detail-label">Date</span><span>{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
            </div>

            <div className="form-group mt-lg">
              <label className="form-label">Update Status</label>
              <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Not Interested">Not Interested</option>
                <option value="Converted">Converted</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this lead..." />
            </div>

            <div className="flex gap-sm">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={updateLead}>Save Changes</button>
              <a href={`https://wa.me/91${selected.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                <MessageSquare size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
