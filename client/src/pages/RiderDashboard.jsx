import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function RiderDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const { data } = await API.get('/rides/my-rides')
      setRides(data)
    } catch (err) {
      setError('Failed to load rides')
    }
    setLoading(false)
  }

  const handleAcceptDriver = async (rideId, driverId) => {
    try {
      await API.put(`/rides/accept-driver/${rideId}`, { driverId })
      setMessage('Driver accepted! Your ride is on the way.')
      fetchRides()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept driver')
    }
  }

  const handleConfirmRide = async (rideId) => {
    try {
      const { data } = await API.put(`/rides/confirm/${rideId}`)
      setMessage(data.message)
      fetchRides()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to confirm ride')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeRides = rides.filter(r =>
    ['pending', 'accepted', 'ongoing', 'driver_completed'].includes(r.status)
  )
  const completedRides = rides.filter(r => r.status === 'completed')
  const displayRides = activeTab === 'active' ? activeRides : completedRides

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6c90e',
      accepted: '#3498db',
      ongoing: '#9b59b6',
      driver_completed: '#e67e22',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    }
    return colors[status] || '#999'
  }

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Waiting for drivers...',
      accepted: 'Driver on the way',
      ongoing: 'Ride in progress',
      driver_completed: 'Driver marked complete - Confirm?',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>🚗 RideShare</h1>
        <div style={styles.navLinks}>
          <span style={styles.greeting}>Hi, {user?.name?.split(' ')[0]}!</span>
          <Link to="/profile" style={styles.navBtn}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{rides.length}</p>
            <p style={styles.statLabel}>Total Rides</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{completedRides.length}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{activeRides.length}</p>
            <p style={styles.statLabel}>Active</p>
          </div>
          <div style={{
            ...styles.bookCard,
          }}
            onClick={() => navigate('/book-ride')}
          >
            <span style={styles.bookIcon}>🚕</span>
            <p style={styles.bookText}>Book a Ride</p>
          </div>
        </div>

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

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'active' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('active')}
          >
            Active Rides ({activeRides.length})
          </button>
          <button
            style={activeTab === 'completed' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedRides.length})
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading rides...</p>
        ) : displayRides.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🚗</p>
            <p style={styles.emptyText}>
              {activeTab === 'active' ? 'No active rides' : 'No completed rides yet'}
            </p>
            {activeTab === 'active' && (
              <button style={styles.bookBtn} onClick={() => navigate('/book-ride')}>
                Book Your First Ride
              </button>
            )}
          </div>
        ) : (
          <div style={styles.ridesList}>
            {displayRides.map((ride) => (
              <div key={ride._id} style={styles.rideCard}>
                {/* Ride Header */}
                <div style={styles.rideHeader}>
                  <div style={styles.rideHeaderLeft}>
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(ride.status)
                    }}>
                      {ride.status === 'driver_completed' ? '⏳ Awaiting Confirmation' : ride.status.toUpperCase()}
                    </span>
                    <span style={styles.fare}>₦{ride.fare?.toLocaleString()}</span>
                  </div>
                  <span style={styles.rideDate}>
                    {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                {/* Ride Locations */}
                <div style={styles.locations}>
                  <div style={styles.locationRow}>
                    <span style={styles.locationDot}>🟢</span>
                    <p style={styles.locationText}>{ride.pickupLocation?.address}</p>
                  </div>
                  <div style={styles.locationLine}></div>
                  <div style={styles.locationRow}>
                    <span style={styles.locationDot}>🔴</span>
                    <p style={styles.locationText}>{ride.dropoffLocation?.address}</p>
                  </div>
                </div>

                {/* Status Message */}
                <p style={styles.statusMsg}>{getStatusLabel(ride.status)}</p>

                {/* Assigned Driver */}
                {ride.driver && ride.status !== 'pending' && (
                  <div style={styles.driverBox}>
                    <div style={styles.driverAvatar}>
                      {ride.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.driverInfo}>
                      <p style={styles.driverName}>{ride.driver?.name}</p>
                      <p style={styles.driverPhone}>{ride.driver?.phone}</p>
                    </div>
                    <div style={styles.driverRating}>
                      <span style={styles.stars}>
                        {'⭐'.repeat(Math.round(ride.driver?.rating || 0))}
                      </span>
                      <span style={styles.ratingNum}>
                        {ride.driver?.rating || 'No rating'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Driver Requests — Rider picks a driver */}
                {ride.status === 'pending' &&
                  ride.driverRequests?.length > 0 && (
                    <div style={styles.requestsBox}>
                      <p style={styles.requestsTitle}>
                        🚘 {ride.driverRequests.length} Driver(s) Available — Pick One:
                      </p>
                      {ride.driverRequests.map((req) => (
                        <div key={req.driver?._id} style={styles.driverRequestCard}>
                          <div style={styles.driverAvatar}>
                            {req.driver?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={styles.driverInfo}>
                            <p style={styles.driverName}>{req.driver?.name}</p>
                            <p style={styles.driverPhone}>{req.driver?.phone}</p>
                            <div style={styles.driverRatingRow}>
                              <span>⭐ {req.driver?.rating || 'New driver'}</span>
                            </div>
                          </div>
                          <button
                            style={styles.acceptDriverBtn}
                            onClick={() => handleAcceptDriver(ride._id, req.driver?._id)}
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Confirm Ride Button */}
                {ride.status === 'driver_completed' && (
                  <div style={styles.confirmBox}>
                    <p style={styles.confirmText}>
                      Your driver has completed the ride. Please confirm to proceed with payment and rating.
                    </p>
                    <button
                      style={styles.confirmBtn}
                      onClick={() => handleConfirmRide(ride._id)}
                    >
                      ✅ Confirm & Pay ₦{ride.fare?.toLocaleString()}
                    </button>
                  </div>
                )}

                {/* Rate Driver after completion */}
                {ride.status === 'completed' && !ride.isRated && (
                  <div style={styles.rateBox}>
                    <p style={styles.rateText}>How was your experience?</p>
                    <button
                      style={styles.rateBtn}
                      onClick={() => navigate(`/rate-driver/${ride._id}/${ride.driver?._id}`)}
                    >
                      ⭐ Rate Your Driver
                    </button>
                  </div>
                )}

                {ride.status === 'completed' && ride.isRated && (
                  <div style={styles.ratedBox}>
                    <p style={styles.ratedText}>✅ You have rated this ride</p>
                  </div>
                )}
              </div>
            ))}
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
  navLinks: { display: 'flex', gap: '12px', alignItems: 'center' },
  greeting: { color: '#ccc', fontSize: '14px' },
  navBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)'
  },
  logoutBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  content: { padding: '32px 40px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: {
    background: '#fff', padding: '20px 28px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center', minWidth: '120px'
  },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '12px', color: '#999', margin: 0, fontWeight: '600' },
  bookCard: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    padding: '20px 28px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)',
    textAlign: 'center', cursor: 'pointer', minWidth: '120px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
  },
  bookIcon: { fontSize: '28px' },
  bookText: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  success: {
    background: 'linear-gradient(135deg, #e0ffe0, #d0f0d0)',
    color: '#060', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,200,0,0.15)'
  },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(200,0,0,0.15)'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  loading: { color: '#666', textAlign: 'center', padding: '40px' },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', margin: '0 0 16px' },
  emptyText: { color: '#999', fontSize: '16px', margin: '0 0 24px' },
  bookBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '12px 32px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  ridesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rideCard: {
    background: '#fff', padding: '24px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  rideHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  rideHeaderLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  statusBadge: {
    color: '#fff', padding: '4px 12px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  fare: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e' },
  rideDate: { fontSize: '12px', color: '#999' },
  locations: { marginBottom: '12px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  locationDot: { fontSize: '12px' },
  locationText: { fontSize: '14px', color: '#333', margin: '4px 0' },
  locationLine: {
    width: '2px', height: '16px', background: '#ddd',
    marginLeft: '6px', marginBottom: '4px'
  },
  statusMsg: {
    fontSize: '13px', color: '#666', fontStyle: 'italic',
    margin: '8px 0 12px', padding: '8px 12px',
    background: '#f9f9f9', borderRadius: '8px'
  },
  driverBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', background: '#f0f9ff',
    borderRadius: '10px', marginBottom: '12px',
    border: '1px solid #d0e8f8'
  },
  driverAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  driverPhone: { fontSize: '12px', color: '#999', margin: 0 },
  driverRating: { textAlign: 'right' },
  stars: { fontSize: '14px' },
  ratingNum: { fontSize: '12px', color: '#666', display: 'block' },
  requestsBox: {
    background: '#fffbf0', border: '2px solid #f6c90e',
    borderRadius: '12px', padding: '16px', marginBottom: '12px'
  },
  requestsTitle: {
    fontSize: '14px', fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 12px'
  },
  driverRequestCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px', background: '#fff', borderRadius: '8px',
    marginBottom: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  driverRatingRow: { fontSize: '12px', color: '#666', marginTop: '2px' },
  acceptDriverBtn: {
    background: '#2ecc71', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(46,204,113,0.3)'
  },
  confirmBox: {
    background: 'linear-gradient(135deg, #fff8e0, #fff3cc)',
    border: '2px solid #f6c90e', borderRadius: '12px',
    padding: '16px', marginBottom: '12px'
  },
  confirmText: { fontSize: '14px', color: '#666', margin: '0 0 12px' },
  confirmBtn: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)'
  },
  rateBox: {
    background: '#f0f9ff', border: '1px solid #d0e8f8',
    borderRadius: '10px', padding: '12px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  rateText: { fontSize: '14px', color: '#333', margin: 0 },
  rateBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  ratedBox: {
    background: '#e0ffe0', borderRadius: '10px',
    padding: '10px 16px', textAlign: 'center'
  },
  ratedText: { fontSize: '13px', color: '#060', margin: 0, fontWeight: '600' }
}

export default RiderDashboard