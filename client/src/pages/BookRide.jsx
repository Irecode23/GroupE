import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function BookRide() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    pickupAddress: '',
    dropoffAddress: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await API.post('/rides/book', {
        pickupLocation: { address: formData.pickupAddress },
        dropoffLocation: { address: formData.dropoffAddress }
      })
      setSuccess(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book ride')
    }
    setLoading(false)
  }

  const popularLocations = [
    'Murtala Muhammed Airport, Lagos',
    'Victoria Island, Lagos',
    'Ikeja City Mall, Lagos',
    'Lekki Phase 1, Lagos',
    'Oshodi Bus Terminal, Lagos',
    'University of Lagos, Akoka',
  ]

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>🚗 RideShare</h1>
        <div style={styles.navLinks}>
          <span style={styles.greeting}>Hi, {user?.name?.split(' ')[0]}!</span>
          <Link to="/rider/dashboard" style={styles.backBtn}>← Dashboard</Link>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.leftPanel}>
          {/* Form */}
          <div style={styles.card}>
            <h2 style={styles.title}>Book a Ride</h2>
            <p style={styles.subtitle}>Where are you going today?</p>

            {error && <div style={styles.error}>❌ {error}</div>}

            {success ? (
              <div style={styles.successBox}>
                <div style={styles.successIconBox}>
                  <span style={styles.successIcon}>✅</span>
                </div>
                <h3 style={styles.successTitle}>Ride Booked!</h3>
                <p style={styles.successText}>
                  Your ride has been booked. Drivers will see your request and send you ride offers shortly.
                </p>

                <div style={styles.rideDetails}>
                  <div style={styles.rideDetailRow}>
                    <span style={styles.rideDetailIcon}>🟢</span>
                    <div>
                      <p style={styles.rideDetailLabel}>Pickup</p>
                      <p style={styles.rideDetailValue}>{success.pickupLocation.address}</p>
                    </div>
                  </div>
                  <div style={styles.rideDetailDivider} />
                  <div style={styles.rideDetailRow}>
                    <span style={styles.rideDetailIcon}>🔴</span>
                    <div>
                      <p style={styles.rideDetailLabel}>Dropoff</p>
                      <p style={styles.rideDetailValue}>{success.dropoffLocation.address}</p>
                    </div>
                  </div>
                  <div style={styles.fareRow}>
                    <span style={styles.fareLabel}>Estimated Fare</span>
                    <span style={styles.fareValue}>₦{success.fare?.toLocaleString()}</span>
                  </div>
                </div>

                <div style={styles.successNote}>
                  <span>💡</span>
                  <p>Go to your dashboard to see driver offers and accept a driver.</p>
                </div>

                <div style={styles.successButtons}>
                  <button
                    style={styles.primaryBtn}
                    onClick={() => navigate('/rider/dashboard')}
                  >
                    View Dashboard →
                  </button>
                  <button
                    style={styles.secondaryBtn}
                    onClick={() => {
                      setSuccess(null)
                      setFormData({ pickupAddress: '', dropoffAddress: '' })
                    }}
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>📍 Pickup Location</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="pickupAddress"
                    placeholder="Enter your pickup address"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>🏁 Dropoff Location</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="dropoffAddress"
                    placeholder="Enter your destination"
                    value={formData.dropoffAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button style={styles.bookBtn} type="submit" disabled={loading}>
                  {loading ? '⏳ Booking...' : '🚕 Book Ride Now'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={styles.rightPanel}>
          {/* Popular Locations */}
          <div style={styles.card}>
            <h3 style={styles.popularTitle}>📍 Popular Locations</h3>
            <p style={styles.popularSubtitle}>Tap to fill in your destination</p>
            <div style={styles.locationsList}>
              {popularLocations.map((location) => (
                <button
                  key={location}
                  style={styles.locationItem}
                  onClick={() => setFormData({ ...formData, dropoffAddress: location })}
                >
                  <span style={styles.locationPin}>📍</span>
                  <span style={styles.locationName}>{location}</span>
                  <span style={styles.locationArrow}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>💡 How Booking Works</h3>
            <div style={styles.infoSteps}>
              {[
                { icon: '📝', text: 'Enter your pickup and dropoff location' },
                { icon: '🚘', text: 'Drivers will request your ride' },
                { icon: '✅', text: 'You choose which driver to accept' },
                { icon: '🏁', text: 'Driver picks you up and completes the ride' },
                { icon: '⭐', text: 'Rate your driver after the ride' },
              ].map((step, i) => (
                <div key={i} style={styles.infoStep}>
                  <span style={styles.infoStepIcon}>{step.icon}</span>
                  <p style={styles.infoStepText}>{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  navLinks: { display: 'flex', alignItems: 'center', gap: '16px' },
  greeting: { color: '#ccc', fontSize: '14px' },
  backBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)',
    fontWeight: '600'
  },
  content: {
    display: 'flex', gap: '24px', padding: '32px 40px',
    maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap'
  },
  leftPanel: { flex: 1, minWidth: '320px' },
  rightPanel: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: '#fff', padding: '32px', borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)'
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: '0 0 28px', fontSize: '15px' },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '20px', fontSize: '14px'
  },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#333' },
  input: {
    width: '100%', padding: '14px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '15px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  bookBtn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '800', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)', letterSpacing: '0.5px'
  },
  successBox: { textAlign: 'center' },
  successIconBox: {
    width: '80px', height: '80px', background: 'linear-gradient(135deg, #e0ffe0, #c0f0c0)',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 20px', fontSize: '36px'
  },
  successIcon: { fontSize: '40px' },
  successTitle: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  successText: { color: '#666', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.6' },
  rideDetails: {
    background: '#f9f9f9', borderRadius: '12px', padding: '16px',
    marginBottom: '16px', textAlign: 'left'
  },
  rideDetailRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' },
  rideDetailIcon: { fontSize: '16px' },
  rideDetailLabel: { fontSize: '11px', color: '#999', margin: '0 0 2px', fontWeight: '600' },
  rideDetailValue: { fontSize: '14px', color: '#1a1a2e', fontWeight: '600', margin: 0 },
  rideDetailDivider: { height: '1px', background: '#eee', margin: '4px 0' },
  fareRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 0 0', borderTop: '1px solid #eee', marginTop: '8px'
  },
  fareLabel: { fontSize: '13px', color: '#666', fontWeight: '600' },
  fareValue: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e' },
  successNote: {
    display: 'flex', alignItems: 'flex-start', gap: '8px',
    background: 'rgba(246,201,14,0.1)', border: '1px solid rgba(246,201,14,0.3)',
    borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', textAlign: 'left'
  },
  successButtons: { display: 'flex', gap: '12px' },
  primaryBtn: {
    flex: 1, padding: '12px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(246,201,14,0.3)'
  },
  secondaryBtn: {
    flex: 1, padding: '12px', background: '#f5f5f5',
    color: '#333', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  popularTitle: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  popularSubtitle: { fontSize: '13px', color: '#999', margin: '0 0 16px' },
  locationsList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  locationItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px', background: '#f9f9f9', borderRadius: '10px',
    border: '1px solid #eee', cursor: 'pointer', textAlign: 'left',
    transition: 'all 0.2s', width: '100%'
  },
  locationPin: { fontSize: '16px', flexShrink: 0 },
  locationName: { flex: 1, fontSize: '13px', color: '#333', fontWeight: '500' },
  locationArrow: { fontSize: '14px', color: '#f6c90e', fontWeight: '700' },
  infoCard: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '24px', borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(26,26,46,0.3)'
  },
  infoTitle: { fontSize: '16px', fontWeight: '800', color: '#f6c90e', margin: '0 0 16px' },
  infoSteps: { display: 'flex', flexDirection: 'column', gap: '12px' },
  infoStep: { display: 'flex', alignItems: 'center', gap: '12px' },
  infoStepIcon: { fontSize: '20px', flexShrink: 0 },
  infoStepText: { fontSize: '13px', color: '#ccc', margin: 0, lineHeight: '1.4' }
}

export default BookRide