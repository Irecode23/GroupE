import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const [paymentsRes, statsRes] = await Promise.all([
        API.get('/payments/all'),
        API.get('/payments/stats')
      ])
      setPayments(paymentsRes.data)
      setStats(statsRes.data)
    } catch (err) {
      setError('Failed to load payments')
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f6c90e',
      completed: '#2ecc71',
      failed: '#e74c3c',
      refunded: '#3498db'
    }
    return colors[status] || '#999'
  }

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.rider?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef?.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    return p.paymentMethod === activeTab && matchesSearch
  })

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Payments & Transactions</h2>
        <p style={styles.subtitle}>Monitor all payment activities and transactions</p>
      </div>

      {/* Stats */}
      {stats && (
        <div style={styles.statsGrid}>
          <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
            <p style={{ ...styles.statNumber, color: '#2ecc71' }}>
              ₦{stats.totalRevenue?.toLocaleString()}
            </p>
            <p style={styles.statLabel}>Total Revenue</p>
            <p style={styles.statSub}>{stats.totalTransactions} transactions</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #9b59b6' }}>
            <p style={{ ...styles.statNumber, color: '#9b59b6' }}>
              ₦{stats.totalCommission?.toLocaleString()}
            </p>
            <p style={styles.statLabel}>Total Commission</p>
            <p style={styles.statSub}>10% per ride</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
            <p style={{ ...styles.statNumber, color: '#3498db' }}>
              ₦{stats.totalDriverEarnings?.toLocaleString()}
            </p>
            <p style={styles.statLabel}>Driver Earnings</p>
            <p style={styles.statSub}>90% per ride</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #f6c90e' }}>
            <p style={{ ...styles.statNumber, color: '#f6c90e' }}>
              {stats.paymentMethods?.cash || 0}
            </p>
            <p style={styles.statLabel}>Cash Payments</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #1abc9c' }}>
            <p style={{ ...styles.statNumber, color: '#1abc9c' }}>
              {stats.paymentMethods?.card || 0}
            </p>
            <p style={styles.statLabel}>Card Payments</p>
          </div>
          <div style={{ ...styles.statCard, borderTop: '4px solid #e67e22' }}>
            <p style={{ ...styles.statNumber, color: '#e67e22' }}>
              {stats.paymentMethods?.transfer || 0}
            </p>
            <p style={styles.statLabel}>Transfer Payments</p>
          </div>
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
          placeholder="🔍 Search by rider, driver or transaction ref..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'all', label: `All (${payments.length})` },
          { key: 'cash', label: `💵 Cash (${payments.filter(p => p.paymentMethod === 'cash').length})` },
          { key: 'card', label: `💳 Card (${payments.filter(p => p.paymentMethod === 'card').length})` },
          { key: 'transfer', label: `🏦 Transfer (${payments.filter(p => p.paymentMethod === 'transfer').length})` },
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
        <p style={styles.loading}>Loading payments...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Transaction Ref</th>
                <th style={styles.th}>Rider</th>
                <th style={styles.th}>Driver</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Commission</th>
                <th style={styles.th}>Driver Earning</th>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="9" style={styles.emptyRow}>No payments found</td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <p style={styles.ref}>{payment.transactionRef}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.name}>{payment.rider?.name || 'N/A'}</p>
                      <p style={styles.sub}>{payment.rider?.phone}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.name}>{payment.driver?.name || 'N/A'}</p>
                      <p style={styles.sub}>{payment.driver?.phone}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.amount}>₦{payment.amount?.toLocaleString()}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={{ ...styles.amount, color: '#9b59b6' }}>
                        ₦{payment.commission?.toLocaleString()}
                      </p>
                    </td>
                    <td style={styles.td}>
                      <p style={{ ...styles.amount, color: '#2ecc71' }}>
                        ₦{payment.driverEarning?.toLocaleString()}
                      </p>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: payment.paymentMethod === 'cash' ? '#e67e22' :
                          payment.paymentMethod === 'card' ? '#3498db' : '#1abc9c'
                      }}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        background: getStatusColor(payment.status)
                      }}>
                        {payment.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.date}>
                        {new Date(payment.createdAt).toLocaleDateString('en-NG', {
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
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px', marginBottom: '24px'
  },
  statCard: {
    background: '#fff', padding: '20px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  statNumber: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '13px', fontWeight: '600', color: '#333', margin: '0 0 4px' },
  statSub: { fontSize: '11px', color: '#999', margin: 0 },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  searchBox: { marginBottom: '16px' },
  searchInput: {
    width: '100%', maxWidth: '500px', padding: '12px 16px',
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
  ref: { fontSize: '11px', color: '#999', fontFamily: 'monospace', margin: 0 },
  name: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  sub: { fontSize: '11px', color: '#999', margin: 0 },
  amount: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  date: { fontSize: '12px', color: '#666', margin: 0 },
  badge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  }
}

export default AdminPayments