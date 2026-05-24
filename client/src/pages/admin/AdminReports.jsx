import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminReports() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const params = startDate && endDate
        ? `?startDate=${startDate}&endDate=${endDate}`
        : ''
      const { data } = await API.get(`/reports/generate${params}`)
      setReport(data)
    } catch (err) {
      setError('Failed to generate report')
    }
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const printContent = document.getElementById('report-content')
    const originalBody = document.body.innerHTML
    document.body.innerHTML = printContent.innerHTML
    window.print()
    document.body.innerHTML = originalBody
    window.location.reload()
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>⏳ Generating report...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Reports & Analytics</h2>
          <p style={styles.subtitle}>Generate and download platform reports</p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.printBtn} onClick={handlePrint}>
            🖨️ Print
          </button>
          <button style={styles.downloadBtn} onClick={handleDownloadPDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div style={styles.filterBox}>
        <h3 style={styles.filterTitle}>📅 Filter by Date Range</h3>
        <div style={styles.filterRow}>
          <div style={styles.filterItem}>
            <label style={styles.label}>Start Date</label>
            <input
              style={styles.dateInput}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={styles.filterItem}>
            <label style={styles.label}>End Date</label>
            <input
              style={styles.dateInput}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button style={styles.generateBtn} onClick={fetchReport}>
            Generate Report
          </button>
          <button
            style={styles.resetBtn}
            onClick={() => {
              setStartDate('')
              setEndDate('')
              fetchReport()
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {report && (
        <div id="report-content">
          {/* Report Header */}
          <div style={styles.reportHeader}>
            <h3 style={styles.reportTitle}>🚗 RideShare Platform Report</h3>
            <p style={styles.reportDate}>
              Generated: {new Date(report.generatedAt).toLocaleString('en-NG')}
            </p>
            {report.period.startDate && (
              <p style={styles.reportPeriod}>
                Period: {report.period.startDate} to {report.period.endDate}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {[
              { key: 'summary', label: '📊 Summary' },
              { key: 'users', label: '👥 Users' },
              { key: 'rides', label: '🚗 Rides' },
              { key: 'payments', label: '💰 Payments' },
              { key: 'complaints', label: '📝 Complaints' },
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

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div>
              <div style={styles.summaryGrid}>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #3498db' }}>
                  <p style={styles.summaryNumber}>{report.summary.totalUsers}</p>
                  <p style={styles.summaryLabel}>Total Users</p>
                  <div style={styles.summaryBreakdown}>
                    <span>🙋 {report.summary.totalRiders} riders</span>
                    <span>🚘 {report.summary.totalDrivers} drivers</span>
                  </div>
                </div>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #2ecc71' }}>
                  <p style={{ ...styles.summaryNumber, color: '#2ecc71' }}>
                    {report.summary.verifiedUsers}
                  </p>
                  <p style={styles.summaryLabel}>Verified Users</p>
                  <div style={styles.summaryBreakdown}>
                    <span>⏳ {report.summary.pendingUsers} pending</span>
                  </div>
                </div>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #9b59b6' }}>
                  <p style={{ ...styles.summaryNumber, color: '#9b59b6' }}>
                    {report.summary.totalRides}
                  </p>
                  <p style={styles.summaryLabel}>Total Rides</p>
                  <div style={styles.summaryBreakdown}>
                    <span>✅ {report.summary.completedRides} completed</span>
                    <span>❌ {report.summary.cancelledRides} cancelled</span>
                  </div>
                </div>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #f6c90e' }}>
                  <p style={{ ...styles.summaryNumber, color: '#f6c90e' }}>
                    ₦{report.summary.totalRevenue?.toLocaleString()}
                  </p>
                  <p style={styles.summaryLabel}>Total Revenue</p>
                  <div style={styles.summaryBreakdown}>
                    <span>💰 ₦{report.summary.totalCommission?.toLocaleString()} commission</span>
                  </div>
                </div>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #e74c3c' }}>
                  <p style={{ ...styles.summaryNumber, color: '#e74c3c' }}>
                    {report.summary.totalComplaints}
                  </p>
                  <p style={styles.summaryLabel}>Total Complaints</p>
                  <div style={styles.summaryBreakdown}>
                    <span>🔴 {report.summary.openComplaints} open</span>
                    <span>🟢 {report.summary.resolvedComplaints} resolved</span>
                  </div>
                </div>
                <div style={{ ...styles.summaryCard, borderTop: '4px solid #1abc9c' }}>
                  <p style={{ ...styles.summaryNumber, color: '#1abc9c' }}>
                    {report.summary.averageRating}⭐
                  </p>
                  <p style={styles.summaryLabel}>Average Rating</p>
                  <div style={styles.summaryBreakdown}>
                    <span>📝 {report.summary.totalRatings} total ratings</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div style={styles.tableWrapper}>
              <h3 style={styles.sectionTitle}>User Report ({report.users.length} users)</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Verified</th>
                    <th style={styles.th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {report.users.map(u => (
                    <tr key={u._id} style={styles.tableRow}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.phone}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.role === 'driver' ? '#1a1a2e' : '#3498db'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: u.isVerified ? '#2ecc71' : '#f6c90e',
                          color: u.isVerified ? '#fff' : '#1a1a2e'
                        }}>
                          {u.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(u.createdAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Rides Tab */}
          {activeTab === 'rides' && (
            <div style={styles.tableWrapper}>
              <h3 style={styles.sectionTitle}>Ride Report ({report.rides.length} rides)</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Rider</th>
                    <th style={styles.th}>Driver</th>
                    <th style={styles.th}>Pickup</th>
                    <th style={styles.th}>Dropoff</th>
                    <th style={styles.th}>Fare</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rides.map(ride => (
                    <tr key={ride._id} style={styles.tableRow}>
                      <td style={styles.td}>{ride.rider?.name || 'N/A'}</td>
                      <td style={styles.td}>{ride.driver?.name || 'Unassigned'}</td>
                      <td style={styles.td}>{ride.pickupLocation?.address}</td>
                      <td style={styles.td}>{ride.dropoffLocation?.address}</td>
                      <td style={styles.td}>₦{ride.fare?.toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: ride.status === 'completed' ? '#2ecc71' :
                            ride.status === 'cancelled' ? '#e74c3c' : '#f6c90e',
                          color: ride.status === 'pending' ? '#1a1a2e' : '#fff'
                        }}>
                          {ride.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(ride.createdAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div style={styles.tableWrapper}>
              <h3 style={styles.sectionTitle}>
                Payment Report ({report.payments.length} transactions)
              </h3>
              <div style={styles.paymentSummary}>
                <div style={styles.paymentSummaryCard}>
                  <p style={styles.paymentSummaryNumber}>
                    ₦{report.summary.totalRevenue?.toLocaleString()}
                  </p>
                  <p style={styles.paymentSummaryLabel}>Total Revenue</p>
                </div>
                <div style={styles.paymentSummaryCard}>
                  <p style={{ ...styles.paymentSummaryNumber, color: '#9b59b6' }}>
                    ₦{report.summary.totalCommission?.toLocaleString()}
                  </p>
                  <p style={styles.paymentSummaryLabel}>Commission (10%)</p>
                </div>
                <div style={styles.paymentSummaryCard}>
                  <p style={{ ...styles.paymentSummaryNumber, color: '#2ecc71' }}>
                    ₦{(report.summary.totalRevenue - report.summary.totalCommission)?.toLocaleString()}
                  </p>
                  <p style={styles.paymentSummaryLabel}>Driver Earnings (90%)</p>
                </div>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Transaction Ref</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Commission</th>
                    <th style={styles.th}>Driver Earning</th>
                    <th style={styles.th}>Method</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.payments.map(payment => (
                    <tr key={payment._id} style={styles.tableRow}>
                      <td style={styles.td}>
                        <span style={styles.ref}>{payment.transactionRef}</span>
                      </td>
                      <td style={styles.td}>₦{payment.amount?.toLocaleString()}</td>
                      <td style={styles.td}>₦{payment.commission?.toLocaleString()}</td>
                      <td style={styles.td}>₦{payment.driverEarning?.toLocaleString()}</td>
                      <td style={styles.td}>{payment.paymentMethod}</td>
                      <td style={styles.td}>
                        {new Date(payment.createdAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div style={styles.tableWrapper}>
              <h3 style={styles.sectionTitle}>
                Complaints Report ({report.complaints.length} complaints)
              </h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Submitted By</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Subject</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {report.complaints.map(complaint => (
                    <tr key={complaint._id} style={styles.tableRow}>
                      <td style={styles.td}>
                        <p style={styles.name}>{complaint.submittedBy?.name}</p>
                        <p style={styles.sub}>{complaint.submittedBy?.role}</p>
                      </td>
                      <td style={styles.td}>{complaint.category}</td>
                      <td style={styles.td}>{complaint.subject}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          background: complaint.status === 'resolved' ? '#2ecc71' :
                            complaint.status === 'open' ? '#e74c3c' : '#f6c90e',
                          color: complaint.status === 'investigating' ? '#1a1a2e' : '#fff'
                        }}>
                          {complaint.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(complaint.createdAt).toLocaleDateString('en-NG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
  },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0 },
  headerActions: { display: 'flex', gap: '12px' },
  printBtn: {
    background: '#fff', color: '#1a1a2e', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  downloadBtn: {
    background: '#1a1a2e', color: '#f6c90e', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  filterBox: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '24px'
  },
  filterTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' },
  filterRow: { display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' },
  filterItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#333' },
  dateInput: {
    padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', outline: 'none'
  },
  generateBtn: {
    background: '#f6c90e', color: '#1a1a2e', border: 'none',
    padding: '10px 24px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  },
  resetBtn: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '10px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  loading: { padding: '40px', color: '#666', fontSize: '16px', textAlign: 'center' },
  reportHeader: {
    background: '#1a1a2e', padding: '24px', borderRadius: '12px',
    marginBottom: '24px', color: '#fff'
  },
  reportTitle: { color: '#f6c90e', margin: '0 0 8px', fontSize: '20px' },
  reportDate: { color: '#ccc', margin: '0 0 4px', fontSize: '13px' },
  reportPeriod: { color: '#ccc', margin: 0, fontSize: '13px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff', color: '#666', border: '1px solid #ddd',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e', color: '#f6c90e', border: '1px solid #1a1a2e',
    padding: '8px 16px', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px', marginBottom: '24px'
  },
  summaryCard: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  summaryNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  summaryLabel: { fontSize: '14px', fontWeight: '600', color: '#333', margin: '0 0 8px' },
  summaryBreakdown: {
    display: 'flex', gap: '8px', flexWrap: 'wrap',
    fontSize: '12px', color: '#666'
  },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 16px' },
  tableWrapper: {
    background: '#fff', borderRadius: '12px',
    padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflowX: 'auto', marginBottom: '24px'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#1a1a2e' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#f6c90e', fontSize: '12px', fontWeight: '700' },
  tableRow: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: '12px', color: '#333' },
  badge: {
    color: '#fff', padding: '2px 8px', borderRadius: '20px',
    fontSize: '10px', fontWeight: '700'
  },
  name: { fontSize: '12px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  sub: { fontSize: '11px', color: '#999', margin: 0 },
  ref: { fontSize: '11px', color: '#999', fontFamily: 'monospace' },
  paymentSummary: { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' },
  paymentSummaryCard: {
    background: '#f9f9f9', padding: '16px 24px', borderRadius: '8px', flex: 1
  },
  paymentSummaryNumber: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  paymentSummaryLabel: { fontSize: '12px', color: '#666', margin: 0 }
}

export default AdminReports