import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Flame, LayoutDashboard, Users, GraduationCap, IndianRupee, Receipt, Settings, LogOut } from 'lucide-react'
import './AdminLayout.css'

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/leads', icon: Users, label: 'Lead Management' },
  { path: '/admin/students', icon: GraduationCap, label: 'Students' },
  { path: '/admin/fees', icon: IndianRupee, label: 'Fee Tracking' },
  { path: '/admin/receipts', icon: Receipt, label: 'Receipts' },
  { path: '/admin/controls', icon: Settings, label: 'Admin Controls' },
]

export default function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    sessionStorage.removeItem('forgeEduAdmin')
    navigate('/')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Flame size={24} className="text-gold" />
          <span className="sidebar-logo">Forge<span>Edu</span></span>
        </div>
        <div className="sidebar-label">MAIN MENU</div>
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
