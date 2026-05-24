import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminRides() {
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRides()
  }, [])

  const fetchRides = async () => {
    try {
      const { data } = await API.get('/rides/all')
      setRides(data)
    } catch (err) {
      setError('Failed to load rides')
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6c90e',
      accepted: '#3498db',
      ongoing: '#9b59b6',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    }
    return colors[status] || '#999'
  }

  const filteredRides = rides.filter(ride => {
    const matchesSearch =
      ride.rider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.pickupLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoffLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === 'all') return matchesSearch
    return ride.status === activeTab && matchesSearch
  })

  const countByStatus = (status) => rides.filter(r => r.status === status).length

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Ride Monitoring</h2>
        <p style={styles.subtitle}>Monitor all rides and activities on the platform</p>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #f6c90e' }}>
          <p style={styles.statNumber}>{rides.length}</p>
          <p style={styles.statLabel}>Total Rides</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
          <p style={{ ...styles.statNumber, color: '#3498db' }}>{countByStatus('pending')}</p>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #9b59b6' }}>
          <p style={{ ...styles.statNumber, color: '#9b59b6' }}>
            {countByStatus('accepted') + countByStatus('ongoing')}
          </p>
          <p style={styles.statLabel}>Active</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
          <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{countByStatus('completed')}</p>
          <p style={styles.statLabel}>Completed</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e74c3c' }}>
          <p style={{ ...styles.statNumber, color: '#e74c3c' }}>{countByStatus('cancelled')}</p>
          <p style={styles.statLabel}>Cancelled</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #1abc9c' }}>
          <p style={{ ...styles.statNumber, color: '#1abc9c' }}>
            ₦{rides.reduce((sum, r) => sum + r.fare, 0).toLocaleString()}
          </p>
          <p style={styles.statLabel}>Total Fare</p>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search by rider, driver or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'all', label: `All (${rides.length})` },
          { key: 'pending', label: `⏳ Pending (${countByStatus('pending')})` },
          { key: 'accepted', label: `✅ Accepted (${countByStatus('accepted')})` },
          { key: 'ongoing', label: `🚗 Ongoing (${countByStatus('ongoing')})` },
          { key: 'completed', label: `🏁 Completed (${countByStatus('completed')})` },
          { key: 'cancelled', label: `❌ Cancelled (${countByStatus('cancelled')})` },
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
        <p style={styles.loading}>Loading rides...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Rider</th>
                <th style={styles.th}>Driver</th>
                <th style={styles.th}>Pickup</th>
                <th style={styles.th}>Dropoff</th>
                <th style={styles.th}>Fare</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRides.length === 0 ? (
                <tr>
                  <td colSpan="8" style={styles.emptyRow}>No rides found</td>
                </tr>
              ) : (
                filteredRides.map((ride) => (
                  <tr key={ride._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <p style={styles.name}>{ride.rider?.name || 'N/A'}</p>
                      <p style={styles.sub}>{ride.rider?.email}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.name}>{ride.driver?.name || 'Unassigned'}</p>
                      <p style={styles.sub}>{ride.driver?.email}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.location}>{ride.pickupLocation?.address}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.location}>{ride.dropoffLocation?.address}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.fare}>₦{ride.fare?.toLocaleString()}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: getStatusColor(ride.status)
                      }}>
                        {ride.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: ride.paymentStatus === 'paid' ? '#2ecc71' : '#e74c3c'
                      }}>
                        {ride.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.date}>
                        {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}

const styles = {
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  statsRow: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' },
  statCard: {
    background: '#fff', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: '120px', flex: 1
  },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '12px', color: '#666', margin: 0 },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  searchBox: { marginBottom: '16px' },
  searchInput: {
    width: '100%', maxWidth: '400px', padding: '12px 16px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '8px 14px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: '1px solid #1a1a2e',
    padding: '8px 14px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  },
  loading: { color: '#666' },
  tableWrapper: {
    overflowX: 'auto', background: '#fff',
    borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#1a1a2e' },
  th: { padding: '14px 16px', textAlign: 'left', color: '#f6c90e', fontSize: '13px', fontWeight: '700' },
  tableRow: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: '13px', color: '#333' },
  emptyRow: { padding: '40px', textAlign: 'center', color: '#999' },
  name: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  sub: { fontSize: '11px', color: '#999', margin: 0 },
  location: { fontSize: '12px', color: '#555', margin: 0, maxWidth: '150px' },
  fare: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  date: { fontSize: '12px', color: '#666', margin: 0 },
  badge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  }
}

export default AdminRides