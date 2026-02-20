import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Plus, Trash2, Save, X, Edit } from 'lucide-react'
import './Controls.css'

export default function Controls() {
  const [tab, setTab] = useState('faculty')
  const [faculty, setFaculty] = useState([])
  const [toppers, setToppers] = useState([])
  const [siteConfig, setSiteConfig] = useState({})
  const [galleryUrl, setGalleryUrl] = useState('')

  // Forms
  const [facForm, setFacForm] = useState({ name: '', subject: '', bio: '', experience: '', photoUrl: '' })
  const [topForm, setTopForm] = useState({ name: '', exam: '', rank: '', score: '', year: '' })
  const [editFac, setEditFac] = useState(null)
  const [editTop, setEditTop] = useState(null)

  useEffect(() => {
    axios.get('/api/faculty').then(r => setFaculty(r.data)).catch(() => {})
    axios.get('/api/toppers').then(r => setToppers(r.data)).catch(() => {})
    axios.get('/api/site-config').then(r => setSiteConfig(r.data)).catch(() => {})
  }, [])

  // Faculty CRUD
  const addFaculty = async (e) => {
    e.preventDefault()
    try {
      if (editFac) {
        await axios.put(`/api/faculty/${editFac}`, { ...facForm, experience: Number(facForm.experience) })
        toast.success('Faculty updated!')
        setEditFac(null)
      } else {
        await axios.post('/api/faculty', { ...facForm, experience: Number(facForm.experience) })
        toast.success('Faculty added!')
      }
      setFacForm({ name: '', subject: '', bio: '', experience: '', photoUrl: '' })
      const { data } = await axios.get('/api/faculty')
      setFaculty(data)
    } catch { toast.error('Failed') }
  }

  const deleteFaculty = async (id) => {
    if (!confirm('Delete this faculty?')) return
    await axios.delete(`/api/faculty/${id}`)
    setFaculty(faculty.filter(f => f._id !== id))
    toast.success('Deleted!')
  }

  const startEditFac = (f) => {
    setEditFac(f._id)
    setFacForm({ name: f.name, subject: f.subject, bio: f.bio, experience: f.experience, photoUrl: f.photoUrl || '' })
  }

  // Toppers CRUD
  const addTopper = async (e) => {
    e.preventDefault()
    try {
      if (editTop) {
        await axios.put(`/api/toppers/${editTop}`, { ...topForm, year: Number(topForm.year) })
        toast.success('Topper updated!')
        setEditTop(null)
      } else {
        await axios.post('/api/toppers', { ...topForm, year: Number(topForm.year) })
        toast.success('Topper added!')
      }
      setTopForm({ name: '', exam: '', rank: '', score: '', year: '' })
      const { data } = await axios.get('/api/toppers')
      setToppers(data)
    } catch { toast.error('Failed') }
  }

  const deleteTopper = async (id) => {
    if (!confirm('Delete this topper?')) return
    await axios.delete(`/api/toppers/${id}`)
    setToppers(toppers.filter(t => t._id !== id))
    toast.success('Deleted!')
  }

  const startEditTop = (t) => {
    setEditTop(t._id)
    setTopForm({ name: t.name, exam: t.exam, rank: t.rank, score: t.score || '', year: t.year })
  }

  // Gallery
  const addGalleryImage = () => {
    if (!galleryUrl.trim()) return
    const updated = { ...siteConfig, galleryImages: [...(siteConfig.galleryImages || []), galleryUrl] }
    setSiteConfig(updated)
    setGalleryUrl('')
  }

  const removeGalleryImage = (idx) => {
    const imgs = [...(siteConfig.galleryImages || [])]
    imgs.splice(idx, 1)
    setSiteConfig({ ...siteConfig, galleryImages: imgs })
  }

  // Site Config
  const saveSiteConfig = async () => {
    try {
      await axios.patch('/api/site-config', siteConfig)
      toast.success('Website content updated!')
    } catch { toast.error('Failed to save') }
  }

  const getInitials = (name) => (name || '').split(' ').map(n => n[0]).join('').substring(0, 2)

  return (
    <div className="controls-page">
      <div className="page-header">
        <h1>Admin <span className="text-gold">Controls</span></h1>
        <p className="text-muted">Manage website content, faculty, toppers, and gallery</p>
      </div>

      <div className="tabs">
        {['faculty', 'toppers', 'gallery', 'content'].map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Faculty Manager */}
      {tab === 'faculty' && (
        <div className="controls-section">
          <form className="card mb-lg" onSubmit={addFaculty}>
            <h3 className="card-title">{editFac ? 'Edit Faculty' : 'Add Faculty'}</h3>
            <div className="controls-form-grid">
              <input className="form-input" placeholder="Name *" required value={facForm.name} onChange={e => setFacForm({...facForm, name: e.target.value})} />
              <input className="form-input" placeholder="Subject *" required value={facForm.subject} onChange={e => setFacForm({...facForm, subject: e.target.value})} />
              <input type="number" className="form-input" placeholder="Experience (years) *" required value={facForm.experience} onChange={e => setFacForm({...facForm, experience: e.target.value})} />
              <input className="form-input" placeholder="Photo URL (optional)" value={facForm.photoUrl} onChange={e => setFacForm({...facForm, photoUrl: e.target.value})} />
            </div>
            <textarea className="form-textarea mt-md" rows={2} placeholder="Short bio..." value={facForm.bio} onChange={e => setFacForm({...facForm, bio: e.target.value})} />
            <div className="flex gap-sm mt-md">
              <button className="btn btn-primary" type="submit"><Plus size={16} /> {editFac ? 'Update' : 'Add'} Faculty</button>
              {editFac && <button className="btn btn-secondary" type="button" onClick={() => { setEditFac(null); setFacForm({ name: '', subject: '', bio: '', experience: '', photoUrl: '' }) }}>Cancel</button>}
            </div>
          </form>

          <div className="controls-list">
            {faculty.map(f => (
              <div className="controls-item card" key={f._id}>
                <div className="avatar avatar-md" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{getInitials(f.name)}</div>
                <div className="controls-item-info">
                  <h4>{f.name}</h4>
                  <p className="text-muted fs-sm">{f.subject} · {f.experience} yrs</p>
                </div>
                <button className="btn-icon" onClick={() => startEditFac(f)}><Edit size={14} /></button>
                <button className="btn-icon" onClick={() => deleteFaculty(f._id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toppers Manager */}
      {tab === 'toppers' && (
        <div className="controls-section">
          <form className="card mb-lg" onSubmit={addTopper}>
            <h3 className="card-title">{editTop ? 'Edit Topper' : 'Add Topper'}</h3>
            <div className="controls-form-grid">
              <input className="form-input" placeholder="Name *" required value={topForm.name} onChange={e => setTopForm({...topForm, name: e.target.value})} />
              <select className="form-select" required value={topForm.exam} onChange={e => setTopForm({...topForm, exam: e.target.value})}>
                <option value="">Exam *</option><option>IIT-JEE</option><option>NEET</option>
              </select>
              <input className="form-input" placeholder="Rank (e.g. AIR 234) *" required value={topForm.rank} onChange={e => setTopForm({...topForm, rank: e.target.value})} />
              <input className="form-input" placeholder="Score (e.g. 310/360)" value={topForm.score} onChange={e => setTopForm({...topForm, score: e.target.value})} />
              <input type="number" className="form-input" placeholder="Year *" required value={topForm.year} onChange={e => setTopForm({...topForm, year: e.target.value})} />
            </div>
            <div className="flex gap-sm mt-md">
              <button className="btn btn-primary" type="submit"><Plus size={16} /> {editTop ? 'Update' : 'Add'} Topper</button>
              {editTop && <button className="btn btn-secondary" type="button" onClick={() => { setEditTop(null); setTopForm({ name: '', exam: '', rank: '', score: '', year: '' }) }}>Cancel</button>}
            </div>
          </form>

          <div className="controls-list">
            {toppers.map(t => (
              <div className="controls-item card" key={t._id}>
                <span className="topper-star">⭐</span>
                <div className="controls-item-info">
                  <h4>{t.name}</h4>
                  <p className="text-muted fs-sm">{t.exam} · {t.rank} · {t.year}</p>
                </div>
                <button className="btn-icon" onClick={() => startEditTop(t)}><Edit size={14} /></button>
                <button className="btn-icon" onClick={() => deleteTopper(t._id)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Manager */}
      {tab === 'gallery' && (
        <div className="controls-section">
          <div className="card mb-lg">
            <h3 className="card-title">Add Image URL</h3>
            <div className="flex gap-sm">
              <input className="form-input" placeholder="Paste image URL..." value={galleryUrl} onChange={e => setGalleryUrl(e.target.value)} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={addGalleryImage}><Plus size={16} /> Add</button>
            </div>
          </div>

          <div className="gallery-grid">
            {(siteConfig.galleryImages || []).map((url, i) => (
              <div className="gallery-item" key={i}>
                <img src={url} alt={`Gallery ${i + 1}`} onError={e => e.target.src = 'https://placehold.co/400x300/111827/f59e0b?text=Image'} />
                <button className="gallery-remove" onClick={() => removeGalleryImage(i)}><X size={14} /></button>
              </div>
            ))}
            {(!siteConfig.galleryImages || siteConfig.galleryImages.length === 0) && (
              <p className="text-muted">No gallery images added yet</p>
            )}
          </div>
          <button className="btn btn-primary mt-lg" onClick={saveSiteConfig}><Save size={16} /> Save Gallery</button>
        </div>
      )}

      {/* Website Content Editor */}
      {tab === 'content' && (
        <div className="controls-section">
          <div className="card">
            <h3 className="card-title">Website Content</h3>
            <div className="controls-form-grid">
              <div className="form-group">
                <label className="form-label">Hero Headline</label>
                <input className="form-input" value={siteConfig.heroTitle || ''} onChange={e => setSiteConfig({...siteConfig, heroTitle: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Hero Subtitle</label>
                <input className="form-input" value={siteConfig.heroSubtitle || ''} onChange={e => setSiteConfig({...siteConfig, heroSubtitle: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Students Count</label>
                <input className="form-input" value={siteConfig.stats?.students || ''} onChange={e => setSiteConfig({...siteConfig, stats: {...siteConfig.stats, students: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">Success Rate</label>
                <input className="form-input" value={siteConfig.stats?.successRate || ''} onChange={e => setSiteConfig({...siteConfig, stats: {...siteConfig.stats, successRate: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">Years Experience</label>
                <input className="form-input" value={siteConfig.stats?.experience || ''} onChange={e => setSiteConfig({...siteConfig, stats: {...siteConfig.stats, experience: e.target.value}})} />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Number</label>
                <input className="form-input" value={siteConfig.whatsappNumber || ''} onChange={e => setSiteConfig({...siteConfig, whatsappNumber: e.target.value})} />
              </div>
            </div>
            <div className="form-group mt-md">
              <label className="form-label">Institute Address</label>
              <textarea className="form-textarea" rows={2} value={siteConfig.address || ''} onChange={e => setSiteConfig({...siteConfig, address: e.target.value})} />
            </div>
            <div className="controls-form-grid">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={siteConfig.phone || ''} onChange={e => setSiteConfig({...siteConfig, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={siteConfig.email || ''} onChange={e => setSiteConfig({...siteConfig, email: e.target.value})} />
              </div>
            </div>
            <button className="btn btn-primary mt-lg" onClick={saveSiteConfig}><Save size={16} /> Save Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}
