import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'

function AdminLayout({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login')
    }
  }, [user])

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.main}>
        {children}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  main: {
    marginLeft: '250px',
    flex: 1,
    padding: '32px',
    minHeight: '100vh'
  }
}

export default AdminLayout