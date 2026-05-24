import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    adminCode: ''
  })
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
      const { data } = await API.post('/auth/register', {
        ...formData,
        role: 'admin'
      })
      login(data)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
        <h2 style={styles.title}>Admin Registration</h2>
        <p style={styles.subtitle}>Create a new admin account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>🔐 Admin Secret Code</label>
            <input
              style={styles.input}
              type="password"
              name="adminCode"
              placeholder="Enter admin secret code"
              value={formData.adminCode}
              onChange={handleChange}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Admin Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/admin/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#1a1a2e'
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
    width: '100%', maxWidth: '400px'
  },
  logoArea: {
    display: 'flex', alignItems: 'center',
    gap: '12px', marginBottom: '24px'
  },
  logo: { color: '#1a1a2e', margin: 0, fontSize: '22px' },
  adminBadge: {
    background: '#9b59b6', color: '#fff', padding: '4px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700'
  },
  title: { margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#1a1a2e' },
  subtitle: { margin: '0 0 24px', color: '#666', fontSize: '14px' },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '10px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#333' },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none'
  },
  button: {
    width: '100%', padding: '12px', background: '#f6c90e',
    color: '#1a1a2e', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px'
  },
  footer: { textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#666' },
  link: { color: '#f6c90e', fontWeight: '600', textDecoration: 'none' }
}

export default AdminRegister