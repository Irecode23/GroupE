import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function RideReceipt() {
  const { rideId } = useParams()
  const { user } = useAuth()
  const [ride, setRide] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const receiptRef = useRef()

  useEffect(() => {
    fetchReceiptData()
  }, [])

  const fetchReceiptData = async () => {
    try {
      const { data } = await API.get('/rides/my-rides')
      const found = data.find(r => r._id === rideId)
      setRide(found)

      const paymentsRes = await API.get('/payments/my-payments')
      const foundPayment = paymentsRes.data.find(p => p.ride?._id === rideId || p.ride === rideId)
      setPayment(foundPayment)
    } catch (err) {
      console.error('Failed to load receipt')
    }
    setLoading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return (
    <div style={styles.loadingBox}>
      <div style={styles.spinner} />
      <p>Loading receipt...</p>
    </div>
  )

  if (!ride) return (
    <div style={styles.errorBox}>
      <p>Receipt not found</p>
      <Link to="/my-rides" style={styles.backBtn}>← Back to Rides</Link>
    </div>
  )

  return (
    <div style={styles.page}>
      {/* Print/Download Buttons - hidden when printing */}
      <div style={styles.actions} className="no-print">
        <button style={styles.printBtn} onClick={handlePrint}>
          🖨️ Print Receipt
        </button>
        <Link
          to={user?.role === 'driver' ? '/driver/dashboard' : '/rider/dashboard'}
          style={styles.backLink}
        >
          ← Dashboard
        </Link>
      </div>

      {/* Receipt */}
      <div style={styles.receipt} ref={receiptRef}>
        {/* Header */}
        <div style={styles.receiptHeader}>
          <div style={styles.receiptLogo}>🚗 RideShare</div>
          <p style={styles.receiptTagline}>Fast • Safe • Affordable</p>
          <h2 style={styles.receiptTitle}>RIDE RECEIPT</h2>
          <p style={styles.receiptNo}>
            Receipt #{payment?.transactionRef || `REC${rideId?.slice(-6).toUpperCase()}`}
          </p>
        </div>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>✦</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Ride Info */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>RIDE DETAILS</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Date</span>
            <span style={styles.infoValue}>
              {new Date(ride.createdAt).toLocaleDateString('en-NG', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Time</span>
            <span style={styles.infoValue}>
              {new Date(ride.createdAt).toLocaleTimeString('en-NG', {
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Status</span>
            <span style={{
              ...styles.infoValue,
              color: ride.status === 'completed' ? '#2ecc71' : '#e74c3c',
              fontWeight: '700'
            }}>
              {ride.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={styles.dividerThin} />

        {/* Route */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>ROUTE</h3>
          <div style={styles.routeBox}>
            <div style={styles.routeItem}>
              <div style={styles.routeDot}>🟢</div>
              <div>
                <p style={styles.routeLabel}>PICKUP</p>
                <p style={styles.routeAddress}>{ride.pickupLocation?.address}</p>
              </div>
            </div>
            <div style={styles.routeLine} />
            <div style={styles.routeItem}>
              <div style={styles.routeDot}>🔴</div>
              <div>
                <p style={styles.routeLabel}>DROPOFF</p>
                <p style={styles.routeAddress}>{ride.dropoffLocation?.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.dividerThin} />

        {/* People */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>PEOPLE</h3>
          {ride.rider && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>🙋 Rider</span>
              <span style={styles.infoValue}>{ride.rider?.name || user?.name}</span>
            </div>
          )}
          {ride.driver && (
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>🚘 Driver</span>
              <span style={styles.infoValue}>{ride.driver?.name}</span>
            </div>
          )}
        </div>

        <div style={styles.dividerThin} />

        {/* Payment */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>PAYMENT</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Fare</span>
            <span style={styles.infoValue}>₦{ride.fare?.toLocaleString()}</span>
          </div>
          {payment && (
            <>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Method</span>
                <span style={styles.infoValue}>{payment.paymentMethod?.toUpperCase()}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Transaction Ref</span>
                <span style={styles.infoValue}>{payment.transactionRef}</span>
              </div>
            </>
          )}
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Payment Status</span>
            <span style={{
              ...styles.infoValue,
              color: ride.paymentStatus === 'paid' ? '#2ecc71' : '#e74c3c',
              fontWeight: '700'
            }}>
              {ride.paymentStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Total */}
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>TOTAL AMOUNT</span>
          <span style={styles.totalAmount}>₦{ride.fare?.toLocaleString()}</span>
        </div>

        {/* Footer */}
        <div style={styles.receiptFooter}>
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>✦</span>
            <div style={styles.dividerLine} />
          </div>
          <p style={styles.footerText}>Thank you for riding with RideShare!</p>
          <p style={styles.footerText}>For support: support@rideshare.com</p>
          <p style={styles.footerSmall}>
            © 2026 RideShare Nigeria. All rights reserved.
          </p>
          <div style={styles.barcode}>
            {'|' + (payment?.transactionRef || rideId?.slice(-8))?.split('').join('||') + '|'}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', background: '#f0f2f5',
    fontFamily: 'sans-serif', padding: '24px 20px'
  },
  loadingBox: { textAlign: 'center', padding: '60px' },
  spinner: {
    width: '40px', height: '40px', border: '4px solid #f0f0f0',
    borderTop: '4px solid #f6c90e', borderRadius: '50%',
    margin: '0 auto 16px', animation: 'spin 1s linear infinite'
  },
  errorBox: { textAlign: 'center', padding: '60px' },
  actions: {
    display: 'flex', justifyContent: 'center', gap: '12px',
    marginBottom: '24px', flexWrap: 'wrap'
  },
  printBtn: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    color: '#f6c90e', border: 'none', padding: '12px 28px',
    borderRadius: '10px', fontSize: '14px', fontWeight: '700',
    cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,26,46,0.3)'
  },
  backLink: {
    background: '#fff', color: '#333', border: '1px solid #ddd',
    padding: '12px 28px', borderRadius: '10px', fontSize: '14px',
    fontWeight: '600', textDecoration: 'none'
  },
  backBtn: {
    display: 'inline-block', marginTop: '16px', color: '#f6c90e',
    textDecoration: 'none', fontWeight: '600'
  },
  receipt: {
    background: '#fff', maxWidth: '480px', margin: '0 auto',
    borderRadius: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    overflow: 'hidden'
  },
  receiptHeader: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '32px 24px', textAlign: 'center'
  },
  receiptLogo: { color: '#f6c90e', fontSize: '28px', fontWeight: '900', margin: '0 0 4px' },
  receiptTagline: { color: '#aaa', fontSize: '12px', margin: '0 0 20px', letterSpacing: '2px' },
  receiptTitle: { color: '#fff', fontSize: '20px', fontWeight: '800', margin: '0 0 8px', letterSpacing: '4px' },
  receiptNo: { color: '#f6c90e', fontSize: '13px', margin: 0, fontFamily: 'monospace' },
  divider: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' },
  dividerLine: { flex: 1, height: '1px', background: '#eee' },
  dividerText: { color: '#f6c90e', fontSize: '12px' },
  dividerThin: { height: '1px', background: '#f5f5f5', margin: '0 24px' },
  section: { padding: '16px 24px' },
  sectionTitle: {
    fontSize: '11px', fontWeight: '800', color: '#999',
    letterSpacing: '2px', margin: '0 0 12px'
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: '12px', marginBottom: '10px'
  },
  infoLabel: { fontSize: '13px', color: '#999', fontWeight: '600', minWidth: '120px' },
  infoValue: { fontSize: '13px', color: '#1a1a2e', fontWeight: '600', textAlign: 'right', flex: 1 },
  routeBox: { padding: '4px 0' },
  routeItem: { display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '6px 0' },
  routeDot: { fontSize: '14px', flexShrink: 0, marginTop: '2px' },
  routeLabel: { fontSize: '10px', color: '#aaa', fontWeight: '700', letterSpacing: '1px', margin: '0 0 2px' },
  routeAddress: { fontSize: '13px', color: '#1a1a2e', fontWeight: '600', margin: 0, lineHeight: '1.4' },
  routeLine: {
    width: '2px', height: '20px', background: '#eee',
    marginLeft: '8px', marginBottom: '2px'
  },
  totalBox: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    margin: '0 24px 24px', padding: '16px 20px', borderRadius: '12px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  totalLabel: { color: '#aaa', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' },
  totalAmount: { color: '#f6c90e', fontSize: '28px', fontWeight: '900' },
  receiptFooter: { padding: '0 24px 32px', textAlign: 'center' },
  footerText: { color: '#666', fontSize: '12px', margin: '4px 0' },
  footerSmall: { color: '#aaa', fontSize: '11px', margin: '8px 0' },
  barcode: {
    fontFamily: 'monospace', fontSize: '8px', color: '#ccc',
    letterSpacing: '1px', marginTop: '12px', wordBreak: 'break-all'
  }
}

export default RideReceipt