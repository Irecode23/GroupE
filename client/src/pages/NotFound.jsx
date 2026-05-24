import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* SVG Illustration */}
        <svg viewBox="0 0 400 200" style={styles.svg} xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="160" width="400" height="40" fill="#2d2d4e" rx="4"/>
          <rect x="40" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
          <rect x="120" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
          <rect x="200" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
          <rect x="280" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
          <rect x="110" y="110" width="140" height="55" fill="#f6c90e" rx="8"/>
          <rect x="130" y="88" width="100" height="35" fill="#f6c90e" rx="8"/>
          <rect x="138" y="94" width="36" height="22" fill="#1a1a2e" rx="3" opacity="0.8"/>
          <rect x="180" y="94" width="36" height="22" fill="#1a1a2e" rx="3" opacity="0.8"/>
          <circle cx="140" cy="165" r="16" fill="#1a1a2e"/>
          <circle cx="140" cy="165" r="9" fill="#444"/>
          <circle cx="140" cy="165" r="4" fill="#f6c90e"/>
          <circle cx="230" cy="165" r="16" fill="#1a1a2e"/>
          <circle cx="230" cy="165" r="9" fill="#444"/>
          <circle cx="230" cy="165" r="4" fill="#f6c90e"/>
          <rect x="103" y="120" width="10" height="8" fill="#e74c3c" rx="2"/>
          <rect x="247" y="120" width="10" height="8" fill="#fff" rx="2"/>
          <text x="148" y="108" fontSize="11" fill="#1a1a2e" fontWeight="bold">404</text>
          {/* Lost person */}
          <circle cx="50" cy="110" r="12" fill="#f39c12"/>
          <rect x="42" y="122" width="16" height="24" fill="#3498db" rx="4"/>
          <rect x="42" y="142" width="6" height="18" fill="#1a1a2e" rx="3"/>
          <rect x="52" y="142" width="6" height="18" fill="#1a1a2e" rx="3"/>
          <line x1="42" y1="128" x2="30" y2="120" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
          <line x1="58" y1="128" x2="70" y2="120" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
          {/* Question marks */}
          <text x="25" y="90" fontSize="18" fill="#f6c90e" opacity="0.8">?</text>
          <text x="65" y="80" fontSize="14" fill="#f6c90e" opacity="0.6">?</text>
          <text x="15" y="105" fontSize="12" fill="#f6c90e" opacity="0.5">?</text>
          {/* Road sign */}
          <rect x="320" y="80" width="60" height="36" fill="#e74c3c" rx="6"/>
          <rect x="348" y="116" width="4" height="44" fill="#795548"/>
          <text x="328" y="103" fontSize="10" fill="#fff" fontWeight="bold">LOST?</text>
          {/* Trees */}
          <rect x="360" y="120" width="6" height="40" fill="#795548"/>
          <circle cx="363" cy="112" r="16" fill="#2ecc71"/>
          <rect x="290" y="128" width="5" height="32" fill="#795548"/>
          <circle cx="293" cy="120" r="12" fill="#27ae60"/>
        </svg>

        <div style={styles.code}>404</div>
        <h2 style={styles.title}>Oops! Page Not Found</h2>
        <p style={styles.text}>
          Looks like this page took a wrong turn. Let's get you back on track!
        </p>

        <div style={styles.buttons}>
          <Link to="/" style={styles.primaryBtn}>
            🏠 Go Home
          </Link>
          <Link to="/login" style={styles.secondaryBtn}>
            🚗 Login
          </Link>
        </div>

        <div style={styles.links}>
          <Link to="/rider/dashboard" style={styles.quickLink}>Rider Dashboard</Link>
          <span style={styles.dot}>•</span>
          <Link to="/driver/dashboard" style={styles.quickLink}>Driver Dashboard</Link>
        </div>
      </div>
    </div>
  )
}
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'sans-serif', padding: '20px'
  },
  content: { textAlign: 'center', maxWidth: '500px' },
  svg: { width: '100%', maxWidth: '400px', marginBottom: '24px' },
  code: {
    fontSize: '96px', fontWeight: '900', color: '#f6c90e',
    margin: '0 0 8px', lineHeight: '1',
    textShadow: '0 4px 20px rgba(246,201,14,0.4)'
  },
  title: {
    fontSize: '28px', fontWeight: '800', color: '#fff',
    margin: '0 0 16px'
  },
  text: {
    fontSize: '16px', color: '#aaa', margin: '0 0 32px', lineHeight: '1.6'
  },
  buttons: { display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '14px 32px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '800', fontSize: '15px',
    boxShadow: '0 4px 15px rgba(246,201,14,0.4)'
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.1)', color: '#fff',
    padding: '14px 32px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '700', fontSize: '15px',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  links: { display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' },
  quickLink: { color: '#aaa', textDecoration: 'none', fontSize: '13px' },
  dot: { color: '#555', fontSize: '13px' }
}

export default NotFound