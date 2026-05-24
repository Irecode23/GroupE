import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentRides, setRecentRides] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ridesRes, paymentsRes, complaintsRes] = await Promise.all([
        API.get('/users/all'),
        API.get('/rides/all'),
        API.get('/payments/stats'),
        API.get('/complaints/all')
      ])

      const users = usersRes.data
      const rides = ridesRes.data

      setStats({
        totalUsers: users.length,
        totalRiders: users.filter(u => u.role === 'rider').length,
        totalDrivers: users.filter(u => u.role === 'driver').length,
        pendingVerification: users.filter(u => !u.isVerified).length,
        verifiedUsers: users.filter(u => u.isVerified).length,
        totalRides: rides.length,
        completedRides: rides.filter(r => r.status === 'completed').length,
        activeRides: rides.filter(r => r.status === 'ongoing' || r.status === 'accepted').length,
        cancelledRides: rides.filter(r => r.status === 'cancelled').length,
        totalRevenue: paymentsRes.data.totalRevenue,
        totalCommission: paymentsRes.data.totalCommission,
        totalTransactions: paymentsRes.data.totalTransactions,
        openComplaints: complaintsRes.data.filter(c => c.status === 'open').length,
        resolvedComplaints: complaintsRes.data.filter(c => c.status === 'resolved').length,
      })

      setRecentRides(rides.slice(0, 5))
      setPendingUsers(users.filter(u => !u.isVerified).slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6c90e', accepted: '#3498db',
      ongoing: '#9b59b6', completed: '#2ecc71', cancelled: '#e74c3c'
    }
    return colors[status] || '#999'
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading dashboard...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard Overview</h2>
        <p style={styles.subtitle}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
          <p style={styles.statNumber}>{stats.totalUsers}</p>
          <p style={styles.statLabel}>Total Users</p>
          <p style={styles.statSub}>{stats.totalRiders} riders · {stats.totalDrivers} drivers</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #f6c90e' }}>
          <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{stats.pendingVerification}</p>
          <p style={styles.statLabel}>Pending Verification</p>
          <p style={styles.statSub}>{stats.verifiedUsers} verified</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
          <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{stats.totalRides}</p>
          <p style={styles.statLabel}>Total Rides</p>
          <p style={styles.statSub}>{stats.completedRides} completed · {stats.activeRides} active</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #9b59b6' }}>
          <p style={{ ...styles.statNumber, color: '#9b59b6' }}>₦{stats.totalRevenue?.toLocaleString()}</p>
          <p style={styles.statLabel}>Total Revenue</p>
          <p style={styles.statSub}>₦{stats.totalCommission?.toLocaleString()} commission</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e74c3c' }}>
          <p style={{ ...styles.statNumber, color: '#e74c3c' }}>{stats.openComplaints}</p>
          <p style={styles.statLabel}>Open Complaints</p>
          <p style={styles.statSub}>{stats.resolvedComplaints} resolved</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #1abc9c' }}>
          <p style={{ ...styles.statNumber, color: '#1abc9c' }}>{stats.totalTransactions}</p>
          <p style={styles.statLabel}>Transactions</p>
          <p style={styles.statSub}>{stats.cancelledRides} cancelled rides</p>
        </div>
      </div>

      <div style={styles.twoCol}>
        {/* Pending Users */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>⏳ Pending Verification</h3>
            <a href="/admin/users" style={styles.viewAll}>View All</a>
          </div>
          {pendingUsers.length === 0 ? (
            <p style={styles.empty}>No pending users</p>
          ) : (
            pendingUsers.map(u => (
              <div key={u._id} style={styles.listItem}>
                <div style={styles.userAvatar}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{u.name}</p>
                  <p style={styles.userEmail}>{u.email}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  background: u.role === 'driver' ? '#1a1a2e' : '#3498db'
                }}>
                  {u.role}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Rides */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>🚗 Recent Rides</h3>
            <a href="/admin/rides" style={styles.viewAll}>View All</a>
          </div>
          {recentRides.length === 0 ? (
            <p style={styles.empty}>No rides yet</p>
          ) : (
            recentRides.map(ride => (
              <div key={ride._id} style={styles.listItem}>
                <div style={styles.rideIcon}>🚕</div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{ride.rider?.name || 'Unknown'}</p>
                  <p style={styles.userEmail}>{ride.pickupLocation?.address}</p>
                </div>
                <span style={{
                  ...styles.badge,
                  background: getStatusColor(ride.status)
                }}>
                  {ride.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

const styles = {
  header: { marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  loading: { padding: '40px', color: '#666', fontSize: '16px' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  statNumber: { fontSize: '32px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '14px', fontWeight: '600', color: '#333', margin: '0 0 4px' },
  statSub: { fontSize: '12px', color: '#999', margin: 0 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  section: {
    background: '#fff', borderRadius: '12px',
    padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  viewAll: { color: '#f6c90e', fontSize: '13px', textDecoration: 'none', fontWeight: '600' },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #f5f5f5'
  },
  userAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '16px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  rideIcon: { fontSize: '24px', width: '36px', textAlign: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  userEmail: { fontSize: '12px', color: '#999', margin: 0 },
  badge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  empty: { color: '#999', fontSize: '14px', textAlign: 'center', padding: '20px 0' }
}

export default AdminDashboard