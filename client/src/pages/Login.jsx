import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Login() {
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

      // Block admin from using regular login page
      if (data.role === 'admin') {
        setError('Invalid Credentials Message Support.')
        setLoading(false)
        return
      }

      login(data)
      if (data.role === 'rider') navigate('/rider/dashboard')
      else if (data.role === 'driver') navigate('/driver/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      {/* Left Side */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h1 style={styles.leftLogo}>🚗 RideShare</h1>
          <h2 style={styles.leftTitle}>Welcome Back!</h2>
          <p style={styles.leftSubtitle}>
            Login to access your dashboard and manage your rides.
          </p>
          <div style={styles.features}>
            {[
              { icon: '⚡', text: 'Fast and reliable rides' },
              { icon: '🔒', text: 'Safe and secure platform' },
              { icon: '💰', text: 'Affordable prices' },
              { icon: '⭐', text: 'Top rated drivers' },
            ].map((f) => (
              <div key={f.text} style={styles.featureItem}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* SVG illustration */}
          <svg viewBox="0 0 300 150" style={styles.svg} xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="120" width="300" height="30" fill="#2d2d4e" rx="4"/>
            <rect x="30" y="128" width="30" height="5" fill="#f6c90e" rx="2"/>
            <rect x="100" y="128" width="30" height="5" fill="#f6c90e" rx="2"/>
            <rect x="170" y="128" width="30" height="5" fill="#f6c90e" rx="2"/>
            <rect x="240" y="128" width="30" height="5" fill="#f6c90e" rx="2"/>
            <rect x="60" y="85" width="140" height="40" fill="#f6c90e" rx="8"/>
            <rect x="80" y="65" width="100" height="30" fill="#f6c90e" rx="8"/>
            <rect x="88" y="70" width="38" height="22" fill="#1a1a2e" rx="3" opacity="0.8"/>
            <rect x="132" y="70" width="38" height="22" fill="#1a1a2e" rx="3" opacity="0.8"/>
            <circle cx="90" cy="125" r="14" fill="#1a1a2e"/>
            <circle cx="90" cy="125" r="7" fill="#444"/>
            <circle cx="90" cy="125" r="3" fill="#f6c90e"/>
            <circle cx="170" cy="125" r="14" fill="#1a1a2e"/>
            <circle cx="170" cy="125" r="7" fill="#444"/>
            <circle cx="170" cy="125" r="3" fill="#f6c90e"/>
            <rect x="55" y="95" width="8" height="6" fill="#e74c3c" rx="1"/>
            <rect x="197" y="95" width="8" height="6" fill="#fff" rx="1"/>
            <circle cx="25" cy="75" r="10" fill="#f39c12"/>
            <rect x="18" y="85" width="14" height="20" fill="#e74c3c" rx="3"/>
            <rect x="18" y="102" width="5" height="16" fill="#1a1a2e" rx="2"/>
            <rect x="27" y="102" width="5" height="16" fill="#1a1a2e" rx="2"/>
            <line x1="18" y1="90" x2="8" y2="82" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
            <line x1="32" y1="90" x2="42" y2="98" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="25" cy="45" r="8" fill="#e74c3c"/>
            <circle cx="25" cy="45" r="4" fill="#fff"/>
            <line x1="25" y1="53" x2="25" y2="62" stroke="#e74c3c" strokeWidth="2"/>
            <rect x="38" y="35" width="70" height="24" fill="#fff" rx="6" opacity="0.95"/>
            <polygon points="38,52 32,58 45,52" fill="#fff" opacity="0.95"/>
            <text x="45" y="46" fontSize="7" fill="#1a1a2e" fontWeight="bold">Waiting for</text>
            <text x="45" y="55" fontSize="7" fill="#1a1a2e" fontWeight="bold">driver... 🚕</text>
            <text x="100" y="55" fontSize="12" fill="#f6c90e">⭐⭐⭐⭐⭐</text>
            <path d="M 210 80 Q 222 72 234 80" stroke="#2ecc71" strokeWidth="2" fill="none"/>
            <path d="M 214 72 Q 230 60 246 72" stroke="#2ecc71" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <rect x="265" y="88" width="6" height="32" fill="#795548"/>
            <circle cx="268" cy="82" r="14" fill="#2ecc71"/>
            <circle cx="260" cy="88" r="10" fill="#27ae60"/>
          </svg>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign In</h2>
            <p style={styles.formSubtitle}>Enter your credentials to continue</p>
          </div>

          {error && (
            <div style={styles.error}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>📧 Email Address</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif' },
  leftPanel: {
    flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '60px 40px'
  },
  leftContent: { maxWidth: '400px' },
  leftLogo: { color: '#f6c90e', fontSize: '28px', fontWeight: '800', margin: '0 0 32px' },
  leftTitle: { color: '#fff', fontSize: '40px', fontWeight: '800', margin: '0 0 16px' },
  leftSubtitle: { color: '#aaa', fontSize: '16px', lineHeight: '1.7', margin: '0 0 32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '12px' },
  featureIcon: {
    width: '36px', height: '36px', background: 'rgba(246,201,14,0.15)',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '16px', flexShrink: 0
  },
  featureText: { color: '#ccc', fontSize: '14px', fontWeight: '500' },
  svg: { width: '100%', maxWidth: '320px', marginTop: '8px' },
  rightPanel: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '60px 40px', background: '#f8f9fa'
  },
  formBox: {
    background: '#fff', padding: '48px', borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px'
  },
  formHeader: { marginBottom: '32px' },
  formTitle: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  formSubtitle: { color: '#666', margin: 0, fontSize: '15px' },
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
    border: '2px solid #eee', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none',
    transition: 'border-color 0.2s', background: '#fafafa'
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

export default Login