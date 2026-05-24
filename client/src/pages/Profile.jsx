import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Profile() {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [ratings, setRatings] = useState([])
  const [ratingsLoading, setRatingsLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'ratings') fetchRatings()
  }, [activeTab])

  const fetchRatings = async () => {
    setRatingsLoading(true)
    try {
      const { data } = await API.get(`/ratings/user/${user._id}`)
      setRatings(data)
    } catch (err) {
      console.error('Failed to load ratings')
    }
    setRatingsLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const { data } = await API.put('/users/profile', formData)
      login({ ...user, name: data.name, phone: data.phone })
      setMessage('Profile updated successfully!')
      setFormData({ ...formData, password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    }
    setLoading(false)
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#f6c90e' : '#ddd', fontSize: '18px' }}>★</span>
    ))
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>🚗 RideShare</h1>
        <Link
          to={user?.role === 'driver' ? '/driver/dashboard' : '/rider/dashboard'}
          style={styles.backBtn}
        >
          ← Dashboard
        </Link>
      </nav>

      <div style={styles.content}>
        {/* Profile Header */}
        <div style={styles.profileHeader}>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user?.isVerified && (
              <div style={styles.verifiedBadge}>✅</div>
            )}
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{user?.name}</h2>
            <p style={styles.profileEmail}>{user?.email}</p>
            <div style={styles.profileBadges}>
              <span style={{
                ...styles.roleBadge,
                background: user?.role === 'driver'
                  ? 'linear-gradient(135deg, #1a1a2e, #2d2d4e)'
                  : 'linear-gradient(135deg, #3498db, #2980b9)'
              }}>
                {user?.role === 'driver' ? '🚘' : '🙋'} {user?.role?.toUpperCase()}
              </span>
              {user?.isVerified ? (
                <span style={styles.verifiedTag}>✅ Verified</span>
              ) : (
                <span style={styles.pendingTag}>⏳ Pending Verification</span>
              )}
            </div>
            {user?.rating > 0 && (
              <div style={styles.ratingRow}>
                {renderStars(Math.round(user.rating))}
                <span style={styles.ratingText}>{user.rating} rating</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'profile', label: '👤 Edit Profile' },
            { key: 'ratings', label: '⭐ My Ratings' },
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
            <h3 style={styles.cardTitle}>Personal Information</h3>
            <p style={styles.cardSubtitle}>Update your profile details</p>

            {message && (
              <div style={styles.success} onClick={() => setMessage('')}>
                ✅ {message}
              </div>
            )}
            {error && (
              <div style={styles.error} onClick={() => setError('')}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>👤 Full Name</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📱 Phone Number</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📧 Email Address</label>
                  <input
                    style={{ ...styles.input, background: '#f5f5f5', color: '#999' }}
                    type="email"
                    value={user?.email}
                    disabled
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>🔒 New Password (optional)</label>
                  <input
                    style={styles.input}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>
              <button style={styles.saveBtn} type="submit" disabled={loading}>
                {loading ? '⏳ Saving...' : 'Save Changes →'}
              </button>
            </form>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div style={styles.card}>
            <div style={styles.ratingsHeader}>
              <div>
                <h3 style={styles.cardTitle}>My Ratings</h3>
                <p style={styles.cardSubtitle}>Reviews from your rides</p>
              </div>
              {ratings.length > 0 && (
                <div style={styles.avgRatingBox}>
                  <p style={styles.avgRatingNumber}>{avgRating}</p>
                  <div>{renderStars(Math.round(avgRating))}</div>
                  <p style={styles.avgRatingLabel}>{ratings.length} reviews</p>
                </div>
              )}
            </div>

            {ratingsLoading ? (
              <p style={styles.loading}>Loading ratings...</p>
            ) : ratings.length === 0 ? (
              <div style={styles.empty}>
                <p style={styles.emptyIcon}>⭐</p>
                <p style={styles.emptyText}>No ratings yet</p>
                <p style={styles.emptySubtext}>Complete rides to receive ratings</p>
              </div>
            ) : (
              <div style={styles.ratingsList}>
                {ratings.map((rating) => (
                  <div key={rating._id} style={styles.ratingCard}>
                    <div style={styles.ratingCardHeader}>
                      <div style={styles.raterAvatar}>
                        {rating.ratedBy?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.raterInfo}>
                        <p style={styles.raterName}>{rating.ratedBy?.name}</p>
                        <p style={styles.raterRole}>{rating.ratedBy?.role}</p>
                      </div>
                      <div style={styles.ratingStars}>
                        {renderStars(rating.rating)}
                      </div>
                    </div>
                    {rating.review && (
                      <p style={styles.reviewText}>"{rating.review}"</p>
                    )}
                    <p style={styles.ratingDate}>
                      {new Date(rating.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Security Settings</h3>
            <p style={styles.cardSubtitle}>Keep your account safe</p>

            <div style={styles.securityItems}>
              <div style={styles.securityItem}>
                <div style={styles.securityIcon}>🔒</div>
                <div style={styles.securityInfo}>
                  <h4 style={styles.securityTitle}>Password</h4>
                  <p style={styles.securityText}>
                    Use a strong password to protect your account
                  </p>
                </div>
                <button
                  style={styles.changeBtn}
                  onClick={() => setActiveTab('profile')}
                >
                  Change
                </button>
              </div>

              <div style={styles.securityItem}>
                <div style={styles.securityIcon}>✅</div>
                <div style={styles.securityInfo}>
                  <h4 style={styles.securityTitle}>Account Verification</h4>
                  <p style={styles.securityText}>
                    {user?.isVerified
                      ? 'Your account has been verified by admin'
                      : 'Your account is pending admin verification'}
                  </p>
                </div>
                <span style={{
                  ...styles.securityStatus,
                  background: user?.isVerified ? '#e0ffe0' : '#fff8e0',
                  color: user?.isVerified ? '#060' : '#b8860b'
                }}>
                  {user?.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div style={styles.securityItem}>
                <div style={styles.securityIcon}>📱</div>
                <div style={styles.securityInfo}>
                  <h4 style={styles.securityTitle}>Phone Number</h4>
                  <p style={styles.securityText}>{user?.phone || 'Not set'}</p>
                </div>
                <button
                  style={styles.changeBtn}
                  onClick={() => setActiveTab('profile')}
                >
                  Update
                </button>
              </div>

              <div style={styles.securityItem}>
                <div style={styles.securityIcon}>🛡️</div>
                <div style={styles.securityInfo}>
                  <h4 style={styles.securityTitle}>Account Status</h4>
                  <p style={styles.securityText}>
                    {user?.isActive !== false
                      ? 'Your account is active and in good standing'
                      : 'Your account has been suspended'}
                  </p>
                </div>
                <span style={{
                  ...styles.securityStatus,
                  background: '#e0ffe0', color: '#060'
                }}>
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 40px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
  },
  logo: { color: '#f6c90e', margin: 0, fontSize: '24px', fontWeight: '800' },
  backBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)',
    fontWeight: '600'
  },
  content: { padding: '32px 40px', maxWidth: '900px', margin: '0 auto' },
  profileHeader: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '32px', borderRadius: '20px', marginBottom: '24px',
    display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
    boxShadow: '0 8px 32px rgba(26,26,46,0.3)'
  },
  avatarBox: { position: 'relative' },
  avatar: {
    width: '88px', height: '88px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', fontSize: '36px', fontWeight: '900',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(246,201,14,0.4)'
  },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: '24px', height: '24px', background: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: '0 0 4px' },
  profileEmail: { color: '#aaa', fontSize: '15px', margin: '0 0 12px' },
  profileBadges: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  roleBadge: {
    color: '#fff', padding: '5px 14px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  verifiedTag: {
    background: 'rgba(46,204,113,0.2)', color: '#2ecc71',
    padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    border: '1px solid rgba(46,204,113,0.3)'
  },
  pendingTag: {
    background: 'rgba(246,201,14,0.2)', color: '#f6c90e',
    padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
    border: '1px solid rgba(246,201,14,0.3)'
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  ratingText: { color: '#aaa', fontSize: '13px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  card: {
    background: '#fff', padding: '32px', borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
  },
  cardTitle: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  cardSubtitle: { color: '#666', fontSize: '14px', margin: '0 0 24px' },
  success: {
    background: 'linear-gradient(135deg, #e0ffe0, #d0f0d0)',
    color: '#060', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px', cursor: 'pointer'
  },
  formGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px', marginBottom: '24px'
  },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '700', color: '#333' },
  input: {
    padding: '13px 16px', borderRadius: '10px', border: '2px solid #eee',
    fontSize: '14px', outline: 'none', background: '#fafafa', boxSizing: 'border-box'
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', padding: '14px 32px',
    borderRadius: '10px', fontSize: '15px', fontWeight: '800',
    cursor: 'pointer', boxShadow: '0 4px 15px rgba(246,201,14,0.4)'
  },
  ratingsHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px'
  },
  avgRatingBox: { textAlign: 'center' },
  avgRatingNumber: {
    fontSize: '48px', fontWeight: '900', color: '#1a1a2e', margin: '0 0 4px'
  },
  avgRatingLabel: { fontSize: '12px', color: '#999', margin: '4px 0 0' },
  loading: { color: '#666', textAlign: 'center', padding: '40px' },
  empty: { textAlign: 'center', padding: '40px' },
  emptyIcon: { fontSize: '48px', margin: '0 0 12px' },
  emptyText: { fontSize: '18px', fontWeight: '700', color: '#333', margin: '0 0 8px' },
  emptySubtext: { fontSize: '14px', color: '#999', margin: 0 },
  ratingsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  ratingCard: {
    padding: '16px', background: '#f9f9f9', borderRadius: '12px',
    border: '1px solid #eee'
  },
  ratingCardHeader: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'
  },
  raterAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  raterInfo: { flex: 1 },
  raterName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  raterRole: { fontSize: '12px', color: '#999', margin: 0 },
  ratingStars: { display: 'flex' },
  reviewText: {
    fontSize: '14px', color: '#555', fontStyle: 'italic',
    margin: '0 0 8px', lineHeight: '1.5'
  },
  ratingDate: { fontSize: '12px', color: '#aaa', margin: 0 },
  securityItems: { display: 'flex', flexDirection: 'column', gap: '16px' },
  securityItem: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px', background: '#f9f9f9', borderRadius: '12px',
    border: '1px solid #eee'
  },
  securityIcon: {
    width: '44px', height: '44px', background: '#fff', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  securityInfo: { flex: 1 },
  securityTitle: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  securityText: { fontSize: '13px', color: '#666', margin: 0 },
  securityStatus: {
    padding: '6px 14px', borderRadius: '20px',
    fontSize: '12px', fontWeight: '700', flexShrink: 0
  },
  changeBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0
  }
}

export default Profile