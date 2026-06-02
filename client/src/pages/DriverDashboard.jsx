import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import useWindowSize from '../hooks/useWindowSize'
import NotificationBell from '../components/NotificationBell'

function DriverDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const isMobile = width < 768
  const [availableRides, setAvailableRides] = useState([])
  const [myRides, setMyRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('available')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [availableRes, myRidesRes] = await Promise.all([
        API.get('/rides/available'),
        API.get('/rides/my-rides')
      ])
      setAvailableRides(availableRes.data)
      setMyRides(myRidesRes.data)
    } catch (err) {
      setError('Failed to load rides')
    }
    setLoading(false)
  }

  const handleRequestRide = async (rideId) => {
    try {
      const { data } = await API.put(`/rides/request/${rideId}`)
      setMessage(data.message)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request ride')
    }
  }

  const handleUpdateStatus = async (rideId, status) => {
    try {
      await API.put(`/rides/status/${rideId}`, { status })
      setMessage(status === 'driver_completed'
        ? 'Ride marked as completed! Waiting for rider confirmation.'
        : 'Ride status updated!')
      fetchData()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ride')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const activeRides = myRides.filter(r =>
    ['accepted', 'ongoing', 'driver_completed'].includes(r.status)
  )
  const completedRides = myRides.filter(r => r.status === 'completed')
  const requestedRides = myRides.filter(r =>
    r.status === 'pending' &&
    r.driverRequests?.some(req =>
      req.driver?._id === user?._id || req.driver === user?._id
    )
  )

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6c90e', accepted: '#3498db',
      ongoing: '#9b59b6', driver_completed: '#e67e22',
      completed: '#2ecc71', cancelled: '#e74c3c'
    }
    return colors[status] || '#999'
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
              <div style={styles.availabilityToggle}>
                <span style={{ color: '#ccc', fontSize: '12px' }}>
                  {isAvailable ? '🟢 Online' : '🔴 Offline'}
                </span>
                <div
                  style={{
                    ...styles.toggleSwitch,
                    background: isAvailable ? '#2ecc71' : '#e74c3c'
                  }}
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  <div style={{
                    ...styles.toggleKnob,
                    transform: isAvailable ? 'translateX(20px)' : 'translateX(0px)'
                  }} />
                </div>
              </div>
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
          <div style={styles.mobileAvailability}>
            <span style={{ color: '#ccc', fontSize: '13px' }}>
              Status: {isAvailable ? '🟢 Online' : '🔴 Offline'}
            </span>
            <div
              style={{
                ...styles.toggleSwitch,
                background: isAvailable ? '#2ecc71' : '#e74c3c'
              }}
              onClick={() => setIsAvailable(!isAvailable)}
            >
              <div style={{
                ...styles.toggleKnob,
                transform: isAvailable ? 'translateX(20px)' : 'translateX(0px)'
              }} />
            </div>
          </div>
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
        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{myRides.length}</p>
            <p style={styles.statLabel}>Total</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{completedRides.length}</p>
            <p style={styles.statLabel}>Done</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{availableRides.length}</p>
            <p style={styles.statLabel}>Available</p>
          </div>
          <div style={styles.earningsCard}>
            <p style={styles.earningsNumber}>
              ₦{completedRides.reduce((sum, r) => sum + (r.fare * 0.9), 0).toLocaleString()}
            </p>
            <p style={styles.earningsLabel}>Earnings</p>
          </div>
        </div>

        {!isAvailable && (
          <div style={styles.offlineBanner}>
            🔴 You are offline. Turn on availability to receive ride requests.
          </div>
        )}

        {message && (
          <div style={styles.success} onClick={() => setMessage('')}>✅ {message}</div>
        )}
        {error && (
          <div style={styles.error} onClick={() => setError('')}>❌ {error}</div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'available', label: `Available (${availableRides.length})` },
            { key: 'active', label: `Active (${activeRides.length})` },
            { key: 'requested', label: `Requested (${requestedRides.length})` },
            { key: 'completed', label: `Done (${completedRides.length})` },
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

        {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Loading rides...</p>
          </div>
        ) : (
          <>
            {activeTab === 'available' && (
              <div style={styles.ridesList}>
                {!isAvailable ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🔴</p>
                    <p style={styles.emptyText}>You are offline</p>
                    <button style={styles.goOnlineBtn} onClick={() => setIsAvailable(true)}>
                      Go Online
                    </button>
                  </div>
                ) : availableRides.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🚕</p>
                    <p style={styles.emptyText}>No available rides right now</p>
                    <button style={styles.refreshBtn} onClick={fetchData}>🔄 Refresh</button>
                  </div>
                ) : (
                  availableRides.map((ride) => {
                    const alreadyRequested = ride.driverRequests?.some(
                      r => r.driver?._id === user?._id || r.driver === user?._id
                    )
                    return (
                      <div key={ride._id} style={styles.rideCard}>
                        <div style={styles.rideHeader}>
                          <div style={styles.riderInfo}>
                            <div style={styles.riderAvatar}>
                              {ride.rider?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p style={styles.riderName}>{ride.rider?.name}</p>
                              <p style={styles.riderPhone}>{ride.rider?.phone}</p>
                            </div>
                          </div>
                          <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
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
                        <div style={styles.rideFooter}>
                          <span style={styles.requestCount}>
                            {ride.driverRequests?.length || 0} requested
                          </span>
                          {alreadyRequested ? (
                            <span style={styles.requestedBadge}>✅ Requested</span>
                          ) : (
                            <button
                              style={styles.requestBtn}
                              onClick={() => handleRequestRide(ride._id)}
                            >
                              Request Ride
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {activeTab === 'active' && (
              <div style={styles.ridesList}>
                {activeRides.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🚗</p>
                    <p style={styles.emptyText}>No active rides</p>
                  </div>
                ) : (
                  activeRides.map((ride) => (
                    <div key={ride._id} style={styles.rideCard}>
                      <div style={styles.rideHeader}>
                        <span style={{
                          ...styles.statusBadge,
                          background: getStatusColor(ride.status)
                        }}>
                          {ride.status.toUpperCase()}
                        </span>
                        <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
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
                      <div style={styles.riderBox}>
                        <div style={styles.riderAvatar}>
                          {ride.rider?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={styles.riderName}>{ride.rider?.name}</p>
                          <p style={styles.riderPhone}>{ride.rider?.phone}</p>
                        </div>
                      </div>
                      <div style={styles.actionBtns}>
                        {ride.status === 'accepted' && (
                          <button
                            style={styles.startBtn}
                            onClick={() => handleUpdateStatus(ride._id, 'ongoing')}
                          >
                            🚀 Start Ride
                          </button>
                        )}
                        {ride.status === 'ongoing' && (
                          <button
                            style={styles.completeBtn}
                            onClick={() => handleUpdateStatus(ride._id, 'driver_completed')}
                          >
                            🏁 Mark as Completed
                          </button>
                        )}
                        {ride.status === 'driver_completed' && (
                          <div style={styles.waitingBox}>
                            <p style={styles.waitingText}>⏳ Waiting for rider to confirm...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'requested' && (
              <div style={styles.ridesList}>
                {requestedRides.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>📋</p>
                    <p style={styles.emptyText}>No pending requests</p>
                  </div>
                ) : (
                  requestedRides.map((ride) => (
                    <div key={ride._id} style={styles.rideCard}>
                      <div style={styles.rideHeader}>
                        <span style={{ ...styles.statusBadge, background: '#f6c90e', color: '#1a1a2e' }}>
                          WAITING FOR RIDER
                        </span>
                        <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
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
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div style={styles.ridesList}>
                {completedRides.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🏁</p>
                    <p style={styles.emptyText}>No completed rides yet</p>
                  </div>
                ) : (
                  completedRides.map((ride) => (
                    <div key={ride._id} style={styles.rideCard}>
                      <div style={styles.rideHeader}>
                        <span style={{ ...styles.statusBadge, background: '#2ecc71' }}>
                          COMPLETED
                        </span>
                        <div style={{ textAlign: 'right' }}>
                          <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
                          <p style={{ fontSize: '11px', color: '#2ecc71', margin: 0, fontWeight: '600' }}>
                            Earned: ₦{(ride.fare * 0.9).toLocaleString()}
                          </p>
                        </div>
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
                    </div>
                  ))
                )}
              </div>
            )}
          </>
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
  availabilityToggle: { display: 'flex', alignItems: 'center', gap: '8px' },
  toggleSwitch: {
    width: '44px', height: '24px', borderRadius: '12px',
    cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
    display: 'flex', alignItems: 'center', padding: '2px'
  },
  toggleKnob: {
    width: '20px', height: '20px', background: '#fff',
    borderRadius: '50%', transition: 'transform 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
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
  mobileMenuName: { color: '#f6c90e', fontWeight: '700', margin: '0 0 4px', fontSize: '15px' },
  mobileAvailability: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 16px', background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px', marginBottom: '4px'
  },
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
  statsRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
  statCard: {
    background: '#fff', padding: '14px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center', flex: 1
  },
  statNumber: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 2px' },
  statLabel: { fontSize: '10px', color: '#999', margin: 0, fontWeight: '600' },
  earningsCard: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '14px', borderRadius: '12px', textAlign: 'center', flex: 1
  },
  earningsNumber: { fontSize: '16px', fontWeight: '800', color: '#f6c90e', margin: '0 0 2px' },
  earningsLabel: { fontSize: '10px', color: '#ccc', margin: 0, fontWeight: '600' },
  offlineBanner: {
    background: 'rgba(231,76,60,0.1)', color: '#e74c3c',
    border: '1px solid rgba(231,76,60,0.2)', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: '600'
  },
  success: {
    background: '#e0ffe0', color: '#060', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px 16px',
    borderRadius: '10px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  tabs: { display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
    fontWeight: '600', cursor: 'pointer', flex: 1, textAlign: 'center'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '8px 12px', borderRadius: '8px', fontSize: '12px',
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
  goOnlineBtn: {
    background: '#2ecc71', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  refreshBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '10px 24px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  ridesList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  rideCard: {
    background: '#fff', padding: '18px', borderRadius: '14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  rideHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '14px'
  },
  riderInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  riderAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  riderName: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  riderPhone: { fontSize: '11px', color: '#999', margin: 0 },
  fare: { fontSize: '18px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  locations: { marginBottom: '14px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  locationText: { fontSize: '13px', color: '#333', margin: '3px 0' },
  locationLine: { width: '2px', height: '12px', background: '#ddd', marginLeft: '6px' },
  rideFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  requestCount: { fontSize: '11px', color: '#999' },
  requestedBadge: {
    background: '#e0ffe0', color: '#060', padding: '5px 12px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700'
  },
  requestBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', padding: '9px 18px',
    borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
  },
  statusBadge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '10px', fontWeight: '700'
  },
  riderBox: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '12px'
  },
  actionBtns: { display: 'flex', gap: '8px' },
  startBtn: {
    flex: 1, padding: '10px',
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  completeBtn: {
    flex: 1, padding: '10px',
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  },
  waitingBox: {
    flex: 1, padding: '10px', background: '#fff8e0',
    borderRadius: '8px', border: '1px solid #f6c90e'
  },
  waitingText: { fontSize: '13px', color: '#666', margin: 0, textAlign: 'center' }
}

export default DriverDashboard