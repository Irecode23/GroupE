import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('open')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [adminResponse, setAdminResponse] = useState('')
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const { data } = await API.get('/complaints/all')
      setComplaints(data)
    } catch (err) {
      setError('Failed to load complaints')
    }
    setLoading(false)
  }

  const handleUpdateStatus = async (complaintId) => {
    try {
      await API.put(`/complaints/${complaintId}`, {
        status: newStatus,
        adminResponse
      })
      setMessage('Complaint updated successfully!')
      setSelectedComplaint(null)
      setAdminResponse('')
      setNewStatus('')
      fetchComplaints()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update complaint')
    }
  }

  const handleDelete = async (complaintId) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return
    try {
      await API.delete(`/complaints/${complaintId}`)
      setMessage('Complaint deleted successfully!')
      fetchComplaints()
    } catch (err) {
      setError('Failed to delete complaint')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: '#e74c3c',
      investigating: '#f6c90e',
      resolved: '#2ecc71',
      dismissed: '#999'
    }
    return colors[status] || '#999'
  }

  const getCategoryLabel = (category) => {
    const labels = {
      driver_behavior: '🚘 Driver Behavior',
      rider_behavior: '🙋 Rider Behavior',
      payment_issue: '💰 Payment Issue',
      app_issue: '📱 App Issue',
      safety_concern: '🔒 Safety Concern',
      other: '📝 Other'
    }
    return labels[category] || category
  }

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.submittedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === 'all') return matchesSearch
    return c.status === activeTab && matchesSearch
  })

  const countByStatus = (status) => complaints.filter(c => c.status === status).length

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Complaints & Disputes</h2>
        <p style={styles.subtitle}>Manage and resolve complaints from riders and drivers</p>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e74c3c' }}>
          <p style={{ ...styles.statNumber, color: '#e74c3c' }}>{countByStatus('open')}</p>
          <p style={styles.statLabel}>Open</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #f6c90e' }}>
          <p style={{ ...styles.statNumber, color: '#f6c90e' }}>{countByStatus('investigating')}</p>
          <p style={styles.statLabel}>Investigating</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
          <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{countByStatus('resolved')}</p>
          <p style={styles.statLabel}>Resolved</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #999' }}>
          <p style={{ ...styles.statNumber, color: '#999' }}>{countByStatus('dismissed')}</p>
          <p style={styles.statLabel}>Dismissed</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #1a1a2e' }}>
          <p style={styles.statNumber}>{complaints.length}</p>
          <p style={styles.statLabel}>Total</p>
        </div>
      </div>

      {message && (
        <div style={styles.success} onClick={() => setMessage('')}>
          ✅ {message} <span style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        </div>
      )}
      {error && (
        <div style={styles.error} onClick={() => setError('')}>
          ❌ {error} <span style={{ float: 'right', cursor: 'pointer' }}>✕</span>
        </div>
      )}

      {/* Search */}
      <div style={styles.searchBox}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="🔍 Search by subject or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'open', label: `🔴 Open (${countByStatus('open')})` },
          { key: 'investigating', label: `🟡 Investigating (${countByStatus('investigating')})` },
          { key: 'resolved', label: `🟢 Resolved (${countByStatus('resolved')})` },
          { key: 'dismissed', label: `⚫ Dismissed (${countByStatus('dismissed')})` },
          { key: 'all', label: `All (${complaints.length})` },
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

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Complaint Details</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedComplaint(null)}
              >
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Submitted By:</span>
                <span style={styles.detailValue}>
                  {selectedComplaint.submittedBy?.name} ({selectedComplaint.submittedBy?.role})
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Category:</span>
                <span style={styles.detailValue}>
                  {getCategoryLabel(selectedComplaint.category)}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Subject:</span>
                <span style={styles.detailValue}>{selectedComplaint.subject}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Description:</span>
                <span style={styles.detailValue}>{selectedComplaint.description}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Current Status:</span>
                <span style={{
                  ...styles.badge,
                  background: getStatusColor(selectedComplaint.status)
                }}>
                  {selectedComplaint.status}
                </span>
              </div>
              {selectedComplaint.adminResponse && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Previous Response:</span>
                  <span style={styles.detailValue}>{selectedComplaint.adminResponse}</span>
                </div>
              )}

              <div style={styles.inputGroup}>
                <label style={styles.label}>Update Status</label>
                <select
                  style={styles.input}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Select status...</option>
                  <option value="open">Open</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Admin Response</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Write your response to the user..."
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows={4}
                />
              </div>

              <button
                style={styles.submitBtn}
                onClick={() => handleUpdateStatus(selectedComplaint._id)}
              >
                Update Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Loading complaints...</p>
      ) : (
        <div style={styles.complaintsList}>
          {filteredComplaints.length === 0 ? (
            <div style={styles.empty}>No complaints found</div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint._id} style={styles.complaintCard}>
                <div style={styles.complaintTop}>
                  <div style={styles.complaintLeft}>
                    <span style={{
                      ...styles.badge,
                      background: getStatusColor(complaint.status)
                    }}>
                      {complaint.status.toUpperCase()}
                    </span>
                    <span style={styles.category}>
                      {getCategoryLabel(complaint.category)}
                    </span>
                  </div>
                  <span style={styles.date}>
                    {new Date(complaint.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                <h4 style={styles.subject}>{complaint.subject}</h4>
                <p style={styles.description}>{complaint.description}</p>

                <div style={styles.complaintFooter}>
                  <div style={styles.submittedBy}>
                    <div style={styles.userAvatar}>
                      {complaint.submittedBy?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={styles.userName}>{complaint.submittedBy?.name}</p>
                      <p style={styles.userRole}>{complaint.submittedBy?.role}</p>
                    </div>
                  </div>
                  <div style={styles.complaintActions}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => {
                        setSelectedComplaint(complaint)
                        setNewStatus(complaint.status)
                        setAdminResponse(complaint.adminResponse || '')
                      }}
                    >
                      Respond
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(complaint._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {complaint.adminResponse && (
                  <div style={styles.adminResponseBox}>
                    <p style={styles.adminResponseLabel}>Admin Response:</p>
                    <p style={styles.adminResponseText}>{complaint.adminResponse}</p>
                  </div>
                )}
              </div>
            ))
          )}
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
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: '100px', flex: 1
  },
  statNumber: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 4px' },
  statLabel: { fontSize: '12px', color: '#666', margin: 0 },
  success: {
    background: '#e0ffe0', color: '#060', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px 16px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', cursor: 'pointer'
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
  empty: { textAlign: 'center', padding: '40px', color: '#999' },
  complaintsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  complaintCard: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  complaintTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px'
  },
  complaintLeft: { display: 'flex', gap: '8px', alignItems: 'center' },
  badge: {
    color: '#fff', padding: '3px 10px', borderRadius: '20px',
    fontSize: '11px', fontWeight: '700'
  },
  category: { fontSize: '12px', color: '#666', fontWeight: '600' },
  date: { fontSize: '12px', color: '#999' },
  subject: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  description: { fontSize: '14px', color: '#555', margin: '0 0 16px', lineHeight: '1.5' },
  complaintFooter: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '12px'
  },
  submittedBy: { display: 'flex', alignItems: 'center', gap: '10px' },
  userAvatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  userName: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  userRole: { fontSize: '11px', color: '#999', margin: 0 },
  complaintActions: { display: 'flex', gap: '8px' },
  viewBtn: {
    background: '#3498db', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '6px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  },
  deleteBtn: {
    background: '#e74c3c', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '6px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  },
  adminResponseBox: {
    background: '#f0f9ff', padding: '12px 16px',
    borderRadius: '8px', marginTop: '12px',
    borderLeft: '3px solid #3498db'
  },
  adminResponseLabel: { fontSize: '12px', fontWeight: '700', color: '#3498db', margin: '0 0 4px' },
  adminResponseText: { fontSize: '13px', color: '#555', margin: 0 },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', borderRadius: '12px', width: '100%',
    maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '20px 24px',
    borderBottom: '1px solid #eee'
  },
  modalTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px',
    cursor: 'pointer', color: '#999'
  },
  modalBody: { padding: '24px' },
  detailRow: {
    display: 'flex', gap: '12px', marginBottom: '12px',
    flexWrap: 'wrap'
  },
  detailLabel: { fontSize: '13px', fontWeight: '700', color: '#666', minWidth: '130px' },
  detailValue: { fontSize: '13px', color: '#333', flex: 1 },
  inputGroup: { marginBottom: '16px', marginTop: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#333' },
  input: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none'
  },
  textarea: {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none', resize: 'vertical'
  },
  submitBtn: {
    width: '100%', padding: '12px', background: '#f6c90e',
    color: '#1a1a2e', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer'
  }
}

export default AdminComplaints