import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import API from '../../api/axios'

function AdminRatings() {
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRatings()
  }, [])

  const fetchRatings = async () => {
    try {
      const { data } = await API.get('/ratings/all')
      setRatings(data)
    } catch (err) {
      setError('Failed to load ratings')
    }
    setLoading(false)
  }

  const handleFlag = async (ratingId, flagReason) => {
    try {
      await API.put(`/ratings/flag/${ratingId}`, { flagReason })
      setMessage('Rating flagged successfully!')
      fetchRatings()
    } catch (err) {
      setError('Failed to flag rating')
    }
  }

  const handleDelete = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) return
    try {
      await API.delete(`/ratings/${ratingId}`)
      setMessage('Rating deleted successfully!')
      fetchRatings()
    } catch (err) {
      setError('Failed to delete rating')
    }
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : 0

  const filteredRatings = ratings.filter(r => {
    const matchesSearch =
      r.ratedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ratedUser?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.review?.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeTab === 'flagged') return r.isFlagged && matchesSearch
    if (activeTab === '5') return r.rating === 5 && matchesSearch
    if (activeTab === '4') return r.rating === 4 && matchesSearch
    if (activeTab === '3') return r.rating === 3 && matchesSearch
    if (activeTab === 'low') return r.rating <= 2 && matchesSearch
    return matchesSearch
  })

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h2 style={styles.title}>Ratings & Reviews</h2>
        <p style={styles.subtitle}>Monitor and manage user ratings and reviews</p>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #f6c90e' }}>
          <p style={styles.statNumber}>{ratings.length}</p>
          <p style={styles.statLabel}>Total Ratings</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
          <p style={{ ...styles.statNumber, color: '#2ecc71' }}>{avgRating}</p>
          <p style={styles.statLabel}>Average Rating</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e74c3c' }}>
          <p style={{ ...styles.statNumber, color: '#e74c3c' }}>
            {ratings.filter(r => r.isFlagged).length}
          </p>
          <p style={styles.statLabel}>Flagged Reviews</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
          <p style={{ ...styles.statNumber, color: '#3498db' }}>
            {ratings.filter(r => r.rating === 5).length}
          </p>
          <p style={styles.statLabel}>5 Star Ratings</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e67e22' }}>
          <p style={{ ...styles.statNumber, color: '#e67e22' }}>
            {ratings.filter(r => r.rating <= 2).length}
          </p>
          <p style={styles.statLabel}>Low Ratings (1-2)</p>
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
          placeholder="🔍 Search by user or review..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: 'all', label: `All (${ratings.length})` },
          { key: '5', label: `⭐⭐⭐⭐⭐ (${ratings.filter(r => r.rating === 5).length})` },
          { key: '4', label: `⭐⭐⭐⭐ (${ratings.filter(r => r.rating === 4).length})` },
          { key: '3', label: `⭐⭐⭐ (${ratings.filter(r => r.rating === 3).length})` },
          { key: 'low', label: `⭐⭐ & below (${ratings.filter(r => r.rating <= 2).length})` },
          { key: 'flagged', label: `🚩 Flagged (${ratings.filter(r => r.isFlagged).length})` },
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
        <p style={styles.loading}>Loading ratings...</p>
      ) : (
        <div style={styles.ratingsList}>
          {filteredRatings.length === 0 ? (
            <div style={styles.empty}>No ratings found</div>
          ) : (
            filteredRatings.map((rating) => (
              <div
                key={rating._id}
                style={{
                  ...styles.ratingCard,
                  borderLeft: rating.isFlagged ? '4px solid #e74c3c' : '4px solid #f6c90e'
                }}
              >
                <div style={styles.ratingTop}>
                  <div style={styles.ratingLeft}>
                    <span style={styles.stars}>{renderStars(rating.rating)}</span>
                    <span style={styles.ratingNumber}>{rating.rating}/5</span>
                    {rating.isFlagged && (
                      <span style={styles.flaggedBadge}>🚩 Flagged</span>
                    )}
                  </div>
                  <span style={styles.date}>
                    {new Date(rating.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>

                {rating.review && (
                  <p style={styles.review}>"{rating.review}"</p>
                )}

                <div style={styles.ratingUsers}>
                  <div style={styles.userInfo}>
                    <p style={styles.userLabel}>Rated By</p>
                    <div style={styles.userCell}>
                      <div style={styles.avatar}>
                        {rating.ratedBy?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={styles.userName}>{rating.ratedBy?.name}</p>
                        <p style={styles.userRole}>{rating.ratedBy?.role}</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.arrow}>→</div>
                  <div style={styles.userInfo}>
                    <p style={styles.userLabel}>Rated User</p>
                    <div style={styles.userCell}>
                      <div style={{ ...styles.avatar, background: '#3498db' }}>
                        {rating.ratedUser?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={styles.userName}>{rating.ratedUser?.name}</p>
                        <p style={styles.userRole}>{rating.ratedUser?.role}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {rating.isFlagged && rating.flagReason && (
                  <div style={styles.flagReasonBox}>
                    <p style={styles.flagReasonLabel}>Flag Reason:</p>
                    <p style={styles.flagReasonText}>{rating.flagReason}</p>
                  </div>
                )}

                <div style={styles.ratingActions}>
                  {!rating.isFlagged && (
                    <button
                      style={styles.flagBtn}
                      onClick={() => {
                        const reason = window.prompt('Enter reason for flagging:')
                        if (reason) handleFlag(rating._id, reason)
                      }}
                    >
                      🚩 Flag
                    </button>
                  )}
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(rating._id)}
                  >
                    Delete
                  </button>
                </div>
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
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', minWidth: '120px', flex: 1
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
  ratingsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  ratingCard: {
    background: '#fff', padding: '24px', borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
  },
  ratingTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '12px'
  },
  ratingLeft: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { fontSize: '16px' },
  ratingNumber: { fontSize: '14px', fontWeight: '700', color: '#1a1a2e' },
  flaggedBadge: {
    background: '#ffe0e0', color: '#e74c3c', padding: '2px 8px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700'
  },
  date: { fontSize: '12px', color: '#999' },
  review: {
    fontSize: '14px', color: '#555', fontStyle: 'italic',
    margin: '0 0 16px', lineHeight: '1.5'
  },
  ratingUsers: {
    display: 'flex', alignItems: 'center', gap: '16px',
    marginBottom: '16px', flexWrap: 'wrap'
  },
  userInfo: { flex: 1 },
  userLabel: { fontSize: '11px', color: '#999', fontWeight: '600', margin: '0 0 6px' },
  userCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#f6c90e', color: '#1a1a2e', fontSize: '14px',
    fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  userName: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 2px' },
  userRole: { fontSize: '11px', color: '#999', margin: 0 },
  arrow: { fontSize: '20px', color: '#ccc' },
  flagReasonBox: {
    background: '#fff5f5', padding: '10px 14px', borderRadius: '8px',
    marginBottom: '12px', borderLeft: '3px solid #e74c3c'
  },
  flagReasonLabel: { fontSize: '11px', fontWeight: '700', color: '#e74c3c', margin: '0 0 4px' },
  flagReasonText: { fontSize: '13px', color: '#555', margin: 0 },
  ratingActions: { display: 'flex', gap: '8px' },
  flagBtn: {
    background: '#fff5f5', color: '#e74c3c', border: '1px solid #e74c3c',
    padding: '6px 14px', borderRadius: '6px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  },
  deleteBtn: {
    background: '#e74c3c', color: '#fff', border: 'none',
    padding: '6px 14px', borderRadius: '6px',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer'
  }
}

export default AdminRatings