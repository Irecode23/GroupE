import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/auth/login', formData)

      // Block non-admin from using admin login page
      if (data.role !== 'admin') {
        setError('This login page is for admin accounts only. Please use the regular login page.')
        setLoading(false)
        return
      }

      login(data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <h1 style={styles.logo}>🚗 RideShare</h1>
          <span style={styles.adminBadge}>👑 ADMIN</span>
        </div>
        <h2 style={styles.title}>Admin Login</h2>
        <p style={styles.subtitle}>Sign in to access the admin panel</p>

        {error && <div style={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>📧 Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔒 Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>
        <p style={styles.footer}>
          New admin?{' '}
          <Link to="/admin/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
    fontFamily: 'sans-serif'
  },
  card: {
    background: '#fff', padding: '48px', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    width: '100%', maxWidth: '420px'
  },
  logoArea: {
    display: 'flex', alignItems: 'center',
    gap: '12px', marginBottom: '28px'
  },
  logo: { color: '#1a1a2e', margin: 0, fontSize: '22px', fontWeight: '800' },
  adminBadge: {
    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    color: '#fff', padding: '4px 12px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700',
    boxShadow: '0 2px 8px rgba(155,89,182,0.4)'
  },
  title: { margin: '0 0 8px', fontSize: '28px', fontWeight: '800', color: '#1a1a2e' },
  subtitle: { margin: '0 0 28px', color: '#666', fontSize: '14px' },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px',
    border: '1px solid rgba(220,0,0,0.15)'
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#333' },
  input: {
    width: '100%', padding: '14px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  button: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '800', cursor: 'pointer',
    marginTop: '8px', boxShadow: '0 4px 15px rgba(246,201,14,0.4)',
    letterSpacing: '0.5px'
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#999', fontSize: '13px', fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: '14px', color: '#666', margin: '8px 0' },
  link: { color: '#f39c12', fontWeight: '700', textDecoration: 'none' }
}

export default AdminLogin