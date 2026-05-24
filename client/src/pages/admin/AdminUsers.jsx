import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users/all')
      setUsers(data)
    } catch (err) {
      setError('Failed to load users')
    }
    setLoading(false)
  }

  const handleVerify = async (userId) => {
    console.log('Verifying user ID:', userId)
    const user = JSON.parse(localStorage.getItem('user'))
    console.log('Current token:', user?.token)
    try {
      const { data } = await API.put(`/users/verify/${userId}`)
      console.log('Verify response:', data)
      setMessage(data.message)
      fetchUsers()
    } catch (err) {
      console.log('Verify error:', err.response)
      setError(err.response?.data?.message || 'Failed to verify user')
      if (err.response?.status === 401) {
        alert('Session expired! Please login again.')
        logout()
        navigate('/admin/login')
      }
    }
  }

  const handleUnverify = async (userId) => {
    try {
      const { data } = await API.put(`/users/unverify/${userId}`)
      setMessage(data.message)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unverify user')
      if (err.response?.status === 401) {
        logout()
        navigate('/admin/login')
      }
    }
  }

  const handleSuspend = async (userId) => {
    try {
      const { data } = await API.put(`/users/suspend/${userId}`)
      setMessage(data.message)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to suspend user')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await API.delete(`/users/${userId}`)
      setMessage('User deleted successfully!')
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === 'pending') return !u.isVerified && matchesSearch
    if (activeTab === 'verified') return u.isVerified && matchesSearch
    if (activeTab === 'riders') return u.role === 'rider' && matchesSearch
    if (activeTab === 'drivers') return u.role === 'driver' && matchesSearch
    if (activeTab === 'suspended') return !u.isActive && matchesSearch
    return matchesSearch
  })

  const pendingCount = users.filter(u => !u.isVerified).length
  const verifiedCount = users.filter(u => u.isVerified).length
  const ridersCount = users.filter(u => u.role === 'rider').length
  const driversCount = users.filter(u => u.role === 'driver').length
  const suspendedCount = users.filter(u => !u.isActive).length

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>User Management</h2>
        <p style={styles.subtitle}>Verify, suspend, or delete user accounts</p>
      </div>

      {message && (
        <div style={styles.success} onClick={() => setMessage('')}>
          {message} <span style={{ cursor: 'pointer', float: 'right' }}>X</span>
        </div>
      )}
      {error && (
        <div style={styles.error} onClick={() => setError('')}>
          {error} <span style={{ cursor: 'pointer', float: 'right' }}>X</span>
        </div>
      )}

      <div style={styles.searchBox}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tabs}>
        {[
          { key: 'pending', label: 'Pending (' + pendingCount + ')' },
          { key: 'verified', label: 'Verified (' + verifiedCount + ')' },
          { key: 'riders', label: 'Riders (' + ridersCount + ')' },
          { key: 'drivers', label: 'Drivers (' + driversCount + ')' },
          { key: 'suspended', label: 'Suspended (' + suspendedCount + ')' },
          { key: 'all', label: 'All (' + users.length + ')' },
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
        <p style={styles.loading}>Loading users...</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Account</th>
                <th style={styles.th}>Joined</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={styles.emptyRow}>No users found</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={styles.avatar}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={styles.userName}>{u.name}</p>
                          <p style={styles.userEmail}>{u.email}</p>
                        </div>
                      </div>
                    </td>
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
                      {u.isVerified ? (
                        <span style={{ ...styles.badge, background: '#2ecc71' }}>
                          Verified
                        </span>
                      ) : (
                        <span style={{ ...styles.badge, background: '#f6c90e', color: '#1a1a2e' }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {u.isActive ? (
                        <span style={{ ...styles.badge, background: '#2ecc71' }}>Active</span>
                      ) : (
                        <span style={{ ...styles.badge, background: '#e74c3c' }}>Suspended</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      {new Date(u.createdAt).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        {!u.isVerified ? (
                          <button
                            style={styles.verifyBtn}
                            onClick={() => handleVerify(u._id)}
                          >
                            Verify
                          </button>
                        ) : (
                          <button
                            style={styles.unverifyBtn}
                            onClick={() => handleUnverify(u._id)}
                          >
                            Unverify
                          </button>
                        )}
                        <button
                          style={u.isActive ? styles.suspendBtn : styles.activateBtn}
                          onClick={() => handleSuspend(u._id)}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      </div>
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
  success: {
    background: '#e0ffe0',
    color: '#060',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  error: {
    background: '#ffe0e0',
    color: '#d00',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  searchBox: { marginBottom: '16px' },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    maxWidth: '400px'
  },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: {
    background: '#fff',
    color: '#666',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  activeTab: {
    background: '#1a1a2e',
    color: '#f6c90e',
    border: '1px solid #1a1a2e',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  loading: { color: '#666' },
  tableWrapper: {
    overflowX: 'auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#1a1a2e' },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    color: '#f6c90e',
    fontSize: '13px',
    fontWeight: '700'
  },
  tableRow: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#333' },
  emptyRow: { padding: '40px', textAlign: 'center', color: '#999' },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#f6c90e',
    color: '#1a1a2e',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  userName: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  userEmail: { fontSize: '12px', color: '#999', margin: 0 },
  badge: {
    color: '#fff',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  actionBtns: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  verifyBtn: {
    background: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  unverifyBtn: {
    background: '#e67e22',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  suspendBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  activateBtn: {
    background: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  deleteBtn: {
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}

export default AdminUsers