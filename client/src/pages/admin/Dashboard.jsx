import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, UserPlus, GraduationCap, Clock, TrendingUp } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [students, setStudents] = useState([])
  const [feeSummary, setFeeSummary] = useState({ monthlyData: [] })

  useEffect(() => {
    axios.get('/api/leads').then(r => setLeads(r.data)).catch(() => {})
    axios.get('/api/students').then(r => setStudents(r.data)).catch(() => {})
    axios.get('/api/fees/summary').then(r => setFeeSummary(r.data)).catch(() => {})
  }, [])

  const today = new Date().toDateString()
  const todayLeads = leads.filter(l => new Date(l.createdAt).toDateString() === today)
  const converted = leads.filter(l => l.status === 'Converted')
  const pending = leads.filter(l => l.status === 'New' || l.status === 'Contacted')

  // Lead temperatures
  const now = Date.now()
  const hot = leads.filter(l => {
    const age = now - new Date(l.createdAt).getTime()
    return age < 86400000 && l.status !== 'Converted' && l.status !== 'Not Interested'
  })
  const warm = leads.filter(l => l.status === 'Interested')
  const cold = leads.filter(l => {
    const age = now - new Date(l.createdAt).getTime()
    return age > 259200000 && l.status !== 'Converted' && l.status !== 'Not Interested'
  })

  const recentLeads = [...leads].slice(0, 5)

  const formatCurrency = (n) => '₹' + (n || 0).toLocaleString('en-IN')

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard <span className="text-gold">Overview</span></h1>
        <p className="text-muted">Welcome back! Here's what's happening at ForgeEdu.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-lg">
        <div className="stat-card">
          <div className="stat-icon"><Users size={22} /></div>
          <div className="stat-value">{leads.length}</div>
          <div className="stat-label">Total Inquiries</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}><UserPlus size={22} /></div>
          <div className="stat-value">{todayLeads.length}</div>
          <div className="stat-label">Today's Inquiries</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}><GraduationCap size={22} /></div>
          <div className="stat-value">{converted.length}</div>
          <div className="stat-label">Converted Students</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}><Clock size={22} /></div>
          <div className="stat-value">{pending.length}</div>
          <div className="stat-label">Pending Follow-ups</div>
        </div>
      </div>

      {/* Lead Temperature */}
      <div className="lead-temp-section mb-lg">
        <h3>Lead Temperature</h3>
        <div className="temp-pills">
          <div className="temp-pill hot">🔴 Hot <span>{hot.length}</span></div>
          <div className="temp-pill warm">🟡 Warm <span>{warm.length}</span></div>
          <div className="temp-pill cold">🔵 Cold <span>{cold.length}</span></div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="activity-feed">
            {recentLeads.length === 0 && <p className="text-muted fs-sm">No recent activity</p>}
            {recentLeads.map((lead, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-dot" />
                <div className="activity-info">
                  <span className="fw-600">{lead.studentName}</span>
                  <span className="text-muted fs-sm"> — {lead.course} · {lead.city}</span>
                </div>
                <span className="activity-time">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card">
          <h3 className="card-title"><TrendingUp size={18} className="text-gold" /> Monthly Revenue</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={feeSummary.monthlyData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v => '₹' + (v / 1000) + 'k'} />
                <Tooltip
                  contentStyle={{ background: '#1f2937', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', color: '#f9fafb' }}
                  formatter={(value) => ['₹' + value.toLocaleString('en-IN'), 'Collection']}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
