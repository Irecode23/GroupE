import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'

function RateDriver() {
  const { rideId, driverId } = useParams()
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    setLoading(true)
    setError('')
    try {
      await API.post('/ratings', {
        ride: rideId,
        ratedUser: driverId,
        rating,
        review
      })

      // Mark ride as rated
      navigate('/rider/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating')
    }
    setLoading(false)
  }

  const quickReviews = [
    'Great driver!',
    'Very professional',
    'Safe driving',
    'On time',
    'Friendly',
    'Clean vehicle'
  ]

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Rate Your Driver</h2>
          <p style={styles.subtitle}>How was your experience?</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Star Rating */}
        <div style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                ...styles.star,
                color: star <= (hoveredRating || rating) ? '#f6c90e' : '#ddd'
              }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              ★
            </span>
          ))}
        </div>

        <p style={styles.ratingLabel}>
          {rating === 0 && 'Tap to rate'}
          {rating === 1 && '😞 Poor'}
          {rating === 2 && '😐 Fair'}
          {rating === 3 && '🙂 Good'}
          {rating === 4 && '😊 Very Good'}
          {rating === 5 && '🤩 Excellent!'}
        </p>

        {/* Quick Reviews */}
        <div style={styles.quickReviews}>
          {quickReviews.map((q) => (
            <button
              key={q}
              style={{
                ...styles.quickBtn,
                background: review === q ? '#1a1a2e' : '#f5f5f5',
                color: review === q ? '#f6c90e' : '#333'
              }}
              onClick={() => setReview(review === q ? '' : q)}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Review Text */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Write a review (optional)</label>
          <textarea
            style={styles.textarea}
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
          />
        </div>

        <button
          style={{
            ...styles.submitBtn,
            opacity: rating === 0 ? 0.6 : 1
          }}
          onClick={handleSubmit}
          disabled={loading || rating === 0}
        >
          {loading ? 'Submitting...' : 'Submit Rating'}
        </button>

        <button
          style={styles.skipBtn}
          onClick={() => navigate('/rider/dashboard')}
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', background: '#f0f2f5',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '20px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
    width: '100%', maxWidth: '480px'
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 8px' },
  subtitle: { color: '#666', margin: 0, fontSize: '16px' },
  error: {
    background: '#ffe0e0', color: '#d00', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
  },
  starsContainer: {
    display: 'flex', justifyContent: 'center', gap: '8px',
    marginBottom: '16px'
  },
  star: {
    fontSize: '56px', cursor: 'pointer',
    transition: 'transform 0.1s',
    userSelect: 'none'
  },
  ratingLabel: {
    textAlign: 'center', fontSize: '18px', fontWeight: '600',
    color: '#333', margin: '0 0 24px', minHeight: '28px'
  },
  quickReviews: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
    marginBottom: '24px', justifyContent: 'center'
  },
  quickBtn: {
    padding: '8px 16px', borderRadius: '20px', border: 'none',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    transition: 'all 0.2s'
  },
  inputGroup: { marginBottom: '24px' },
  label: {
    display: 'block', marginBottom: '8px',
    fontSize: '14px', fontWeight: '600', color: '#333'
  },
  textarea: {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box', outline: 'none',
    resize: 'vertical', fontFamily: 'sans-serif'
  },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '700', cursor: 'pointer',
    marginBottom: '12px', boxShadow: '0 4px 15px rgba(246,201,14,0.4)'
  },
  skipBtn: {
    width: '100%', padding: '12px', background: 'transparent',
    color: '#999', border: 'none', borderRadius: '12px',
    fontSize: '14px', cursor: 'pointer'
  }
}

export default RateDriver