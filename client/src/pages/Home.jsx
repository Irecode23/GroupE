import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { user } = useAuth()

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h1 style={styles.logo}>🚗 RideShare</h1>
        <div style={styles.navLinks}>
          {user ? (
            <Link
              to={user.role === 'driver' ? '/driver/dashboard' : '/rider/dashboard'}
              style={styles.navBtnPrimary}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={styles.navBtn}>Login</Link>
              <Link to="/register" style={styles.navBtnPrimary}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>🚀 Nigeria's Fastest Ride App</div>
          <h2 style={styles.heroTitle}>Your Ride,<br />Your Way</h2>
          <p style={styles.heroSubtitle}>
            Fast, safe and affordable rides across Lagos.
            Book a ride in seconds or earn money as a driver.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/register" style={styles.primaryBtn}>
              🚕 Book a Ride
            </Link>
            <Link to="/register" style={styles.secondaryBtn}>
              🚘 Become a Driver
            </Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.heroStat}>
              <p style={styles.heroStatNumber}>500+</p>
              <p style={styles.heroStatLabel}>Active Drivers</p>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <p style={styles.heroStatNumber}>10k+</p>
              <p style={styles.heroStatLabel}>Happy Riders</p>
            </div>
            <div style={styles.heroStatDivider} />
            <div style={styles.heroStat}>
              <p style={styles.heroStatNumber}>4.8⭐</p>
              <p style={styles.heroStatLabel}>Average Rating</p>
            </div>
          </div>
        </div>

        <div style={styles.heroImage}>
          {/* Booking Card */}
          <div style={styles.heroCard}>
            <div style={styles.heroCardHeader}>
              <span style={styles.heroCardIcon}>📍</span>
              <div>
                <p style={styles.heroCardTitle}>Your Location</p>
                <p style={styles.heroCardSub}>Lagos, Nigeria</p>
              </div>
            </div>
            <div style={styles.heroCardDivider} />
            <div style={styles.heroCardHeader}>
              <span style={styles.heroCardIcon}>🏁</span>
              <div>
                <p style={styles.heroCardTitle}>Destination</p>
                <p style={styles.heroCardSub}>Murtala Airport</p>
              </div>
            </div>
            <div style={styles.heroCardBtn}>Find Driver →</div>
            <div style={styles.heroCardDrivers}>
              <div style={styles.driverDot}>A</div>
              <div style={styles.driverDot}>B</div>
              <div style={styles.driverDot}>C</div>
              <p style={styles.driverDotText}>3 drivers nearby</p>
            </div>
          </div>

          {/* SVG Illustration */}
          <svg
            viewBox="0 0 400 200"
            style={styles.heroSvg}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Road */}
            <rect x="0" y="160" width="400" height="40" fill="#2d2d2d" rx="4"/>
            <rect x="0" y="178" width="400" height="4" fill="#444"/>
            <rect x="40" y="176" width="40" height="6" fill="#f6c90e" rx="2"/>
            <rect x="120" y="176" width="40" height="6" fill="#f6c90e" rx="2"/>
            <rect x="200" y="176" width="40" height="6" fill="#f6c90e" rx="2"/>
            <rect x="280" y="176" width="40" height="6" fill="#f6c90e" rx="2"/>
            <rect x="360" y="176" width="40" height="6" fill="#f6c90e" rx="2"/>

            {/* Car Body */}
            <rect x="80" y="120" width="180" height="50" fill="#f6c90e" rx="8"/>
            {/* Car Roof */}
            <rect x="110" y="90" width="120" height="40" fill="#f6c90e" rx="10"/>
            {/* Windows */}
            <rect x="118" y="96" width="45" height="28" fill="#1a1a2e" rx="4" opacity="0.8"/>
            <rect x="170" y="96" width="45" height="28" fill="#1a1a2e" rx="4" opacity="0.8"/>
            {/* Wheels */}
            <circle cx="120" cy="170" r="18" fill="#1a1a2e"/>
            <circle cx="120" cy="170" r="10" fill="#444"/>
            <circle cx="120" cy="170" r="4" fill="#f6c90e"/>
            <circle cx="220" cy="170" r="18" fill="#1a1a2e"/>
            <circle cx="220" cy="170" r="10" fill="#444"/>
            <circle cx="220" cy="170" r="4" fill="#f6c90e"/>
            {/* Headlights */}
            <rect x="255" y="130" width="12" height="8" fill="#fff" rx="2" opacity="0.9"/>
            <rect x="255" y="148" width="12" height="8" fill="#fff" rx="2" opacity="0.6"/>
            {/* Tail lights */}
            <rect x="73" y="130" width="10" height="8" fill="#e74c3c" rx="2"/>
            <rect x="73" y="148" width="10" height="8" fill="#e74c3c" rx="2"/>

            {/* Driver in car */}
            <circle cx="175" cy="108" r="10" fill="#f39c12"/>
            <rect x="168" y="118" width="14" height="10" fill="#3498db" rx="2"/>

            {/* Rider waiting on left */}
            <circle cx="30" cy="100" r="12" fill="#f39c12"/>
            <rect x="22" y="112" width="16" height="24" fill="#e74c3c" rx="4"/>
            {/* Legs */}
            <rect x="22" y="132" width="6" height="20" fill="#1a1a2e" rx="3"/>
            <rect x="32" y="132" width="6" height="20" fill="#1a1a2e" rx="3"/>
            {/* Arms waving */}
            <line x1="22" y1="118" x2="8" y2="108" stroke="#f39c12" strokeWidth="4" strokeLinecap="round"/>
            <line x1="38" y1="118" x2="52" y2="128" stroke="#f39c12" strokeWidth="4" strokeLinecap="round"/>
            {/* Bag */}
            <rect x="52" y="125" width="12" height="16" fill="#9b59b6" rx="3"/>

            {/* Location pin above rider */}
            <circle cx="30" cy="60" r="10" fill="#e74c3c"/>
            <circle cx="30" cy="60" r="5" fill="#fff"/>
            <line x1="30" y1="70" x2="30" y2="80" stroke="#e74c3c" strokeWidth="2"/>

            {/* Speech bubble */}
            <rect x="45" y="55" width="80" height="28" fill="#fff" rx="8"/>
            <polygon points="45,72 38,80 52,72" fill="#fff"/>
            <text x="53" y="65" fontSize="8" fill="#1a1a2e" fontWeight="bold">Waiting for</text>
            <text x="53" y="76" fontSize="8" fill="#1a1a2e" fontWeight="bold">a driver...</text>

            {/* Stars above car */}
            <text x="140" y="80" fontSize="14" fill="#f6c90e">⭐⭐⭐⭐⭐</text>

            {/* Signal waves from car */}
            <path d="M 270 110 Q 285 100 300 110" stroke="#2ecc71" strokeWidth="2" fill="none" opacity="0.8"/>
            <path d="M 275 100 Q 295 85 315 100" stroke="#2ecc71" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M 280 90 Q 305 70 330 90" stroke="#2ecc71" strokeWidth="2" fill="none" opacity="0.4"/>

            {/* Trees */}
            <rect x="355" y="120" width="8" height="40" fill="#795548"/>
            <circle cx="359" cy="110" r="18" fill="#2ecc71"/>
            <circle cx="349" cy="118" r="12" fill="#27ae60"/>
            <rect x="320" y="130" width="6" height="30" fill="#795548"/>
            <circle cx="323" cy="122" r="14" fill="#2ecc71"/>
          </svg>
        </div>
      </div>

      {/* How it works */}
      <div style={styles.howItWorks}>
        <h3 style={styles.sectionTitle}>How It Works</h3>
        <p style={styles.sectionSubtitle}>Get a ride in 3 simple steps</p>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>📱</div>
            <h4 style={styles.stepTitle}>Book a Ride</h4>
            <p style={styles.stepText}>Enter your pickup and dropoff location</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>🚘</div>
            <h4 style={styles.stepTitle}>Pick Your Driver</h4>
            <p style={styles.stepText}>Choose from available drivers with ratings</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🏁</div>
            <h4 style={styles.stepTitle}>Arrive Safely</h4>
            <p style={styles.stepText}>Confirm your ride and rate your driver</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <h3 style={styles.sectionTitle}>Why Choose RideShare?</h3>
        <p style={styles.sectionSubtitle}>Everything you need for a great ride</p>
        <div style={styles.featureCards}>
          {[
            { icon: '⚡', title: 'Fast Pickup', text: 'Get picked up in minutes anywhere in Lagos', color: '#f6c90e' },
            { icon: '🔒', title: 'Safe Rides', text: 'All drivers are verified and rated by riders', color: '#2ecc71' },
            { icon: '💰', title: 'Affordable', text: 'Best prices with no hidden charges', color: '#3498db' },
            { icon: '⭐', title: 'Top Rated', text: 'Rate your driver after every ride', color: '#9b59b6' },
            { icon: '📱', title: 'Easy to Use', text: 'Simple and intuitive interface', color: '#e74c3c' },
            { icon: '🛡️', title: 'Verified Drivers', text: 'Admin verified drivers for your safety', color: '#1abc9c' },
          ].map((feature) => (
            <div key={feature.title} style={styles.featureCard}>
              <div style={{ ...styles.featureIconBox, background: feature.color + '20', color: feature.color }}>
                {feature.icon}
              </div>
              <h4 style={styles.featureTitle}>{feature.title}</h4>
              <p style={styles.featureText}>{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={styles.cta}>
        <div style={styles.ctaContent}>
          <h3 style={styles.ctaTitle}>Ready to Ride?</h3>
          <p style={styles.ctaText}>Join thousands of happy riders and drivers today</p>
          <div style={styles.ctaButtons}>
            <Link to="/register" style={styles.ctaPrimaryBtn}>
              Create Account
            </Link>
            <Link to="/login" style={styles.ctaSecondaryBtn}>
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h4 style={styles.footerLogo}>🚗 RideShare</h4>
            <p style={styles.footerText}>Fast, safe and affordable rides</p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/login" style={styles.footerLink}>Login</Link>
            <Link to="/register" style={styles.footerLink}>Register</Link>
            <Link to="/admin/login" style={styles.footerLink}>Admin</Link>
          </div>
        </div>
        <p style={styles.footerBottom}>© 2026 RideShare. All rights reserved.</p>
      </footer>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', fontFamily: 'sans-serif', background: '#fff' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 60px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100
  },
  logo: { color: '#f6c90e', margin: 0, fontSize: '24px', fontWeight: '800' },
  navLinks: { display: 'flex', gap: '12px', alignItems: 'center' },
  navBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 20px',
    borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    background: 'rgba(255,255,255,0.1)'
  },
  navBtnPrimary: {
    color: '#1a1a2e', textDecoration: 'none', padding: '8px 20px',
    borderRadius: '8px', fontSize: '14px', background: '#f6c90e', fontWeight: '700',
    boxShadow: '0 4px 12px rgba(246,201,14,0.4)'
  },
  hero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '80px 60px', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
    minHeight: '90vh', gap: '60px', flexWrap: 'wrap'
  },
  heroContent: { flex: 1, minWidth: '300px' },
  heroBadge: {
    display: 'inline-block', background: 'rgba(246,201,14,0.15)',
    color: '#f6c90e', padding: '8px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '700', marginBottom: '24px',
    border: '1px solid rgba(246,201,14,0.3)'
  },
  heroTitle: {
    fontSize: '64px', fontWeight: '900', color: '#fff',
    margin: '0 0 24px', lineHeight: '1.1'
  },
  heroSubtitle: {
    fontSize: '18px', color: '#aaa', maxWidth: '480px',
    margin: '0 0 40px', lineHeight: '1.7'
  },
  heroButtons: { display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '16px 36px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '800', fontSize: '16px',
    boxShadow: '0 8px 24px rgba(246,201,14,0.4)'
  },
  secondaryBtn: {
    background: 'transparent', color: '#f6c90e', padding: '16px 36px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: '700',
    fontSize: '16px', border: '2px solid #f6c90e'
  },
  heroStats: { display: 'flex', gap: '32px', alignItems: 'center' },
  heroStat: { textAlign: 'center' },
  heroStatNumber: { fontSize: '28px', fontWeight: '800', color: '#f6c90e', margin: '0 0 4px' },
  heroStatLabel: { fontSize: '12px', color: '#aaa', margin: 0 },
  heroStatDivider: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' },
  heroImage: {
    flex: 1, minWidth: '280px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '24px'
  },
  heroCard: {
    background: '#fff', padding: '28px', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)', width: '100%', maxWidth: '320px'
  },
  heroCardHeader: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  heroCardIcon: { fontSize: '28px' },
  heroCardTitle: { fontSize: '12px', color: '#999', margin: '0 0 2px', fontWeight: '600' },
  heroCardSub: { fontSize: '16px', color: '#1a1a2e', fontWeight: '700', margin: 0 },
  heroCardDivider: { height: '1px', background: '#f0f0f0', margin: '16px 0' },
  heroCardBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '14px', borderRadius: '10px',
    textAlign: 'center', fontWeight: '800', fontSize: '15px',
    cursor: 'pointer', marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(246,201,14,0.3)'
  },
  heroCardDrivers: { display: 'flex', alignItems: 'center', gap: '8px' },
  driverDot: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '12px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginLeft: '-8px', border: '2px solid #fff'
  },
  driverDotText: { fontSize: '12px', color: '#666', margin: 0, marginLeft: '4px' },
  heroSvg: {
    width: '100%', maxWidth: '420px',
    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
  },
  howItWorks: { padding: '80px 60px', background: '#f8f9fa', textAlign: 'center' },
  sectionTitle: { fontSize: '36px', fontWeight: '800', color: '#1a1a2e', margin: '0 0 12px' },
  sectionSubtitle: { fontSize: '16px', color: '#666', margin: '0 0 48px' },
  steps: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '16px', flexWrap: 'wrap'
  },
  step: {
    background: '#fff', padding: '32px 24px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '200px',
    textAlign: 'center', position: 'relative'
  },
  stepNumber: {
    position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
    width: '32px', height: '32px', background: '#f6c90e', color: '#1a1a2e',
    borderRadius: '50%', fontSize: '14px', fontWeight: '800',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  stepIcon: { fontSize: '40px', marginBottom: '16px', marginTop: '8px' },
  stepTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  stepText: { fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' },
  stepArrow: { fontSize: '24px', color: '#f6c90e', fontWeight: '700' },
  features: { padding: '80px 60px', textAlign: 'center' },
  featureCards: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px', marginTop: '48px'
  },
  featureCard: {
    background: '#fff', padding: '32px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'left',
    border: '1px solid #f0f0f0'
  },
  featureIconBox: {
    width: '56px', height: '56px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', marginBottom: '16px'
  },
  featureTitle: { fontSize: '18px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  featureText: { fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.6' },
  cta: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    padding: '80px 60px', textAlign: 'center'
  },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontSize: '40px', fontWeight: '800', color: '#fff', margin: '0 0 16px' },
  ctaText: { fontSize: '18px', color: '#aaa', margin: '0 0 40px' },
  ctaButtons: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimaryBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '16px 40px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '800', fontSize: '16px',
    boxShadow: '0 8px 24px rgba(246,201,14,0.4)'
  },
  ctaSecondaryBtn: {
    background: 'transparent', color: '#fff', padding: '16px 40px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: '700',
    fontSize: '16px', border: '2px solid rgba(255,255,255,0.3)'
  },
  footer: { background: '#111', padding: '40px 60px 20px' },
  footerContent: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'
  },
  footerLogo: { color: '#f6c90e', margin: '0 0 8px', fontSize: '20px' },
  footerText: { color: '#666', margin: 0, fontSize: '14px' },
  footerLinks: { display: 'flex', gap: '24px' },
  footerLink: { color: '#666', textDecoration: 'none', fontSize: '14px' },
  footerBottom: { color: '#444', fontSize: '13px', textAlign: 'center', margin: 0 }
}

export default Home