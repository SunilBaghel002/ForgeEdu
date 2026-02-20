import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Send, MessageCircle, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Apply.css'

export default function Apply() {
  const [form, setForm] = useState({ studentName: '', class: '', parentName: '', phone: '', course: '', city: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.studentName.trim()) e.studentName = 'Student name is required'
    if (!form.class) e.class = 'Please select a class'
    if (!form.parentName.trim()) e.parentName = 'Parent name is required'
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone number required'
    if (!form.course) e.course = 'Please select a course'
    if (!form.city.trim()) e.city = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await axios.post('/api/leads', form)
      toast.success('Application submitted! Our team will contact you within 24 hours.')
      setSubmitted(true)
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  if (submitted) {
    return (
      <div className="apply-page public-page">
        <Navbar />
        <div className="apply-success">
          <div className="success-card card">
            <CheckCircle size={64} className="text-gold" />
            <h2>Application Submitted!</h2>
            <p className="text-muted">Our team will contact you within 24 hours. Thank you for choosing ForgeEdu!</p>
            <div className="success-actions">
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MessageCircle size={18} /> Chat with us directly
              </a>
              <Link to="/" className="btn btn-secondary">
                <ArrowLeft size={18} /> Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="apply-page public-page">
      <Navbar />
      <div className="apply-container">
        <div className="apply-header">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to Home</Link>
          <h1>Online <span className="text-gold">Admission</span> Form</h1>
          <p className="text-muted">Fill in the details below to start your journey with ForgeEdu</p>
        </div>

        <form className="apply-form card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Student Name *</label>
              <input className={`form-input ${errors.studentName ? 'input-error' : ''}`} placeholder="Enter student's full name" value={form.studentName} onChange={e => handleChange('studentName', e.target.value)} />
              {errors.studentName && <span className="error-text">{errors.studentName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Class *</label>
              <select className={`form-select ${errors.class ? 'input-error' : ''}`} value={form.class} onChange={e => handleChange('class', e.target.value)}>
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="Dropper">Dropper</option>
              </select>
              {errors.class && <span className="error-text">{errors.class}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Parent Name *</label>
              <input className={`form-input ${errors.parentName ? 'input-error' : ''}`} placeholder="Enter parent's full name" value={form.parentName} onChange={e => handleChange('parentName', e.target.value)} />
              {errors.parentName && <span className="error-text">{errors.parentName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input type="tel" className={`form-input ${errors.phone ? 'input-error' : ''}`} placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={e => handleChange('phone', e.target.value.replace(/\D/g, ''))} />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Course *</label>
              <select className={`form-select ${errors.course ? 'input-error' : ''}`} value={form.course} onChange={e => handleChange('course', e.target.value)}>
                <option value="">Select Course</option>
                <option value="Foundation">Foundation (Class 9-10)</option>
                <option value="IIT-JEE">IIT-JEE</option>
                <option value="NEET">NEET</option>
                <option value="Crash Course">Crash Course</option>
              </select>
              {errors.course && <span className="error-text">{errors.course}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input className={`form-input ${errors.city ? 'input-error' : ''}`} placeholder="Enter your city" value={form.city} onChange={e => handleChange('city', e.target.value)} />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
          </div>

          <button className="btn btn-primary w-full mt-lg" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : <><Send size={18} /> Submit Application</>}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}
