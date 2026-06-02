import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import useWindowSize from '../hooks/useWindowSize'

function SubmitComplaint() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    description: '',
    ride: ''
  })
  const [rides, setRides] = useState([])
  const [myComplaints, setMyComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingRides, setFetchingRides] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('submit')

  useEffect(() => {
    fetchRides()
    fetchMyComplaints()
  }, [])

  const fetchRides = async () => {
    try {
      const { data } = await API.get('/rides/my-rides')
      setRides(data.filter(r => r.status === 'completed'))
    } catch (err) {
      console.error('Failed to fetch rides')
    }
    setFetchingRides(false)
  }

  const fetchMyComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/my-complaints')
      setMyComplaints(data)
    } catch (err) {
      console.error('Failed to fetch complaints')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.category) {
      setError('Please select a category')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/complaints', {
        category: formData.category,
        subject: formData.subject,
        description: formData.description,
        ride: formData.ride || undefined
      })
      setMessage('Complaint submitted successfully! Our admin will review it shortly.')
      setFormData({ category: '', subject: '', description: '', ride: '' })
      fetchMyComplaints()
      setActiveTab('history')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint')
    }
    setLoading(false)
  }

  const categories = [
    { value: 'driver_behavior', label: '🚘 Driver Behavior', desc: 'Rude, unsafe, or unprofessional driver' },
    { value: 'rider_behavior', label: '🙋 Rider Behavior', desc: 'Rude or problematic rider' },
    { value: 'payment_issue', label: '💰 Payment Issue', desc: 'Wrong charge or payment problem' },
    { value: 'app_issue', label: '📱 App Issue', desc: 'Bug or technical problem' },
    { value: 'safety_concern', label: '🔒 Safety Concern', desc: 'Safety related issue' },
    { value: 'other', label: '📝 Other', desc: 'Any other complaint' },
  ]

  const getStatusColor = (status) => {
    const colors = {
      open: '#e74c3c', investigating: '#f6c90e',
      resolved: '#2ecc71', dismissed: '#999'
    }
    return colors[status] || '#999'
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

      <div style={{
        ...styles.content,
        padding: isMobile ? '20px 16px' : '32px 40px'
      }}>
        <div style={styles.pageHeader}>
          <h2 style={styles.title}>📝 Complaints & Support</h2>
          <p style={styles.subtitle}>Submit a complaint or view your complaint history</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'submit' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('submit')}
          >
            📝 Submit Complaint
          </button>
          <button
            style={activeTab === 'history' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('history')}
          >
            📋 My Complaints ({myComplaints.length})
          </button>
        </div>

        {/* Submit Tab */}
        {activeTab === 'submit' && (
          <div style={styles.formCard}>
            <h3 style={styles.cardTitle}>Submit a New Complaint</h3>
            <p style={styles.cardSubtitle}>
              We take all complaints seriously. Our admin will review and respond within 24 hours.
            </p>

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
              {/* Category Selection */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>📂 Category *</label>
                <div style={{
                  ...styles.categoryGrid,
                  gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)'
                }}>
                  {categories.map((cat) => (
                    <div
                      key={cat.value}
                      style={{
                        ...styles.categoryCard,
                        border: formData.category === cat.value
                          ? '2px solid #f6c90e'
                          : '2px solid #eee',
                        background: formData.category === cat.value
                          ? 'rgba(246,201,14,0.08)'
                          : '#fff'
                      }}
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                    >
                      <p style={styles.categoryLabel}>{cat.label}</p>
                      <p style={styles.categoryDesc}>{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Ride */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>🚗 Related Ride (optional)</label>
                <select
                  style={styles.input}
                  name="ride"
                  value={formData.ride}
                  onChange={handleChange}
                >
                  <option value="">No specific ride</option>
                  {rides.map((ride) => (
                    <option key={ride._id} value={ride._id}>
                      {new Date(ride.createdAt).toLocaleDateString()} —{' '}
                      {ride.pickupLocation?.address} → {ride.dropoffLocation?.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>📌 Subject *</label>
                <input
                  style={styles.input}
                  type="text"
                  name="subject"
                  placeholder="Brief summary of your complaint"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>📄 Description *</label>
                <textarea
                  style={styles.textarea}
                  name="description"
                  placeholder="Describe your complaint in detail. Include what happened, when, and any relevant information..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
                <p style={styles.charCount}>
                  {formData.description.length} characters
                </p>
              </div>

              <button style={styles.submitBtn} type="submit" disabled={loading}>
                {loading ? '⏳ Submitting...' : '📤 Submit Complaint'}
              </button>
            </form>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div>
            {message && (
              <div style={styles.success} onClick={() => setMessage('')}>
                ✅ {message}
              </div>
            )}

            {myComplaints.length === 0 ? (
              <div style={styles.empty}>
                <p style={styles.emptyIcon}>📭</p>
                <p style={styles.emptyText}>No complaints submitted yet</p>
                <button
                  style={styles.submitNewBtn}
                  onClick={() => setActiveTab('submit')}
                >
                  Submit a Complaint
                </button>
              </div>
            ) : (
              <div style={styles.complaintsList}>
                {myComplaints.map((complaint) => (
                  <div key={complaint._id} style={styles.complaintCard}>
                    <div style={styles.complaintHeader}>
                      <div style={styles.complaintHeaderLeft}>
                        <span style={{
                          ...styles.statusBadge,
                          background: getStatusColor(complaint.status)
                        }}>
                          {complaint.status.toUpperCase()}
                        </span>
                        <span style={styles.categoryTag}>
                          {categories.find(c => c.value === complaint.category)?.label || complaint.category}
                        </span>
                      </div>
                      <span style={styles.date}>
                        {new Date(complaint.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>

                    <h4 style={styles.complaintSubject}>{complaint.subject}</h4>
                    <p style={styles.complaintDescription}>{complaint.description}</p>

                    {complaint.adminResponse && (
                      <div style={styles.adminResponseBox}>
                        <p style={styles.adminResponseLabel}>👨‍💼 Admin Response:</p>
                        <p style={styles.adminResponseText}>{complaint.adminResponse}</p>
                      </div>
                    )}

                    {complaint.resolvedAt && (
                      <p style={styles.resolvedText}>
                        ✅ Resolved on {new Date(complaint.resolvedAt).toLocaleDateString('en-NG')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
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
    padding: '14px 20px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100
  },
  logo: { color: '#f6c90e', margin: 0, fontSize: '20px', fontWeight: '800' },
  backBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', fontWeight: '600'
  },
  content: { maxWidth: '800px', margin: '0 auto' },
  pageHeader: { marginBottom: '24px' },
  title: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', flex: 1, textAlign: 'center'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', flex: 1, textAlign: 'center',
    boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  formCard: {
    background: '#fff', padding: '32px', borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
  },
  cardTitle: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  cardSubtitle: { color: '#666', fontSize: '14px', margin: '0 0 24px' },
  success: {
    background: '#e0ffe0', color: '#060', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '20px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '20px', fontSize: '14px', cursor: 'pointer'
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '10px', fontSize: '13px', fontWeight: '700', color: '#333' },
  categoryGrid: { display: 'grid', gap: '10px' },
  categoryCard: {
    padding: '12px', borderRadius: '10px', cursor: 'pointer',
    transition: 'all 0.2s'
  },
  categoryLabel: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 4px' },
  categoryDesc: { fontSize: '11px', color: '#999', margin: 0 },
  input: {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  textarea: {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa',
    resize: 'vertical', fontFamily: 'sans-serif'
  },
  charCount: { fontSize: '11px', color: '#aaa', margin: '4px 0 0', textAlign: 'right' },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)'
  },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '56px', margin: '0 0 12px' },
  emptyText: { color: '#999', fontSize: '15px', margin: '0 0 20px' },
  submitNewBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '12px 28px', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  complaintsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  complaintCard: {
    background: '#fff', padding: '24px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  complaintHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px'
  },
  complaintHeaderLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusBadge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  categoryTag: {
    background: '#f0f0f0', color: '#666', padding: '3px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '600'
  },
  date: { fontSize: '12px', color: '#999' },
  complaintSubject: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  complaintDescription: {
    fontSize: '14px', color: '#555', margin: '0 0 16px', lineHeight: '1.6'
  },
  adminResponseBox: {
    background: '#f0f9ff', padding: '14px 16px', borderRadius: '10px',
    borderLeft: '3px solid #3498db', marginBottom: '10px'
  },
  adminResponseLabel: { fontSize: '12px', fontWeight: '700', color: '#3498db', margin: '0 0 6px' },
  adminResponseText: { fontSize: '13px', color: '#555', margin: 0, lineHeight: '1.5' },
  resolvedText: { fontSize: '12px', color: '#2ecc71', fontWeight: '600', margin: 0 }
}

export default SubmitComplaint