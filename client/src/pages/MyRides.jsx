import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function MyRides() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleUpdateStatus = async (rideId, status) => {
    try {
      await API.put(`/rides/status/${rideId}`, { status })
      setMessage(`Ride status updated!`)
      fetchRides()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ride')
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
      pending: 'Waiting for drivers',
      accepted: 'Driver on the way',
      ongoing: 'Ride in progress',
      driver_completed: 'Awaiting your confirmation',
      completed: 'Completed',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  const filteredRides = rides.filter(ride => {
    const matchesSearch =
      ride.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.rider?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === 'active') return ['pending', 'accepted', 'ongoing', 'driver_completed'].includes(ride.status) && matchesSearch
    if (activeTab === 'completed') return ride.status === 'completed' && matchesSearch
    if (activeTab === 'cancelled') return ride.status === 'cancelled' && matchesSearch
    return matchesSearch
  })

  const totalFare = rides
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.fare, 0)

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <h1 style={styles.logo}>🚗 RideShare</h1>
        <div style={styles.navLinks}>
          <span style={styles.greeting}>Hi, {user?.name?.split(' ')[0]}!</span>
          <Link
            to={user?.role === 'driver' ? '/driver/dashboard' : '/rider/dashboard'}
            style={styles.backBtn}
          >
            ← Dashboard
          </Link>
        </div>
      </nav>

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <h2 style={styles.title}>My Rides</h2>
          <p style={styles.subtitle}>Track all your ride history</p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{rides.length}</p>
            <p style={styles.statLabel}>Total Rides</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>
              {rides.filter(r => r.status === 'completed').length}
            </p>
            <p style={styles.statLabel}>Completed</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>
              {rides.filter(r => ['pending', 'accepted', 'ongoing', 'driver_completed'].includes(r.status)).length}
            </p>
            <p style={styles.statLabel}>Active</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#e74c3c' }}>
              {rides.filter(r => r.status === 'cancelled').length}
            </p>
            <p style={styles.statLabel}>Cancelled</p>
          </div>
          <div style={styles.earningsCard}>
            <p style={styles.earningsNumber}>
              ₦{user?.role === 'driver'
                ? (totalFare * 0.9).toLocaleString()
                : totalFare.toLocaleString()}
            </p>
            <p style={styles.earningsLabel}>
              {user?.role === 'driver' ? 'Total Earnings' : 'Total Spent'}
            </p>
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

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="🔍 Search by location, driver or rider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {[
            { key: 'all', label: `All (${rides.length})` },
            { key: 'active', label: `Active (${rides.filter(r => ['pending', 'accepted', 'ongoing', 'driver_completed'].includes(r.status)).length})` },
            { key: 'completed', label: `Completed (${rides.filter(r => r.status === 'completed').length})` },
            { key: 'cancelled', label: `Cancelled (${rides.filter(r => r.status === 'cancelled').length})` },
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
            <p style={styles.loadingText}>Loading your rides...</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>🚗</p>
            <p style={styles.emptyText}>No rides found</p>
            {user?.role === 'rider' && (
              <button style={styles.bookBtn} onClick={() => navigate('/book-ride')}>
                Book a Ride
              </button>
            )}
          </div>
        ) : (
          <div style={styles.ridesList}>
            {filteredRides.map((ride) => (
              <div key={ride._id} style={styles.rideCard}>

                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderLeft}>
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(ride.status)
                    }}>
                      {ride.status === 'driver_completed' ? '⏳ Confirm?' : ride.status.toUpperCase()}
                    </span>
                    <span style={styles.statusLabel}>{getStatusLabel(ride.status)}</span>
                  </div>
                  <div style={styles.cardHeaderRight}>
                    <span style={styles.fare}>₦{ride.fare?.toLocaleString()}</span>
                    <span style={styles.rideDate}>
                      {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Locations */}
                <div style={styles.locations}>
                  <div style={styles.locationRow}>
                    <div style={styles.locationDotGreen} />
                    <div>
                      <p style={styles.locationLabel}>Pickup</p>
                      <p style={styles.locationText}>{ride.pickupLocation?.address}</p>
                    </div>
                  </div>
                  <div style={styles.locationConnector} />
                  <div style={styles.locationRow}>
                    <div style={styles.locationDotRed} />
                    <div>
                      <p style={styles.locationLabel}>Dropoff</p>
                      <p style={styles.locationText}>{ride.dropoffLocation?.address}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Requests — Rider picks a driver */}
                {user?.role === 'rider' &&
                  ride.status === 'pending' &&
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
                            <p style={styles.driverRating}>
                              ⭐ {req.driver?.rating || 'New driver'}
                            </p>
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

                {/* Assigned Driver Info */}
                {user?.role === 'rider' && ride.driver && ride.status !== 'pending' && (
                  <div style={styles.personBox}>
                    <div style={styles.personAvatar}>
                      {ride.driver?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.personInfo}>
                      <p style={styles.personLabel}>Driver</p>
                      <p style={styles.personName}>{ride.driver?.name}</p>
                      <p style={styles.personPhone}>{ride.driver?.phone}</p>
                    </div>
                    {ride.driver?.rating > 0 && (
                      <div style={styles.personRating}>
                        <span style={styles.ratingStars}>
                          {'⭐'.repeat(Math.round(ride.driver?.rating || 0))}
                        </span>
                        <span style={styles.ratingNum}>{ride.driver?.rating}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Rider Info for Driver */}
                {user?.role === 'driver' && ride.rider && (
                  <div style={styles.personBox}>
                    <div style={{ ...styles.personAvatar, background: '#f6c90e', color: '#1a1a2e' }}>
                      {ride.rider?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.personInfo}>
                      <p style={styles.personLabel}>Rider</p>
                      <p style={styles.personName}>{ride.rider?.name}</p>
                      <p style={styles.personPhone}>{ride.rider?.phone}</p>
                    </div>
                  </div>
                )}

                {/* Payment Status */}
                <div style={styles.paymentRow}>
                  <span style={styles.paymentLabel}>Payment</span>
                  <span style={{
                    ...styles.paymentBadge,
                    background: ride.paymentStatus === 'paid' ? '#e0ffe0' : '#fff8e0',
                    color: ride.paymentStatus === 'paid' ? '#060' : '#b8860b'
                  }}>
                    {ride.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Unpaid'}
                  </span>
                </div>

                {/* Driver Actions */}
                {user?.role === 'driver' && ride.status === 'accepted' && (
                  <button
                    style={styles.actionBtn}
                    onClick={() => handleUpdateStatus(ride._id, 'ongoing')}
                  >
                    🚀 Start Ride
                  </button>
                )}
                {user?.role === 'driver' && ride.status === 'ongoing' && (
                  <button
                    style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}
                    onClick={() => handleUpdateStatus(ride._id, 'driver_completed')}
                  >
                    🏁 Mark as Completed
                  </button>
                )}

                {/* Rider Confirm */}
                {user?.role === 'rider' && ride.status === 'driver_completed' && (
                  <div style={styles.confirmBox}>
                    <p style={styles.confirmText}>
                      Your driver has completed the ride. Confirm to proceed with payment.
                    </p>
                    <button
                      style={styles.confirmBtn}
                      onClick={() => handleConfirmRide(ride._id)}
                    >
                      ✅ Confirm & Pay ₦{ride.fare?.toLocaleString()}
                    </button>
                  </div>
                )}

                {/* Rate Driver */}
                {user?.role === 'rider' && ride.status === 'completed' && !ride.isRated && (
                  <button
                    style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #9b59b6, #8e44ad)' }}
                    onClick={() => navigate(`/rate-driver/${ride._id}/${ride.driver?._id}`)}
                  >
                    ⭐ Rate Your Driver
                  </button>
                )}

                {ride.status === 'completed' && ride.isRated && (
                  <div style={styles.ratedBadge}>✅ Rated</div>
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
  navLinks: { display: 'flex', alignItems: 'center', gap: '16px' },
  greeting: { color: '#ccc', fontSize: '14px' },
  backBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', fontWeight: '600'
  },
  content: { padding: '32px 40px', maxWidth: '900px', margin: '0 auto' },
  pageHeader: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  subtitle: { color: '#666', margin: 0 },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: {
    background: '#fff', padding: '20px 24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)', textAlign: 'center', minWidth: '100px', flex: 1
  },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '12px', color: '#999', margin: 0, fontWeight: '600' },
  earningsCard: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '20px 24px', borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(26,26,46,0.3)', textAlign: 'center', minWidth: '140px'
  },
  earningsNumber: { fontSize: '22px', fontWeight: '800', color: '#f6c90e', margin: '0 0 4px' },
  earningsLabel: { fontSize: '12px', color: '#ccc', margin: 0, fontWeight: '600' },
  success: {
    background: 'linear-gradient(135deg, #e0ffe0, #d0f0d0)',
    color: '#060', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: 'linear-gradient(135deg, #ffe0e0, #ffd0d0)',
    color: '#d00', padding: '12px 16px', borderRadius: '10px',
    marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  searchBox: { marginBottom: '16px' },
  searchInput: {
    width: '100%', maxWidth: '500px', padding: '12px 16px', borderRadius: '10px',
    border: '2px solid #eee', fontSize: '14px', boxSizing: 'border-box',
    outline: 'none', background: '#fff'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 18px', borderRadius: '10px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 18px', borderRadius: '10px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  loadingBox: { textAlign: 'center', padding: '60px' },
  loadingText: { color: '#666', fontSize: '16px' },
  empty: { textAlign: 'center', padding: '60px' },
  emptyIcon: { fontSize: '64px', margin: '0 0 16px' },
  emptyText: { color: '#999', fontSize: '16px', margin: '0 0 24px' },
  bookBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', padding: '12px 32px',
    borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  ridesList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  rideCard: {
    background: '#fff', padding: '24px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.04)'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '8px'
  },
  cardHeaderLeft: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' },
  cardHeaderRight: { textAlign: 'right' },
  statusBadge: {
    color: '#fff', padding: '4px 12px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  statusLabel: { fontSize: '13px', color: '#666', fontStyle: 'italic' },
  fare: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', display: 'block' },
  rideDate: { fontSize: '12px', color: '#aaa' },
  locations: { marginBottom: '16px' },
  locationRow: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '4px 0' },
  locationDotGreen: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: '#2ecc71', flexShrink: 0, marginTop: '4px',
    boxShadow: '0 0 0 3px rgba(46,204,113,0.2)'
  },
  locationDotRed: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: '#e74c3c', flexShrink: 0, marginTop: '4px',
    boxShadow: '0 0 0 3px rgba(231,76,60,0.2)'
  },
  locationConnector: {
    width: '2px', height: '20px', background: '#eee',
    marginLeft: '5px', marginBottom: '2px'
  },
  locationLabel: { fontSize: '11px', color: '#aaa', margin: '0 0 2px', fontWeight: '600' },
  locationText: { fontSize: '14px', color: '#333', margin: 0, fontWeight: '500' },
  requestsBox: {
    background: '#fffbf0', border: '2px solid #f6c90e',
    borderRadius: '12px', padding: '16px', marginBottom: '16px'
  },
  requestsTitle: {
    fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 12px'
  },
  driverRequestCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px', background: '#fff', borderRadius: '10px',
    marginBottom: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  driverAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  driverPhone: { fontSize: '12px', color: '#999', margin: '0 0 2px' },
  driverRating: { fontSize: '12px', color: '#666', margin: 0 },
  acceptDriverBtn: {
    background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
    color: '#fff', border: 'none', padding: '10px 20px',
    borderRadius: '8px', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 2px 8px rgba(46,204,113,0.3)'
  },
  personBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 16px', background: '#f9f9f9', borderRadius: '12px',
    marginBottom: '12px', border: '1px solid #eee'
  },
  personAvatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  personInfo: { flex: 1 },
  personLabel: { fontSize: '11px', color: '#aaa', margin: '0 0 2px', fontWeight: '600' },
  personName: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 2px' },
  personPhone: { fontSize: '12px', color: '#999', margin: 0 },
  personRating: { textAlign: 'right' },
  ratingStars: { fontSize: '12px' },
  ratingNum: { fontSize: '13px', fontWeight: '700', color: '#1a1a2e', display: 'block' },
  paymentRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderTop: '1px solid #f5f5f5', marginBottom: '12px'
  },
  paymentLabel: { fontSize: '13px', color: '#666', fontWeight: '600' },
  paymentBadge: {
    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700'
  },
  confirmBox: {
    background: 'linear-gradient(135deg, #fff8e0, #fff3cc)',
    border: '2px solid #f6c90e', borderRadius: '12px',
    padding: '16px', marginBottom: '12px'
  },
  confirmText: { fontSize: '13px', color: '#666', margin: '0 0 12px' },
  confirmBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '800', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(246,201,14,0.4)'
  },
  actionBtn: {
    width: '100%', padding: '13px',
    background: 'linear-gradient(135deg, #3498db, #2980b9)',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52,152,219,0.3)'
  },
  ratedBadge: {
    textAlign: 'center', padding: '10px', background: '#e0ffe0',
    borderRadius: '10px', fontSize: '13px', color: '#060', fontWeight: '700'
  }
}

export default MyRides