import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications')
      setNotifications(data)
    } catch (err) {
      console.error('Failed to fetch notifications')
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`)
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      )
    } catch (err) {
      console.error('Failed to mark as read')
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    try {
      await API.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (err) {
      console.error('Failed to delete notification')
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      ride: '🚗',
      payment: '💰',
      complaint: '📝',
      verification: '✅',
      system: '📢'
    }
    return icons[type] || '🔔'
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        style={styles.bellBtn}
        onClick={() => {
          setOpen(!open)
          if (!open) fetchNotifications()
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <h3 style={styles.dropdownTitle}>
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={styles.unreadBadge}>{unreadCount} new</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                style={styles.markAllBtn}
                onClick={handleMarkAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={styles.notificationsList}>
            {notifications.length === 0 ? (
              <div style={styles.empty}>
                <p style={styles.emptyIcon}>🔕</p>
                <p style={styles.emptyText}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  style={{
                    ...styles.notificationItem,
                    background: notification.isRead ? '#fff' : '#f0f9ff'
                  }}
                  onClick={() => handleMarkRead(notification._id)}
                >
                  <div style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={styles.notificationContent}>
                    <p style={styles.notificationTitle}>
                      {notification.title}
                      {!notification.isRead && <span style={styles.unreadDot} />}
                    </p>
                    <p style={styles.notificationMessage}>
                      {notification.message}
                    </p>
                    <p style={styles.notificationTime}>
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={(e) => handleDelete(notification._id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div style={styles.dropdownFooter}>
              <button
                style={styles.clearAllBtn}
                onClick={async () => {
                  try {
                    await Promise.all(
                      notifications.map(n => API.delete(`/notifications/${n._id}`))
                    )
                    setNotifications([])
                  } catch (err) {}
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { position: 'relative' },
  bellBtn: {
    background: 'rgba(255,255,255,0.1)', border: 'none',
    color: '#fff', fontSize: '18px', cursor: 'pointer',
    padding: '8px 12px', borderRadius: '8px',
    position: 'relative', display: 'flex', alignItems: 'center'
  },
  badge: {
    position: 'absolute', top: '-4px', right: '-4px',
    background: '#e74c3c', color: '#fff', fontSize: '10px',
    fontWeight: '800', width: '18px', height: '18px',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '2px solid #1a1a2e'
  },
  dropdown: {
    position: 'absolute', right: 0, top: '48px',
    width: '340px', background: '#fff', borderRadius: '16px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
    border: '1px solid #eee', zIndex: 1000, overflow: 'hidden'
  },
  dropdownHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
    background: '#1a1a2e'
  },
  dropdownTitle: {
    color: '#f6c90e', margin: 0, fontSize: '15px', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  unreadBadge: {
    background: '#e74c3c', color: '#fff', fontSize: '10px',
    padding: '2px 8px', borderRadius: '20px', fontWeight: '700'
  },
  markAllBtn: {
    background: 'rgba(246,201,14,0.2)', color: '#f6c90e',
    border: '1px solid rgba(246,201,14,0.3)', padding: '4px 10px',
    borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer'
  },
  notificationsList: { maxHeight: '360px', overflowY: 'auto' },
  empty: { textAlign: 'center', padding: '32px 20px' },
  emptyIcon: { fontSize: '36px', margin: '0 0 8px' },
  emptyText: { color: '#999', fontSize: '14px', margin: 0 },
  notificationItem: {
    display: 'flex', alignItems: 'flex-start', gap: '12px',
    padding: '14px 16px', borderBottom: '1px solid #f5f5f5',
    cursor: 'pointer', transition: 'background 0.2s'
  },
  notificationIcon: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#f0f0f0', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '16px', flexShrink: 0
  },
  notificationContent: { flex: 1 },
  notificationTitle: {
    fontSize: '13px', fontWeight: '700', color: '#1a1a2e',
    margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '6px'
  },
  unreadDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#e74c3c', display: 'inline-block', flexShrink: 0
  },
  notificationMessage: {
    fontSize: '12px', color: '#666', margin: '0 0 4px', lineHeight: '1.4'
  },
  notificationTime: { fontSize: '11px', color: '#aaa', margin: 0 },
  deleteBtn: {
    background: 'none', border: 'none', color: '#ccc',
    cursor: 'pointer', fontSize: '12px', padding: '2px 4px',
    flexShrink: 0
  },
  dropdownFooter: {
    padding: '10px 16px', borderTop: '1px solid #f0f0f0',
    textAlign: 'center'
  },
  clearAllBtn: {
    background: 'none', border: 'none', color: '#e74c3c',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer'
  }
}

export default NotificationBell