import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Flame, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      window.location.href = '/#' + id
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const isHomePage = location.pathname === '/'
  const navClass = `navbar ${(!isHomePage || scrolled) ? 'navbar-scrolled' : ''}`

  return (
    <nav className={navClass}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <Flame size={28} className="navbar-flame" />
          <span className="navbar-logo-text">Forge<span>Edu</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={() => scrollToSection('home')}>Home</button>
          <button className="nav-link" onClick={() => scrollToSection('courses')}>Courses</button>
          <button className="nav-link" onClick={() => scrollToSection('faculty')}>Faculty</button>
          <button className="nav-link" onClick={() => scrollToSection('results')}>Results</button>
          <button className="nav-link" onClick={() => scrollToSection('contact')}>Contact</button>
          <Link to="/apply" className="btn btn-primary btn-apply" onClick={() => setMenuOpen(false)}>Apply Now</Link>
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
