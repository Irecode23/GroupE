import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function DriverDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [availableRides, setAvailableRides] = useState([])
  const [myRides, setMyRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('available')

  useEffect(() => {
    fetchData()
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
    r.driverRequests?.some(req => req.driver?._id === user?._id ||
      req.driver === user?._id)
  )

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
            <p style={styles.statNumber}>{myRides.length}</p>
            <p style={styles.statLabel}>Total Rides</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{completedRides.length}</p>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#3498db' }}>{activeRides.length}</p>
            <p style={styles.statLabel}>Active</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{availableRides.length}</p>
            <p style={styles.statLabel}>Available</p>
          </div>
          <div style={styles.earningsCard}>
            <p style={styles.earningsNumber}>
              ₦{completedRides.reduce((sum, r) => sum + (r.fare * 0.9), 0).toLocaleString()}
            </p>
            <p style={styles.earningsLabel}>Total Earnings (90%)</p>
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
          {[
            { key: 'available', label: `Available (${availableRides.length})` },
            { key: 'active', label: `Active (${activeRides.length})` },
            { key: 'requested', label: `Requested (${requestedRides.length})` },
            { key: 'completed', label: `Completed (${completedRides.length})` },
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
          <p style={styles.loading}>Loading...</p>
        ) : (
          <>
            {/* Available Rides */}
            {activeTab === 'available' && (
              <div style={styles.ridesList}>
                {availableRides.length === 0 ? (
                  <div style={styles.empty}>
                    <p style={styles.emptyIcon}>🚕</p>
                    <p style={styles.emptyText}>No available rides right now</p>
                    <button style={styles.refreshBtn} onClick={fetchData}>
                      🔄 Refresh
                    </button>
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
                          <div style={styles.locationLine}></div>
                          <div style={styles.locationRow}>
                            <span>🔴</span>
                            <p style={styles.locationText}>{ride.dropoffLocation?.address}</p>
                          </div>
                        </div>

                        <div style={styles.rideFooter}>
                          <span style={styles.requestCount}>
                            {ride.driverRequests?.length || 0} driver(s) requested
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

            {/* Active Rides */}
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
                        <div style={styles.locationLine}></div>
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
                            <p style={styles.waitingText}>
                              ⏳ Waiting for rider to confirm...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Requested Rides */}
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
                        <div style={styles.locationLine}></div>
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

            {/* Completed Rides */}
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
                        <div style={styles.fareBox}>
                          <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
                          <p style={styles.earningText}>
                            You earned: ₦{(ride.fare * 0.9).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div style={styles.locations}>
                        <div style={styles.locationRow}>
                          <span>🟢</span>
                          <p style={styles.locationText}>{ride.pickupLocation?.address}</p>
                        </div>
                        <div style={styles.locationLine}></div>
                        <div style={styles.locationRow}>
                          <span>🔴</span>
                          <p style={styles.locationText}>{ride.dropoffLocation?.address}</p>
                        </div>
                      </div>
                      <p style={styles.rideDate}>
                        {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
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
    background: '#fff', padding: '20px 24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', textAlign: 'center', minWidth: '100px'
  },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '12px', color: '#999', margin: 0, fontWeight: '600' },
  earningsCard: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '20px 24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(26,26,46,0.3)', textAlign: 'center', minWidth: '160px'
  },
  earningsNumber: { fontSize: '24px', fontWeight: '800', color: '#f6c90e', margin: '0 0 4px' },
  earningsLabel: { fontSize: '12px', color: '#ccc', margin: 0, fontWeight: '600' },
  success: {
    background: 'linear-gradient(135deg, #e0ffe0, #d0f0d0)',
    color: '#060', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,200,0,0.15)'
  },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  loading: { color: '#666', textAlign: 'center', padding: '40px' },
  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: '64px', margin: '0 0 16px' },
  emptyText: { color: '#999', fontSize: '16px', margin: '0 0 24px' },
  refreshBtn: {
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
  riderInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  riderAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  riderName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  riderPhone: { fontSize: '12px', color: '#999', margin: 0 },
  fare: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  locations: { marginBottom: '16px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  locationText: { fontSize: '14px', color: '#333', margin: '4px 0' },
  locationLine: {
    width: '2px', height: '16px', background: '#ddd',
    marginLeft: '6px', marginBottom: '4px'
  },
  rideFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginTop: '8px'
  },
  requestCount: { fontSize: '12px', color: '#999' },
  requestedBadge: {
    background: '#e0ffe0', color: '#060', padding: '6px 14px',
    borderRadius: '20px', fontSize: '12px', fontWeight: '700'
  },
  requestBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', padding: '10px 24px',
    borderRadius: '8px', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 4px 12px rgba(246,201,14,0.4)'
  },
  statusBadge: {
    color: '#fff', padding: '4px 12px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  riderBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px', background: '#f9f9f9', borderRadius: '10px',
    marginBottom: '16px'
  },
  actionBtns: { display: 'flex', gap: '8px' },
  startBtn: {
    flex: 1, padding: '12px', background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52,152,219,0.3)'
  },
  completeBtn: {
    flex: 1, padding: '12px', background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(46,204,113,0.3)'
  },
  waitingBox: {
    flex: 1, padding: '12px', background: '#fff8e0',
    borderRadius: '10px', border: '1px solid #f6c90e'
  },
  waitingText: { fontSize: '14px', color: '#666', margin: 0, textAlign: 'center' },
  fareBox: { textAlign: 'right' },
  earningText: { fontSize: '12px', color: '#2ecc71', fontWeight: '600', margin: '2px 0 0' },
  rideDate: { fontSize: '12px', color: '#999', marginTop: '8px' }
}

export default DriverDashboard