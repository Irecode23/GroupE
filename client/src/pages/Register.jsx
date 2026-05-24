import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'rider'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/auth/register', formData)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.leftContent}>
            <h1 style={styles.leftLogo}>🚗 RideShare</h1>
            <h2 style={styles.leftTitle}>Almost There!</h2>
            <p style={styles.leftSubtitle}>
              Your account is under review. Our admin will verify your details shortly.
            </p>
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
            </svg>
          </div>
        </div>
        <div style={styles.rightPanel}>
          <div style={styles.formBox}>
            <div style={styles.successIcon}>⏳</div>
            <h2 style={styles.successTitle}>Registration Successful!</h2>
            <p style={styles.successText}>
              Your account has been created and is <strong>pending admin verification</strong>.
              You will be able to login once the admin approves your account.
            </p>
            <div style={styles.successSteps}>
              <div style={styles.successStep}>
                <span style={styles.successStepIcon}>✅</span>
                <span>Account created successfully</span>
              </div>
              <div style={styles.successStep}>
                <span style={styles.successStepIcon}>⏳</span>
                <span>Waiting for admin verification</span>
              </div>
              <div style={styles.successStep}>
                <span style={{ ...styles.successStepIcon, opacity: 0.4 }}>🚗</span>
                <span style={{ opacity: 0.4 }}>Start riding or driving</span>
              </div>
            </div>
            <Link to="/login" style={styles.button}>
              Go to Login →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Left Side */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h1 style={styles.leftLogo}>🚗 RideShare</h1>
          <h2 style={styles.leftTitle}>Join Us Today!</h2>
          <p style={styles.leftSubtitle}>
            Create your account and start riding or earning as a driver.
          </p>
          <div style={styles.roleCards}>
            <div
              style={{
                ...styles.roleCard,
                border: formData.role === 'rider'
                  ? '2px solid #f6c90e'
                  : '2px solid transparent',
                background: formData.role === 'rider'
                  ? 'rgba(246,201,14,0.1)'
                  : 'rgba(255,255,255,0.05)'
              }}
              onClick={() => setFormData({ ...formData, role: 'rider' })}
            >
              <span style={styles.roleIcon}>🙋</span>
              <div>
                <p style={styles.roleTitle}>Rider</p>
                <p style={styles.roleText}>Book rides easily</p>
              </div>
            </div>
            <div
              style={{
                ...styles.roleCard,
                border: formData.role === 'driver'
                  ? '2px solid #f6c90e'
                  : '2px solid transparent',
                background: formData.role === 'driver'
                  ? 'rgba(246,201,14,0.1)'
                  : 'rgba(255,255,255,0.05)'
              }}
              onClick={() => setFormData({ ...formData, role: 'driver' })}
            >
              <span style={styles.roleIcon}>🚘</span>
              <div>
                <p style={styles.roleTitle}>Driver</p>
                <p style={styles.roleText}>Earn money driving</p>
              </div>
            </div>
          </div>

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
            <circle cx="25" cy="75" r="10" fill="#f39c12"/>
            <rect x="18" y="85" width="14" height="20" fill="#e74c3c" rx="3"/>
            <line x1="18" y1="90" x2="8" y2="82" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
            <line x1="32" y1="90" x2="42" y2="98" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
            <rect x="265" y="88" width="6" height="32" fill="#795548"/>
            <circle cx="268" cy="82" r="14" fill="#2ecc71"/>
          </svg>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Fill in your details to get started</p>
          </div>

          {error && <div style={styles.error}>❌ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>👤 Full Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>📱 Phone Number</label>
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
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>🚗 Register As</label>
              <select
                style={styles.input}
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="rider">🙋 Rider — Book rides</option>
                <option value="driver">🚘 Driver — Earn money</option>
              </select>
            </div>

            <button style={styles.button} type="submit" disabled={loading}>
              {loading ? '⏳ Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          <p style={styles.footer}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Sign In</Link>
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
  roleCards: { display: 'flex', gap: '12px', marginBottom: '32px' },
  roleCard: {
    flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
  },
  roleIcon: { fontSize: '28px' },
  roleTitle: { color: '#fff', fontWeight: '700', fontSize: '14px', margin: '0 0 2px' },
  roleText: { color: '#aaa', fontSize: '12px', margin: 0 },
  svg: { width: '100%', maxWidth: '320px' },
  rightPanel: {
    flex: 1, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px', background: '#f8f9fa',
    overflowY: 'auto'
  },
  formBox: {
    background: '#fff', padding: '48px', borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '460px'
  },
  formHeader: { marginBottom: '28px' },
  formTitle: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  formSubtitle: { color: '#666', margin: 0, fontSize: '15px' },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px',
    border: '1px solid rgba(220,0,0,0.15)'
  },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  inputGroup: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#333' },
  input: {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  button: {
    display: 'block', width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '800', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)',
    textDecoration: 'none', textAlign: 'center', letterSpacing: '0.5px'
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#999', fontSize: '13px', fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: '14px', color: '#666', margin: '8px 0' },
  link: { color: '#f39c12', fontWeight: '700', textDecoration: 'none' },
  successIcon: { fontSize: '64px', textAlign: 'center', marginBottom: '16px' },
  successTitle: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', textAlign: 'center', margin: '0 0 12px' },
  successText: { color: '#666', fontSize: '15px', textAlign: 'center', lineHeight: '1.6', margin: '0 0 28px' },
  successSteps: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' },
  successStep: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', background: '#f9f9f9', borderRadius: '10px',
    fontSize: '14px', color: '#333', fontWeight: '500'
  },
  successStepIcon: { fontSize: '20px' }
}

export default Register