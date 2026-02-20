import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowRight, MessageCircle, BookOpen, FlaskConical, Atom, Brain, Zap, Star, ChevronLeft, ChevronRight, Quote, GraduationCap, Trophy, Users, Award, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import './Home.css'

// Animated counter hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const num = parseInt(target) || 0
        const step = Math.ceil(num / (duration / 16))
        let current = 0
        const timer = setInterval(() => {
          current += step
          if (current >= num) { setCount(num); clearInterval(timer) }
          else setCount(current)
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return [count, ref]
}

const courses = [
  { icon: BookOpen, name: 'Class 9-10 Foundation', duration: '2 Years', batch: 'Starting April 2026', desc: 'Build strong fundamentals for future competitive exams', color: '#3b82f6' },
  { icon: Atom, name: 'Class 11-12 Science', duration: '2 Years', batch: 'Starting April 2026', desc: 'Comprehensive board + competitive exam preparation', color: '#8b5cf6' },
  { icon: Zap, name: 'IIT-JEE Mains & Advanced', duration: '1-2 Years', batch: 'Multiple Batches', desc: 'Intensive JEE preparation with top faculty', color: '#f59e0b' },
  { icon: FlaskConical, name: 'NEET UG', duration: '1-2 Years', batch: 'Multiple Batches', desc: 'Medical entrance with biology-focused curriculum', color: '#10b981' },
  { icon: Brain, name: 'Crash Courses', duration: '3-6 Months', batch: 'Rolling Admissions', desc: 'Fast-track revision for upcoming exams', color: '#ef4444' },
]

const testimonials = [
  { name: 'Rajesh Patel', role: 'Parent', quote: 'ForgeEdu transformed my son\'s approach to Physics. He went from struggling to topping his class. The faculty here truly cares about each student.', rating: 5 },
  { name: 'Ananya Sharma', role: 'Student, AIR 456', quote: 'The structured study plan and regular mock tests at ForgeEdu gave me the confidence I needed for JEE Advanced. Best decision of my life!', rating: 5 },
  { name: 'Meena Iyer', role: 'Parent', quote: 'We moved to Kota specifically for ForgeEdu. The personalized attention and doubt-clearing sessions are unmatched. Worth every rupee.', rating: 5 },
  { name: 'Vikram Singh', role: 'Student, NEET 680+', quote: 'The Biology faculty at ForgeEdu is simply the best. Their NCERT-focused approach combined with advanced concepts helped me crack NEET.', rating: 4 },
  { name: 'Sunita Gupta', role: 'Parent', quote: 'ForgeEdu\'s regular parent-teacher meetings kept us informed. Our daughter felt supported both academically and emotionally.', rating: 5 },
]

export default function Home() {
  const [faculty, setFaculty] = useState([])
  const [toppers, setToppers] = useState([])
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  const [studentsCount, studentsRef] = useCounter('2000', 2000)
  const [successCount, successRef] = useCounter('95', 1500)
  const [yearsCount, yearsRef] = useCounter('15', 1200)

  useEffect(() => {
    axios.get('/api/faculty').then(r => setFaculty(r.data)).catch(() => {})
    axios.get('/api/toppers').then(r => setToppers(r.data)).catch(() => {})
  }, [])

  // Auto-slide testimonials
  useEffect(() => {
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const avatarColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#ec4899']
  const getColor = (i) => avatarColors[i % avatarColors.length]

  return (
    <div className="home-page public-page">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="hero" id="home">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-left">
            <div className="hero-badge animate-fade-in">
              <span className="hero-badge-dot" /> Admissions Open for 2026 Session
            </div>
            <h1 className="hero-title animate-slide-up">
              Shape Your <span className="hero-highlight">Future</span> With India's Finest Coaching
            </h1>
            <p className="hero-subtitle animate-slide-up">
              Where toppers are made — IIT-JEE, NEET & Board Excellence. Premium mentoring by India's leading educators with 15+ years of proven results.
            </p>
            <div className="hero-ctas animate-slide-up">
              <Link to="/apply" className="btn btn-primary btn-lg">
                Apply Now <ArrowRight size={18} />
              </Link>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                <MessageCircle size={18} /> Talk to Counsellor
              </a>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-avatars">
                {['RS', 'PM', 'AK', 'SD'].map((init, i) => (
                  <div key={i} className="hero-trust-avatar" style={{ background: getColor(i), zIndex: 4 - i }}>{init}</div>
                ))}
              </div>
              <span>Trusted by <strong>2000+</strong> families across India</span>
            </div>
          </div>
          <div className="hero-right animate-slide-up">
            <div className="hero-stats-grid">
              <div className="hero-stat-card" ref={studentsRef}>
                <div className="hero-stat-icon"><Users size={22} /></div>
                <span className="hero-stat-number">{studentsCount}+</span>
                <span className="hero-stat-label">Students Mentored</span>
              </div>
              <div className="hero-stat-card accent" ref={successRef}>
                <div className="hero-stat-icon"><Trophy size={22} /></div>
                <span className="hero-stat-number">{successCount}%</span>
                <span className="hero-stat-label">Success Rate</span>
              </div>
              <div className="hero-stat-card" ref={yearsRef}>
                <div className="hero-stat-icon"><Award size={22} /></div>
                <span className="hero-stat-number">{yearsCount}+</span>
                <span className="hero-stat-label">Years Excellence</span>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-icon"><GraduationCap size={22} /></div>
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Top Rankers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Courses Section ─── */}
      <section className="section" id="courses">
        <div className="container">
          <h2 className="section-title">Our <span>Programs</span></h2>
          <p className="section-subtitle">Comprehensive programs designed to unlock your child's full potential</p>
          <div className="courses-grid">
            {courses.map((course, i) => (
              <div className="course-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="course-icon" style={{ background: course.color + '14', color: course.color }}>
                  <course.icon size={28} />
                </div>
                <h3>{course.name}</h3>
                <p className="course-desc">{course.desc}</p>
                <div className="course-meta">
                  <span>⏱ {course.duration}</span>
                  <span>📅 {course.batch}</span>
                </div>
                <Link to="/apply" className="btn btn-course-cta">
                  Know More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Faculty Section ─── */}
      <section className="section section-alt" id="faculty">
        <div className="container">
          <h2 className="section-title">Expert <span>Faculty</span></h2>
          <p className="section-subtitle">Learn from the best minds in competitive exam preparation</p>
          <div className="faculty-grid">
            {(faculty.length > 0 ? faculty : [
              { name: 'Dr. Rakesh Sharma', subject: 'Physics', experience: 12, bio: 'IIT Delhi Alumni' },
              { name: 'Prof. Sunita Desai', subject: 'Chemistry', experience: 15, bio: 'Former CSIR Scientist' },
              { name: 'Mr. Arun Mehta', subject: 'Mathematics', experience: 10, bio: 'IIT Bombay Gold Medalist' },
              { name: 'Dr. Priyanka Verma', subject: 'Biology', experience: 8, bio: 'AIIMS Graduate' },
            ]).map((f, i) => (
              <div className="faculty-card" key={i}>
                <div className="avatar avatar-lg" style={{ background: getColor(i) + '18', color: getColor(i) }}>
                  {getInitials(f.name)}
                </div>
                <h4>{f.name}</h4>
                <p className="faculty-subject">{f.subject}</p>
                <p className="faculty-exp">{f.experience} Years Experience</p>
                <p className="faculty-bio">{f.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Results / Toppers Section ─── */}
      <section className="section" id="results">
        <div className="container">
          <h2 className="section-title">Our <span>Stars</span></h2>
          <p className="section-subtitle">The pride of ForgeEdu — students who turned dreams into reality</p>
          <div className="toppers-grid">
            {(toppers.length > 0 ? toppers : [
              { name: 'Priya Mehta', exam: 'IIT-JEE', rank: 'AIR 234', score: '310/360', year: 2025 },
              { name: 'Rahul Krishnan', exam: 'NEET', rank: 'AIR 56', score: '695/720', year: 2025 },
              { name: 'Aditi Sharma', exam: 'IIT-JEE', rank: 'AIR 512', score: '298/360', year: 2025 },
              { name: 'Karan Singhania', exam: 'NEET', rank: 'AIR 128', score: '680/720', year: 2024 },
              { name: 'Sneha Das', exam: 'IIT-JEE', rank: 'AIR 890', score: '285/360', year: 2024 },
            ]).map((t, i) => (
              <div className="topper-card" key={i}>
                <div className="topper-badge">⭐</div>
                <div className="avatar avatar-lg" style={{ background: getColor(i) + '18', color: getColor(i) }}>
                  {getInitials(t.name)}
                </div>
                <h4>{t.name}</h4>
                <div className="topper-rank">{t.rank}</div>
                <p className="topper-exam">{t.exam} {t.year}</p>
                {t.score && <p className="topper-score">Score: {t.score}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <section className="section section-alt" id="testimonials">
        <div className="container">
          <h2 className="section-title">What People <span>Say</span></h2>
          <p className="section-subtitle">Hear from parents and students who chose ForgeEdu</p>
          <div className="testimonial-slider">
            <button className="testimonial-arrow" onClick={() => setTestimonialIdx((testimonialIdx - 1 + testimonials.length) % testimonials.length)}>
              <ChevronLeft size={24} />
            </button>
            <div className="testimonial-content">
              <Quote size={40} className="testimonial-quote-icon" />
              <p className="testimonial-text">{testimonials[testimonialIdx].quote}</p>
              <div className="testimonial-stars">
                {[...Array(testimonials[testimonialIdx].rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <div className="testimonial-author">
                <div className="avatar avatar-md" style={{ background: getColor(testimonialIdx) + '18', color: getColor(testimonialIdx) }}>
                  {getInitials(testimonials[testimonialIdx].name)}
                </div>
                <div>
                  <h4>{testimonials[testimonialIdx].name}</h4>
                  <p className="testimonial-role">{testimonials[testimonialIdx].role}</p>
                </div>
              </div>
              <div className="testimonial-dots">
                {testimonials.map((_, i) => (
                  <button key={i} className={`dot ${i === testimonialIdx ? 'active' : ''}`} onClick={() => setTestimonialIdx(i)} />
                ))}
              </div>
            </div>
            <button className="testimonial-arrow" onClick={() => setTestimonialIdx((testimonialIdx + 1) % testimonials.length)}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join ForgeEdu today and get access to the best faculty, study material, and mentorship.</p>
          <div className="cta-banner-btns">
            <Link to="/apply" className="btn btn-primary btn-lg">Apply Now <ArrowRight size={18} /></Link>
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-outline-white btn-lg">
              <MessageCircle size={18} /> Chat with Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
