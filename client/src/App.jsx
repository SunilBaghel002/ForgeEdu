import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Apply from './pages/Apply'
import AdminAuth from './components/AdminAuth'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Leads from './pages/admin/Leads'
import Students from './pages/admin/Students'
import StudentProfile from './pages/admin/StudentProfile'
import Fees from './pages/admin/Fees'
import Receipts from './pages/admin/Receipts'
import Controls from './pages/admin/Controls'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/apply" element={<Apply />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="fees" element={<Fees />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="controls" element={<Controls />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
