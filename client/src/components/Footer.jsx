import { Flame, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Flame size={24} className="text-gold" />
              <span className="navbar-logo-text">Forge<span>Edu</span></span>
            </div>
            <p className="footer-desc">
              Shaping the future of India's brightest minds since 2010. Premier coaching for IIT-JEE, NEET & Board Exams.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <a href="#courses">Courses</a>
            <a href="#faculty">Faculty</a>
            <a href="#results">Results</a>
            <a href="/apply">Apply Now</a>
          </div>

          <div className="footer-col">
            <h4>Courses</h4>
            <a href="#courses">IIT-JEE Preparation</a>
            <a href="#courses">NEET UG</a>
            <a href="#courses">Foundation (9-10)</a>
            <a href="#courses">Crash Courses</a>
          </div>

          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>123 Education Lane, Kota, Rajasthan 324001</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={16} />
              <span>+91 99999 99999</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={16} />
              <span>info@forgeedu.in</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ForgeEdu. All rights reserved.</p>
          <p>Powered by <span className="text-gold">ForgeEdu</span></p>
        </div>
      </div>
    </footer>
  )
}
