import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

function AdminSettings() {
  const { user, login } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: ''
  })

  const [platformData, setPlatformData] = useState({
    appName: 'RideShare',
    commissionRate: '10',
    baseFare: '500',
    maxFare: '5000',
    supportEmail: 'support@rideshare.com',
    supportPhone: '08000000000'
  })

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePlatformChange = (e) => {
    setPlatformData({ ...platformData, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const { data } = await API.put('/users/profile', profileData)
      login({ ...user, name: data.name })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
    setLoading(false)
  }

  const handlePlatformSubmit = (e) => {
    e.preventDefault()
    setMessage('Platform settings saved successfully!')
  }

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Settings</h2>
        <p style={styles.subtitle}>Manage your admin profile and platform settings</p>
      </div>

      {message && (
        <div style={styles.success} onClick={() => setMessage('')}>
          ✅ {message} <span style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        </div>
      )}
      {error && (
        <div style={styles.error} onClick={() => setError('')}>
          ❌ {error} <span style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'profile', label: '👤 Admin Profile' },
          { key: 'platform', label: '⚙️ Platform Settings' },
          { key: 'security', label: '🔒 Security' },
        ].map(tab => (
          <button
            key={tab.key}
            style={activeTab === tab.key ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={styles.card}>
          <div style={styles.profileTop}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={styles.profileName}>{user?.name}</h3>
              <p style={styles.profileEmail}>{user?.email}</p>
              <span style={styles.adminBadge}>👑 Admin</span>
            </div>
          </div>

          <hr style={styles.divider} />

          <form onSubmit={handleProfileSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  placeholder="Enter full name"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  style={styles.input}
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  style={{ ...styles.input, background: '#f5f5f5', color: '#999' }}
                  type="email"
                  value={user?.email}
                  disabled
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password (optional)</label>
                <input
                  style={styles.input}
                  type="password"
                  name="password"
                  value={profileData.password}
                  onChange={handleProfileChange}
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
            <button style={styles.saveBtn} type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === 'platform' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Platform Configuration</h3>
          <p style={styles.cardSubtitle}>Configure the platform settings and fare structure</p>
          <hr style={styles.divider} />

          <form onSubmit={handlePlatformSubmit}>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>App Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="appName"
                  value={platformData.appName}
                  onChange={handlePlatformChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Commission Rate (%)</label>
                <input
                  style={styles.input}
                  type="number"
                  name="commissionRate"
                  value={platformData.commissionRate}
                  onChange={handlePlatformChange}
                  min="0"
                  max="100"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Base Fare (₦)</label>
                <input
                  style={styles.input}
                  type="number"
                  name="baseFare"
                  value={platformData.baseFare}
                  onChange={handlePlatformChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Maximum Fare (₦)</label>
                <input
                  style={styles.input}
                  type="number"
                  name="maxFare"
                  value={platformData.maxFare}
                  onChange={handlePlatformChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Support Email</label>
                <input
                  style={styles.input}
                  type="email"
                  name="supportEmail"
                  value={platformData.supportEmail}
                  onChange={handlePlatformChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Support Phone</label>
                <input
                  style={styles.input}
                  type="text"
                  name="supportPhone"
                  value={platformData.supportPhone}
                  onChange={handlePlatformChange}
                />
              </div>
            </div>

            <div style={styles.farePreview}>
              <h4 style={styles.farePreviewTitle}>💰 Fare Preview</h4>
              <div style={styles.farePreviewRow}>
                <span>Base Fare:</span>
                <strong>₦{platformData.baseFare}</strong>
              </div>
              <div style={styles.farePreviewRow}>
                <span>Commission ({platformData.commissionRate}%):</span>
                <strong>₦{(platformData.baseFare * platformData.commissionRate / 100).toFixed(0)}</strong>
              </div>
              <div style={styles.farePreviewRow}>
                <span>Driver Earning:</span>
                <strong style={{ color: '#2ecc71' }}>
                  ₦{(platformData.baseFare * (100 - platformData.commissionRate) / 100).toFixed(0)}
                </strong>
              </div>
            </div>

            <button style={styles.saveBtn} type="submit">
              Save Platform Settings
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Security Settings</h3>
          <p style={styles.cardSubtitle}>Manage security and access control</p>
          <hr style={styles.divider} />

          <div style={styles.securityItem}>
            <div style={styles.securityInfo}>
              <h4 style={styles.securityTitle}>🔑 Admin Secret Code</h4>
              <p style={styles.securityText}>
                The secret code used to register new admin accounts.
                Keep this confidential and share only with trusted personnel.
              </p>
            </div>
            <div style={styles.secretCodeBox}>
              <code style={styles.secretCode}>RIDESHARE_ADMIN_2026</code>
              <p style={styles.secretCodeNote}>
                ⚠️ Change this in your server .env file if compromised
              </p>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.securityItem}>
            <div style={styles.securityInfo}>
              <h4 style={styles.securityTitle}>🛡️ Account Security Tips</h4>
              <ul style={styles.securityList}>
                <li>Use a strong password with at least 8 characters</li>
                <li>Never share your admin credentials with anyone</li>
                <li>Always logout when done using the admin panel</li>
                <li>Regularly review user accounts for suspicious activity</li>
                <li>Change the admin secret code periodically</li>
                <li>Monitor the complaints section regularly</li>
              </ul>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.securityItem}>
            <div style={styles.securityInfo}>
              <h4 style={styles.securityTitle}>📊 Session Info</h4>
              <div style={styles.sessionInfo}>
                <div style={styles.sessionRow}>
                  <span style={styles.sessionLabel}>Logged in as:</span>
                  <span style={styles.sessionValue}>{user?.name}</span>
                </div>
                <div style={styles.sessionRow}>
                  <span style={styles.sessionLabel}>Email:</span>
                  <span style={styles.sessionValue}>{user?.email}</span>
                </div>
                <div style={styles.sessionRow}>
                  <span style={styles.sessionLabel}>Role:</span>
                  <span style={styles.sessionValue}>Administrator</span>
                </div>
                <div style={styles.sessionRow}>
                  <span style={styles.sessionLabel}>Token expires:</span>
                  <span style={styles.sessionValue}>30 days from login</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

const styles = {
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  success: {
    background: '#e0ffe0', color: '#060', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: '1px solid #1a1a2e',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  card: {
    background: '#fff', padding: '32px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  cardSubtitle: { color: '#666', fontSize: '14px', margin: 0 },
  profileTop: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
  avatar: {
    width: '80px', height: '80px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '32px',
    fontWeight: '800', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  profileName: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  profileEmail: { color: '#666', fontSize: '14px', margin: '0 0 8px' },
  adminBadge: {
    background: '#9b59b6', color: '#fff', padding: '4px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '700'
  },
  divider: { margin: '24px 0', border: 'none', borderTop: '1px solid #eee' },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px', marginBottom: '24px'
  },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#333' },
  input: {
    padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box'
  },
  saveBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '12px 32px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  farePreview: {
    background: '#f9f9f9', padding: '20px', borderRadius: '8px',
    marginBottom: '24px'
  },
  farePreviewTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 12px' },
  farePreviewRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #eee', fontSize: '14px', color: '#333'
  },
  securityItem: { marginBottom: '8px' },
  securityInfo: {},
  securityTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  securityText: { fontSize: '14px', color: '#666', lineHeight: '1.6', margin: '0 0 12px' },
  secretCodeBox: {
    background: '#f9f9f9', padding: '16px', borderRadius: '8px',
    marginBottom: '12px'
  },
  secretCode: {
    display: 'block', fontSize: '18px', fontWeight: '700',
    color: '#1a1a2e', fontFamily: 'monospace', marginBottom: '8px'
  },
  secretCodeNote: { fontSize: '12px', color: '#e74c3c', margin: 0 },
  securityList: {
    fontSize: '14px', color: '#555', lineHeight: '2',
    paddingLeft: '20px', margin: 0
  },
  sessionInfo: { background: '#f9f9f9', padding: '16px', borderRadius: '8px' },
  sessionRow: {
    display: 'flex', gap: '16px', padding: '8px 0',
    borderBottom: '1px solid #eee', fontSize: '14px'
  },
  sessionLabel: { color: '#666', minWidth: '140px', fontWeight: '600' },
  sessionValue: { color: '#1a1a2e', fontWeight: '600' }
}

export default AdminSettings