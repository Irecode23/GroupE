import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import useWindowSize from '../hooks/useWindowSize'
import NotificationBell from '../components/NotificationBell'

function RiderDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchRides()
    const interval = setInterval(fetchRides, 30000)
    return () => clearInterval(interval)
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

  const handleCancelRide = async (rideId) => {
    if (!window.confirm('Are you sure you want to cancel this ride?')) return
    try {
      await API.put(`/rides/cancel/${rideId}`)
      setMessage('Ride cancelled successfully')
      fetchRides()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel ride')
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
      pending: '#f6c90e', accepted: '#3498db',
      ongoing: '#9b59b6', driver_completed: '#e67e22',
      completed: '#2ecc71', cancelled: '#e74c3c'
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
          {isMobile ? (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <NotificationBell />
              <button
                style={styles.menuBtn}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          ) : (
            <>
              <span style={styles.greeting}>Hi, {user?.name?.split(' ')[0]}!</span>
              <Link to="/my-rides" style={styles.navBtn}>My Rides</Link>
              <Link to="/complaints" style={styles.navBtn}>📝 Complaints</Link>
              <Link to="/profile" style={styles.navBtn}>Profile</Link>
              <NotificationBell />
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <p style={styles.mobileMenuName}>Hi, {user?.name}!</p>
          <Link to="/my-rides" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
            📋 My Rides
          </Link>
          <Link to="/complaints" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
            📝 Complaints
          </Link>
          <Link to="/profile" style={styles.mobileMenuItem} onClick={() => setMenuOpen(false)}>
            👤 Profile
          </Link>
          <button style={styles.mobileMenuLogout} onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      )}

      <div style={{ ...styles.content, padding: isMobile ? '20px 16px' : '32px 40px' }}>
        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{rides.length}</p>
            <p style={styles.statLabel}>Total</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{completedRides.length}</p>
            <p style={styles.statLabel}>Done</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{activeRides.length}</p>
            <p style={styles.statLabel}>Active</p>
          </div>
          <div style={styles.bookCard} onClick={() => navigate('/book-ride')}>
            <span style={styles.bookIcon}>🚕</span>
            <p style={styles.bookText}>Book Ride</p>
          </div>
        </div>

        {message && (
          <div style={styles.success} onClick={() => setMessage('')}>✅ {message}</div>
        )}
        {error && (
          <div style={styles.error} onClick={() => setError('')}>❌ {error}</div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={activeTab === 'active' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeRides.length})
          </button>
          <button
            style={activeTab === 'completed' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedRides.length})
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading rides...</p>
          </div>
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
                <div style={styles.rideHeader}>
                  <div style={styles.rideHeaderLeft}>
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(ride.status)
                    }}>
                      {ride.status === 'driver_completed' ? '⏳ Confirm?' : ride.status.toUpperCase()}
                    </span>
                    <span style={styles.fare}>₦{ride.fare?.toLocaleString()}</span>
                  </div>
                  <span style={styles.rideDate}>
                    {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short'
                    })}
                  </span>
                </div>

                <div style={styles.locations}>
                  <div style={styles.locationRow}>
                    <span>🟢</span>
                    <p style={styles.locationText}>{ride.pickupLocation?.address}</p>
                  </div>
                  <div style={styles.locationLine} />
                  <div style={styles.locationRow}>
                    <span>🔴</span>
                    <p style={styles.locationText}>{ride.dropoffLocation?.address}</p>
                  </div>
                </div>

                <p style={styles.statusMsg}>{getStatusLabel(ride.status)}</p>

                {ride.driver && ride.status !== 'pending' && (
                  <div style={styles.driverBox}>
                    <div style={styles.driverAvatar}>
                      {ride.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.driverInfo}>
                      <p style={styles.driverName}>{ride.driver?.name}</p>
                      <p style={styles.driverPhone}>{ride.driver?.phone}</p>
                    </div>
                    {ride.driver?.rating > 0 && (
                      <span style={styles.ratingBadge}>⭐ {ride.driver?.rating}</span>
                    )}
                  </div>
                )}

                {ride.status === 'pending' && ride.driverRequests?.length > 0 && (
                  <div style={styles.requestsBox}>
                    <p style={styles.requestsTitle}>
                      🚘 {ride.driverRequests.length} Driver(s) Available:
                    </p>
                    {ride.driverRequests.map((req) => (
                      <div key={req.driver?._id} style={styles.driverRequestCard}>
                        <div style={styles.driverAvatar}>
                          {req.driver?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.driverInfo}>
                          <p style={styles.driverName}>{req.driver?.name}</p>
                          <p style={styles.driverPhone}>⭐ {req.driver?.rating || 'New'}</p>
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

                {ride.status === 'driver_completed' && (
                  <div style={styles.confirmBox}>
                    <p style={styles.confirmText}>
                      Driver completed the ride. Confirm to pay.
                    </p>
                    <button
                      style={styles.confirmBtn}
                      onClick={() => handleConfirmRide(ride._id)}
                    >
                      ✅ Confirm & Pay ₦{ride.fare?.toLocaleString()}
                    </button>
                  </div>
                )}

                {['pending', 'accepted'].includes(ride.status) && (
                  <button
                    style={styles.cancelBtn}
                    onClick={() => handleCancelRide(ride._id)}
                  >
                    ❌ Cancel Ride
                  </button>
                )}

                {ride.status === 'completed' && !ride.isRated && (
                  <button
                    style={styles.rateBtn}
                    onClick={() => navigate(`/rate-driver/${ride._id}/${ride.driver?._id}`)}
                  >
                    ⭐ Rate Your Driver
                  </button>
                )}

                {ride.status === 'completed' && ride.isRated && (
                  <div style={styles.ratedBox}>✅ You have rated this ride</div>
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
    padding: '14px 20px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100
  },
  logo: { color: '#f6c90e', margin: 0, fontSize: '20px', fontWeight: '800' },
  navLinks: { display: 'flex', gap: '8px', alignItems: 'center' },
  greeting: { color: '#ccc', fontSize: '14px' },
  navBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 14px',
    borderRadius: '8px', fontSize: '13px', background: 'rgba(255,255,255,0.1)'
  },
  logoutBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '8px 14px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  menuBtn: {
    background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
    padding: '8px 12px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer'
  },
  mobileMenu: {
    background: '#1a1a2e', padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', flexDirection: 'column', gap: '8px'
  },
  mobileMenuName: { color: '#f6c90e', fontWeight: '700', margin: '0 0 8px', fontSize: '15px' },
  mobileMenuItem: {
    color: '#fff', textDecoration: 'none', padding: '12px 16px',
    borderRadius: '8px', background: 'rgba(255,255,255,0.08)',
    fontSize: '14px', fontWeight: '600'
  },
  mobileMenuLogout: {
    background: 'rgba(231,76,60,0.2)', color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.3)',
    padding: '12px 16px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer', textAlign: 'left'
  },
  content: { maxWidth: '800px', margin: '0 auto' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '20px' },
  statCard: {
    background: '#fff', padding: '16px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1
  },
  statNumber: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '11px', color: '#999', margin: 0, fontWeight: '600' },
  bookCard: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    padding: '16px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)',
    textAlign: 'center', cursor: 'pointer', flex: 1,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
  },
  bookIcon: { fontSize: '24px' },
  bookText: { fontSize: '11px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  success: {
    background: '#e0ffe0', color: '#060', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', flex: 1, textAlign: 'center'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', flex: 1, textAlign: 'center'
  },
  loadingBox: { textAlign: 'center', padding: '40px' },
  spinner: {
    width: '40px', height: '40px', border: '4px solid #f0f0f0',
    borderTop: '4px solid #f6c90e', borderRadius: '50%',
    margin: '0 auto 16px', animation: 'spin 1s linear infinite'
  },
  loadingText: { color: '#666', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '40px 20px' },
  emptyIcon: { fontSize: '56px', margin: '0 0 12px' },
  emptyText: { color: '#999', fontSize: '15px', margin: '0 0 20px' },
  bookBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '12px 28px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  ridesList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  rideCard: {
    background: '#fff', padding: '20px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  rideHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '14px'
  },
  rideHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  statusBadge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '10px', fontWeight: '700'
  },
  fare: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e' },
  rideDate: { fontSize: '11px', color: '#999' },
  locations: { marginBottom: '10px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  locationText: { fontSize: '13px', color: '#333', margin: '4px 0' },
  locationLine: {
    width: '2px', height: '14px', background: '#ddd', marginLeft: '6px'
  },
  statusMsg: {
    fontSize: '12px', color: '#666', fontStyle: 'italic',
    margin: '8px 0', padding: '6px 10px',
    background: '#f9f9f9', borderRadius: '6px'
  },
  driverBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 14px', background: '#f0f9ff',
    borderRadius: '10px', marginBottom: '10px'
  },
  driverAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  driverPhone: { fontSize: '11px', color: '#999', margin: 0 },
  ratingBadge: {
    background: '#fff8e0', color: '#b8860b', padding: '3px 8px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700'
  },
  requestsBox: {
    background: '#fffbf0', border: '2px solid #f6c90e',
    borderRadius: '10px', padding: '12px', marginBottom: '10px'
  },
  requestsTitle: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 10px' },
  driverRequestCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '8px', background: '#fff', borderRadius: '8px',
    marginBottom: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
  },
  acceptDriverBtn: {
    background: '#2ecc71', color: '#fff', border: 'none',
    padding: '8px 14px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '700', cursor: 'pointer'
  },
  confirmBox: {
    background: '#fff8e0', border: '2px solid #f6c90e',
    borderRadius: '10px', padding: '14px', marginBottom: '10px'
  },
  confirmText: { fontSize: '13px', color: '#666', margin: '0 0 10px' },
  confirmBtn: {
    width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '800', cursor: 'pointer'
  },
  cancelBtn: {
    width: '100%', padding: '10px',
    background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.3)', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '8px'
  },
  rateBtn: {
    width: '100%', padding: '10px',
    background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  ratedBox: {
    textAlign: 'center', padding: '10px', background: '#e0ffe0',
    borderRadius: '8px', fontSize: '13px', color: '#060', fontWeight: '600'
  }
}

export default RiderDashboard