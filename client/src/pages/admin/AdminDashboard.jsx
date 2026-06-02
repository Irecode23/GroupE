import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentRides, setRecentRides] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'system' })
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usersRes, ridesRes, paymentsRes, complaintsRes, ratingsRes] = await Promise.all([
        API.get('/users/all'),
        API.get('/rides/all'),
        API.get('/payments/stats'),
        API.get('/complaints/all'),
        API.get('/ratings/all')
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
        pendingRides: rides.filter(r => r.status === 'pending').length,
        totalRevenue: paymentsRes.data.totalRevenue || 0,
        totalCommission: paymentsRes.data.totalCommission || 0,
        totalTransactions: paymentsRes.data.totalTransactions || 0,
        openComplaints: complaintsRes.data.filter(c => c.status === 'open').length,
        resolvedComplaints: complaintsRes.data.filter(c => c.status === 'resolved').length,
        totalRatings: ratingsRes.data.length,
        avgRating: ratingsRes.data.length > 0
          ? (ratingsRes.data.reduce((sum, r) => sum + r.rating, 0) / ratingsRes.data.length).toFixed(1)
          : 0,
        rides,
        users
      })

      setRecentRides(rides.slice(0, 5))
      setPendingUsers(users.filter(u => !u.isVerified).slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    }
    setLoading(false)
  }

  const handleBroadcast = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      const { data } = await API.post('/notifications/broadcast', broadcastForm)
      setBroadcastMsg(data.message)
      setBroadcastForm({ title: '', message: '', type: 'system' })
    } catch (err) {
      setBroadcastMsg('Failed to send notification')
    }
    setSending(false)
  }

  // Chart data
  const getRideStatusData = () => {
    if (!stats) return []
    return [
      { name: 'Completed', value: stats.completedRides, color: '#2ecc71' },
      { name: 'Pending', value: stats.pendingRides, color: '#f6c90e' },
      { name: 'Active', value: stats.activeRides, color: '#3498db' },
      { name: 'Cancelled', value: stats.cancelledRides, color: '#e74c3c' },
    ].filter(d => d.value > 0)
  }

  const getUserData = () => {
    if (!stats) return []
    return [
      { name: 'Riders', value: stats.totalRiders, color: '#3498db' },
      { name: 'Drivers', value: stats.totalDrivers, color: '#1a1a2e' },
      { name: 'Verified', value: stats.verifiedUsers, color: '#2ecc71' },
      { name: 'Pending', value: stats.pendingVerification, color: '#f6c90e' },
    ]
  }

  const getMonthlyRides = () => {
    if (!stats?.rides) return []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthCounts = new Array(12).fill(0)
    stats.rides.forEach(ride => {
      const month = new Date(ride.createdAt).getMonth()
      monthCounts[month]++
    })
    return months.map((month, i) => ({
      month,
      rides: monthCounts[i]
    })).filter(d => d.rides > 0)
  }

  const getRevenueData = () => {
    if (!stats) return []
    return [
      { name: 'Revenue', amount: stats.totalRevenue },
      { name: 'Commission', amount: stats.totalCommission },
      { name: 'Payouts', amount: stats.totalRevenue - stats.totalCommission },
    ]
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loadingBox}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Dashboard Overview</h2>
        <p style={styles.subtitle}>Welcome back! Here's what's happening on RideShare.</p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Users', value: stats.totalUsers, sub: `${stats.totalRiders} riders · ${stats.totalDrivers} drivers`, color: '#3498db' },
          { label: 'Pending Verification', value: stats.pendingVerification, sub: `${stats.verifiedUsers} verified`, color: '#f6c90e' },
          { label: 'Total Rides', value: stats.totalRides, sub: `${stats.completedRides} completed · ${stats.activeRides} active`, color: '#2ecc71' },
          { label: 'Total Revenue', value: `₦${stats.totalRevenue?.toLocaleString()}`, sub: `₦${stats.totalCommission?.toLocaleString()} commission`, color: '#9b59b6' },
          { label: 'Open Complaints', value: stats.openComplaints, sub: `${stats.resolvedComplaints} resolved`, color: '#e74c3c' },
          { label: 'Avg Rating', value: `${stats.avgRating}⭐`, sub: `${stats.totalRatings} total ratings`, color: '#f39c12' },
        ].map((stat) => (
          <div key={stat.label} style={{ ...styles.statCard, borderTop: `4px solid ${stat.color}` }}>
            <p style={{ ...styles.statNumber, color: stat.color }}>{stat.value}</p>
            <p style={styles.statLabel}>{stat.label}</p>
            <p style={styles.statSub}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div style={styles.chartsRow}>
        {/* Ride Status Pie Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🚗 Rides by Status</h3>
          {getRideStatusData().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getRideStatusData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {getRideStatusData().map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.noData}>No ride data yet</div>
          )}
          <div style={styles.legend}>
            {getRideStatusData().map((item) => (
              <div key={item.name} style={styles.legendItem}>
                <div style={{ ...styles.legendDot, background: item.color }} />
                <span style={styles.legendText}>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Stats Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>👥 User Statistics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getUserData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {getUserData().map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={styles.chartsRow}>
        {/* Monthly Rides Line Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>📈 Monthly Rides</h3>
          {getMonthlyRides().length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={getMonthlyRides()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rides"
                  stroke="#f6c90e"
                  strokeWidth={3}
                  dot={{ fill: '#f6c90e', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.noData}>No monthly data yet</div>
          )}
        </div>

        {/* Revenue Bar Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>💰 Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getRevenueData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `₦${value?.toLocaleString()}`} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                <Cell fill="#9b59b6" />
                <Cell fill="#f6c90e" />
                <Cell fill="#2ecc71" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={styles.bottomRow}>
        {/* Pending Users */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>⏳ Pending Verification</h3>
            <a href="/admin/users" style={styles.viewAll}>View All</a>
          </div>
          {pendingUsers.length === 0 ? (
            <p style={styles.noData}>No pending users 🎉</p>
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
                  ...styles.roleBadge,
                  background: u.role === 'driver' ? '#1a1a2e' : '#3498db'
                }}>
                  {u.role}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent Rides */}
        <div style={styles.listCard}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>🚗 Recent Rides</h3>
            <a href="/admin/rides" style={styles.viewAll}>View All</a>
          </div>
          {recentRides.length === 0 ? (
            <p style={styles.noData}>No rides yet</p>
          ) : (
            recentRides.map(ride => (
              <div key={ride._id} style={styles.listItem}>
                <div style={styles.rideIcon}>🚕</div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{ride.rider?.name || 'Unknown'}</p>
                  <p style={styles.userEmail}>{ride.pickupLocation?.address}</p>
                </div>
                <span style={{
                  ...styles.roleBadge,
                  background: ride.status === 'completed' ? '#2ecc71' :
                    ride.status === 'cancelled' ? '#e74c3c' : '#f6c90e',
                  color: ride.status === 'pending' ? '#1a1a2e' : '#fff'
                }}>
                  {ride.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Broadcast Notification */}
        <div style={styles.listCard}>
          <h3 style={styles.listTitle}>📢 Send Notification to All Users</h3>
          <p style={styles.broadcastSubtitle}>Broadcast a message to all riders and drivers</p>

          {broadcastMsg && (
            <div style={styles.broadcastSuccess}>✅ {broadcastMsg}</div>
          )}

          <form onSubmit={handleBroadcast}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.input}
                value={broadcastForm.type}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
              >
                <option value="system">📢 System</option>
                <option value="ride">🚗 Ride</option>
                <option value="payment">💰 Payment</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Notification title"
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                style={styles.textarea}
                placeholder="Write your message..."
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                rows={3}
                required
              />
            </div>
            <button style={styles.broadcastBtn} type="submit" disabled={sending}>
              {sending ? '⏳ Sending...' : '📤 Send to All Users'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

const styles = {
  header: { marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  loadingBox: { textAlign: 'center', padding: '60px' },
  spinner: {
    width: '48px', height: '48px', border: '4px solid #f0f0f0',
    borderTop: '4px solid #f6c90e', borderRadius: '50%',
    margin: '0 auto 16px', animation: 'spin 1s linear infinite'
  },
  loadingText: { color: '#666', fontSize: '16px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '24px'
  },
  statCard: {
    background: '#fff', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  statNumber: { fontSize: '28px', fontWeight: '800', margin: '0 0 4px' },
  statLabel: { fontSize: '13px', fontWeight: '700', color: '#333', margin: '0 0 4px' },
  statSub: { fontSize: '11px', color: '#999', margin: 0 },
  chartsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px', marginBottom: '24px'
  },
  chartCard: {
    background: '#fff', padding: '24px', borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  chartTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' },
  noData: { textAlign: 'center', color: '#999', padding: '40px 0', fontSize: '14px' },
  legend: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%' },
  legendText: { fontSize: '12px', color: '#666' },
  bottomRow: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  listCard: {
    background: '#fff', padding: '24px', borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  listHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  listTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  viewAll: { color: '#f6c90e', fontSize: '13px', textDecoration: 'none', fontWeight: '600' },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #f5f5f5'
  },
  userAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0
  },
  rideIcon: { fontSize: '24px', width: '36px', textAlign: 'center' },
  userInfo: { flex: 1 },
  userName: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  userEmail: { fontSize: '11px', color: '#999', margin: 0 },
  roleBadge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  broadcastSubtitle: { fontSize: '13px', color: '#666', margin: '0 0 16px' },
  broadcastSuccess: {
    background: '#e0ffe0', color: '#060', padding: '10px',
    borderRadius: '8px', marginBottom: '12px', fontSize: '13px'
  },
  inputGroup: { marginBottom: '12px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '700', color: '#333' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #eee', fontSize: '13px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa'
  },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #eee', fontSize: '13px',
    boxSizing: 'border-box', outline: 'none', background: '#fafafa',
    resize: 'vertical', fontFamily: 'sans-serif'
  },
  broadcastBtn: {
    width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    color: '#f6c90e', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '700', cursor: 'pointer'
  }
}

export default AdminDashboard