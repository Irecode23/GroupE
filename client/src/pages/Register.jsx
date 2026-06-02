import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import useWindowSize from '../hooks/useWindowSize'

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'rider'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { width } = useWindowSize()
  const isMobile = width < 768

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
      <div style={{
        ...styles.container,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {!isMobile && (
          <div style={styles.leftPanel}>
            <div style={styles.leftContent}>
              <h1 style={styles.leftLogo}>🚗 RideShare</h1>
              <h2 style={styles.leftTitle}>Almost There!</h2>
              <p style={styles.leftSubtitle}>
                Your account is under review. Our admin will verify your details shortly.
              </p>
            </div>
          </div>
        )}
        <div style={{
          ...styles.rightPanel,
          padding: isMobile ? '32px 20px' : '60px 40px',
          background: isMobile ? '#1a1a2e' : '#f8f9fa'
        }}>
          {isMobile && (
            <div style={styles.mobileLogo}>
              <h1 style={styles.mobileLogoText}>🚗 RideShare</h1>
            </div>
          )}
          <div style={{
            ...styles.formBox,
            padding: isMobile ? '28px 24px' : '48px'
          }}>
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
    <div style={{
      ...styles.container,
      flexDirection: isMobile ? 'column' : 'row'
    }}>
      {/* Left Side */}
      {!isMobile && (
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
                  border: formData.role === 'rider' ? '2px solid #f6c90e' : '2px solid transparent',
                  background: formData.role === 'rider' ? 'rgba(246,201,14,0.1)' : 'rgba(255,255,255,0.05)'
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
                  border: formData.role === 'driver' ? '2px solid #f6c90e' : '2px solid transparent',
                  background: formData.role === 'driver' ? 'rgba(246,201,14,0.1)' : 'rgba(255,255,255,0.05)'
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
          </div>
        </div>
      )}

      {/* Right Side */}
      <div style={{
        ...styles.rightPanel,
        padding: isMobile ? '32px 20px' : '40px',
        background: isMobile ? '#1a1a2e' : '#f8f9fa',
        overflowY: 'auto'
      }}>
        {isMobile && (
          <div style={styles.mobileLogo}>
            <h1 style={styles.mobileLogoText}>🚗 RideShare</h1>
          </div>
        )}

        <div style={{
          ...styles.formBox,
          padding: isMobile ? '28px 24px' : '40px'
        }}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Fill in your details to get started</p>
          </div>

          {error && <div style={styles.error}>❌ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '16px'
            }}>
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
  roleCards: { display: 'flex', gap: '12px' },
  roleCard: {
    flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '12px'
  },
  roleIcon: { fontSize: '28px' },
  roleTitle: { color: '#fff', fontWeight: '700', fontSize: '14px', margin: '0 0 2px' },
  roleText: { color: '#aaa', fontSize: '12px', margin: 0 },
  rightPanel: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center'
  },
  mobileLogo: { marginBottom: '24px', textAlign: 'center' },
  mobileLogoText: { color: '#f6c90e', fontSize: '28px', fontWeight: '800', margin: 0 },
  formBox: {
    background: '#fff', borderRadius: '20px',
    width: '100%', maxWidth: '460px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.1)'
  },
  formHeader: { marginBottom: '24px' },
  formTitle: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  formSubtitle: { color: '#666', margin: 0, fontSize: '14px' },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px'
  },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: '#333' },
  input: {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  button: {
    display: 'block', width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)',
    textDecoration: 'none', textAlign: 'center'
  },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#999', fontSize: '13px', fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: '14px', color: '#666', margin: '8px 0' },
  link: { color: '#f39c12', fontWeight: '700', textDecoration: 'none' },
  successIcon: { fontSize: '56px', textAlign: 'center', marginBottom: '16px' },
  successTitle: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', textAlign: 'center', margin: '0 0 12px' },
  successText: { color: '#666', fontSize: '14px', textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px' },
  successSteps: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' },
  successStep: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 14px', background: '#f9f9f9', borderRadius: '10px',
    fontSize: '13px', color: '#333', fontWeight: '500'
  },
  successStepIcon: { fontSize: '18px' }
}

export default Register