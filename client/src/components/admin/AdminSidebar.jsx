import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import useWindowSize from '../../hooks/useWindowSize'

function AdminSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { width } = useWindowSize()
  const isMobile = width < 1024
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/users', icon: '👥', label: 'User Management' },
    { path: '/admin/rides', icon: '🚗', label: 'Ride Monitoring' },
    { path: '/admin/complaints', icon: '📝', label: 'Complaints' },
    { path: '/admin/payments', icon: '💰', label: 'Payments' },
    { path: '/admin/ratings', icon: '⭐', label: 'Ratings & Reviews' },
    { path: '/admin/reports', icon: '📈', label: 'Reports' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ]

  if (isMobile) {
    return (
      <>
        {/* Mobile Top Bar */}
        <div style={styles.mobileTopBar}>
          <h2 style={styles.mobileLogo}>🚗 RideShare Admin</h2>
          <button
            style={styles.hamburgerBtn}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.mobileMenuItem,
                  background: location.pathname === item.path
                    ? 'rgba(246,201,14,0.15)'
                    : 'transparent',
                  color: location.pathname === item.path ? '#f6c90e' : '#ccc'
                }}
                onClick={() => setMenuOpen(false)}
              >
                <span style={styles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
              🚪 Logout
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <h2 style={styles.logoText}>🚗 RideShare</h2>
        <p style={styles.logoSub}>Admin Panel</p>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.menuItem,
              ...(location.pathname === item.path ? styles.activeMenuItem : {})
            }}
          >
            <span style={styles.menuIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        🚪 Logout
      </button>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '250px', minHeight: '100vh',
    background: '#1a1a2e', display: 'flex',
    flexDirection: 'column', position: 'fixed',
    left: 0, top: 0, zIndex: 100
  },
  logo: { padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  logoText: { color: '#f6c90e', margin: '0 0 4px', fontSize: '20px' },
  logoSub: { color: '#999', margin: 0, fontSize: '12px' },
  nav: { flex: 1, padding: '16px 0' },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 20px', color: '#ccc',
    textDecoration: 'none', fontSize: '14px'
  },
  activeMenuItem: {
    background: 'rgba(246,201,14,0.15)', color: '#f6c90e',
    borderLeft: '3px solid #f6c90e'
  },
  menuIcon: { fontSize: '18px', width: '24px' },
  logoutBtn: {
    margin: '16px', padding: '12px',
    background: 'rgba(231,76,60,0.2)', color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
  },
  mobileTopBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    position: 'sticky', top: 0, zIndex: 100
  },
  mobileLogo: { color: '#f6c90e', margin: 0, fontSize: '18px', fontWeight: '800' },
  hamburgerBtn: {
    background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
    padding: '8px 12px', borderRadius: '8px', fontSize: '20px', cursor: 'pointer'
  },
  mobileMenu: {
    background: '#1a1a2e', padding: '12px 16px',
    display: 'flex', flexDirection: 'column', gap: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'sticky', top: '53px', zIndex: 99
  },
  mobileMenuItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', textDecoration: 'none',
    fontSize: '14px', borderRadius: '8px', fontWeight: '600'
  },
  mobileLogoutBtn: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', background: 'rgba(231,76,60,0.2)',
    color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)',
    borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px', width: '100%', textAlign: 'left'
  }
}

export default AdminSidebar