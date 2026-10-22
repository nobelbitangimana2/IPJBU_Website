import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// ── Public layout & pages ──────────────────────────────────────────────────
import NavBar         from './components/NavBar'
import Footer         from './components/Footer'
import Home           from './pages/Home'
import About          from './pages/About'
import Programmes     from './pages/Programmes'
import Gallery        from './pages/Gallery'
import News           from './pages/News'
import UpdateDetail   from './pages/UpdateDetail'
import Contact        from './pages/Contact'
import MentionsLegales from './pages/MentionsLegales'

// ── Admin ──────────────────────────────────────────────────────────────────
import AdminLogin       from './admin/AdminLogin'
import AdminLayout      from './admin/AdminLayout'
import ProtectedRoute   from './admin/ProtectedRoute'
import AdminDashboard   from './admin/AdminDashboard'
import AdminMedia       from './admin/AdminMedia'
import AdminUpdates     from './admin/AdminUpdates'
import AdminContent     from './admin/AdminContent'
import AdminContactInfo from './admin/AdminContactInfo'
import AdminTeam        from './admin/AdminTeam'

function PublicSite() {
  return (
    <div className="site-wrapper">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/"                element={<Home />}            />
          <Route path="/about"           element={<About />}           />
          <Route path="/programmes"      element={<Programmes />}      />
          {/* Redirect old /activities URL to /programmes */}
          <Route path="/activities"      element={<Navigate to="/programmes" replace />} />
          <Route path="/gallery"         element={<Gallery />}         />
          <Route path="/news"            element={<News />}            />
          <Route path="/news/:id"        element={<UpdateDetail />}    />
          <Route path="/contact"         element={<Contact />}         />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="*"                element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* ── Admin login (standalone, no shell) ── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Admin panel (protected, own layout shell) ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index           element={<AdminDashboard />}   />
        <Route path="media"    element={<AdminMedia />}       />
        <Route path="updates"  element={<AdminUpdates />}     />
        <Route path="content"  element={<AdminContent />}     />
        <Route path="contact"  element={<AdminContactInfo />} />
        <Route path="team"     element={<AdminTeam />}        />
      </Route>

      {/* ── Public site (catches everything else) ── */}
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  )
}
