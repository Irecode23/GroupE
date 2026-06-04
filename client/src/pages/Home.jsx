import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useWindowSize from '../hooks/useWindowSize'

function Home() {
  const { user } = useAuth()
  const { width } = useWindowSize()
  const isMobile = width < 768
  const isTablet = width < 1024

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
      <div style={{
        ...styles.hero,
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '40px 20px' : '80px 60px',
        minHeight: isMobile ? 'auto' : '90vh'
      }}>
        <div style={{ ...styles.heroContent, minWidth: isMobile ? '100%' : '300px' }}>
          <div style={styles.heroBadge}>🚀 Nigeria's Fastest Ride App</div>
          <h2 style={{
            ...styles.heroTitle,
            fontSize: isMobile ? '40px' : '64px'
          }}>
            Your Ride,<br />Your Way
          </h2>
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
          <div style={{
            ...styles.heroStats,
            gap: isMobile ? '16px' : '32px'
          }}>
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

        {!isMobile && (
          <div style={styles.heroImage}>
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

            <svg viewBox="0 0 400 200" style={styles.heroSvg} xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="160" width="400" height="40" fill="#2d2d4e" rx="4"/>
              <rect x="40" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
              <rect x="120" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
              <rect x="200" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
              <rect x="280" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
              <rect x="360" y="168" width="30" height="5" fill="#f6c90e" rx="2"/>
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
              <circle cx="50" cy="110" r="12" fill="#f39c12"/>
              <rect x="42" y="122" width="16" height="24" fill="#e74c3c" rx="4"/>
              <rect x="42" y="142" width="6" height="18" fill="#1a1a2e" rx="3"/>
              <rect x="52" y="142" width="6" height="18" fill="#1a1a2e" rx="3"/>
              <line x1="42" y1="128" x2="30" y2="120" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
              <line x1="58" y1="128" x2="70" y2="120" stroke="#f39c12" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="50" cy="80" r="8" fill="#e74c3c"/>
              <circle cx="50" cy="80" r="4" fill="#fff"/>
              <line x1="50" y1="88" x2="50" y2="97" stroke="#e74c3c" strokeWidth="2"/>
              <rect x="63" y="65" width="70" height="24" fill="#fff" rx="6" opacity="0.95"/>
              <polygon points="63,82 56,88 70,82" fill="#fff" opacity="0.95"/>
              <text x="70" y="76" fontSize="7" fill="#1a1a2e" fontWeight="bold">Waiting for</text>
              <text x="70" y="85" fontSize="7" fill="#1a1a2e" fontWeight="bold">driver... 🚕</text>
              <text x="140" y="78" fontSize="12" fill="#f6c90e">⭐⭐⭐⭐⭐</text>
              <path d="M 260 100 Q 272 92 284 100" stroke="#2ecc71" strokeWidth="2" fill="none"/>
              <path d="M 264 92 Q 280 80 296 92" stroke="#2ecc71" strokeWidth="1.5" fill="none" opacity="0.7"/>
              <rect x="355" y="120" width="6" height="40" fill="#795548"/>
              <circle cx="358" cy="112" r="16" fill="#2ecc71"/>
              <circle cx="350" cy="118" r="10" fill="#27ae60"/>
              <rect x="320" y="128" width="5" height="32" fill="#795548"/>
              <circle cx="323" cy="120" r="12" fill="#2ecc71"/>
            </svg>
          </div>
        )}
      </div>

      {/* How it works */}
      <div style={{
        ...styles.howItWorks,
        padding: isMobile ? '48px 20px' : '80px 60px'
      }}>
        <h3 style={{
          ...styles.sectionTitle,
          fontSize: isMobile ? '28px' : '36px'
        }}>How It Works</h3>
        <p style={styles.sectionSubtitle}>Get a ride in 3 simple steps</p>
        <div style={{
          ...styles.steps,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'center' : 'center'
        }}>
          <div style={styles.step}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>📱</div>
            <h4 style={styles.stepTitle}>Book a Ride</h4>
            <p style={styles.stepText}>Enter your pickup and dropoff location</p>
          </div>
          <div style={{ ...styles.stepArrow, transform: isMobile ? 'rotate(90deg)' : 'none' }}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>🚘</div>
            <h4 style={styles.stepTitle}>Pick Your Driver</h4>
            <p style={styles.stepText}>Choose from available drivers with ratings</p>
          </div>
          <div style={{ ...styles.stepArrow, transform: isMobile ? 'rotate(90deg)' : 'none' }}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🏁</div>
            <h4 style={styles.stepTitle}>Arrive Safely</h4>
            <p style={styles.stepText}>Confirm your ride and rate your driver</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{
        ...styles.features,
        padding: isMobile ? '48px 20px' : '80px 60px'
      }}>
        <h3 style={{
          ...styles.sectionTitle,
          fontSize: isMobile ? '28px' : '36px'
        }}>Why Choose RideShare?</h3>
        <p style={styles.sectionSubtitle}>Everything you need for a great ride</p>
        <div style={{
          ...styles.featureCards,
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
        }}>
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
      <div style={{
        ...styles.cta,
        padding: isMobile ? '48px 20px' : '80px 60px'
      }}>
        <div style={styles.ctaContent}>
          <h3 style={{
            ...styles.ctaTitle,
            fontSize: isMobile ? '28px' : '40px'
          }}>Ready to Ride?</h3>
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
      <footer style={{
        ...styles.footer,
        padding: isMobile ? '32px 20px 16px' : '40px 60px 20px'
      }}>
        <div style={{
          ...styles.footerContent,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left',
          gap: '20px'
        }}>
          <div>
            <h4 style={styles.footerLogo}>🚗 RideShare</h4>
            <p style={styles.footerText}>Fast, safe and affordable rides</p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/login" style={styles.footerLink}>Login</Link>
            <Link to="/register" style={styles.footerLink}>Register</Link>
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
    padding: '16px 24px', background: '#1a1a2e',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100
  },
  logo: { color: '#f6c90e', margin: 0, fontSize: '22px', fontWeight: '800' },
  navLinks: { display: 'flex', gap: '8px', alignItems: 'center' },
  navBtn: {
    color: '#fff', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    background: 'rgba(255,255,255,0.1)'
  },
  navBtnPrimary: {
    color: '#1a1a2e', textDecoration: 'none', padding: '8px 16px',
    borderRadius: '8px', fontSize: '14px', background: '#f6c90e', fontWeight: '700',
    boxShadow: '0 4px 12px rgba(246,201,14,0.4)'
  },
  hero: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)',
    gap: '40px', flexWrap: 'wrap'
  },
  heroContent: { flex: 1 },
  heroBadge: {
    display: 'inline-block', background: 'rgba(246,201,14,0.15)',
    color: '#f6c90e', padding: '8px 16px', borderRadius: '20px',
    fontSize: '13px', fontWeight: '700', marginBottom: '20px',
    border: '1px solid rgba(246,201,14,0.3)'
  },
  heroTitle: {
    fontWeight: '900', color: '#fff',
    margin: '0 0 20px', lineHeight: '1.1'
  },
  heroSubtitle: {
    fontSize: '16px', color: '#aaa', maxWidth: '480px',
    margin: '0 0 32px', lineHeight: '1.7'
  },
  heroButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '14px 28px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '800', fontSize: '15px',
    boxShadow: '0 8px 24px rgba(246,201,14,0.4)'
  },
  secondaryBtn: {
    background: 'transparent', color: '#f6c90e', padding: '14px 28px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: '700',
    fontSize: '15px', border: '2px solid #f6c90e'
  },
  heroStats: { display: 'flex', alignItems: 'center' },
  heroStat: { textAlign: 'center' },
  heroStatNumber: { fontSize: '24px', fontWeight: '800', color: '#f6c90e', margin: '0 0 4px' },
  heroStatLabel: { fontSize: '11px', color: '#aaa', margin: 0 },
  heroStatDivider: { width: '1px', height: '36px', background: 'rgba(255,255,255,0.2)' },
  heroImage: {
    flex: 1, minWidth: '280px', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '20px'
  },
  heroCard: {
    background: '#fff', padding: '24px', borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)', width: '100%', maxWidth: '300px'
  },
  heroCardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  heroCardIcon: { fontSize: '24px' },
  heroCardTitle: { fontSize: '11px', color: '#999', margin: '0 0 2px', fontWeight: '600' },
  heroCardSub: { fontSize: '15px', color: '#1a1a2e', fontWeight: '700', margin: 0 },
  heroCardDivider: { height: '1px', background: '#f0f0f0', margin: '12px 0' },
  heroCardBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '12px', borderRadius: '10px',
    textAlign: 'center', fontWeight: '800', fontSize: '14px',
    cursor: 'pointer', marginBottom: '12px'
  },
  heroCardDrivers: { display: 'flex', alignItems: 'center', gap: '6px' },
  driverDot: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#1a1a2e', color: '#f6c90e', fontSize: '11px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginLeft: '-6px', border: '2px solid #fff'
  },
  driverDotText: { fontSize: '11px', color: '#666', margin: 0, marginLeft: '4px' },
  heroSvg: { width: '100%', maxWidth: '380px' },
  howItWorks: { background: '#f8f9fa', textAlign: 'center' },
  sectionTitle: { fontWeight: '800', color: '#1a1a2e', margin: '0 0 12px' },
  sectionSubtitle: { fontSize: '15px', color: '#666', margin: '0 0 40px' },
  steps: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '16px', flexWrap: 'wrap'
  },
  step: {
    background: '#fff', padding: '28px 20px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '200px',
    textAlign: 'center', position: 'relative'
  },
  stepNumber: {
    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
    width: '28px', height: '28px', background: '#f6c90e', color: '#1a1a2e',
    borderRadius: '50%', fontSize: '13px', fontWeight: '800',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  stepIcon: { fontSize: '36px', marginBottom: '12px', marginTop: '8px' },
  stepTitle: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  stepText: { fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.5' },
  stepArrow: { fontSize: '24px', color: '#f6c90e', fontWeight: '700' },
  features: { textAlign: 'center' },
  featureCards: { display: 'grid', gap: '20px', marginTop: '40px' },
  featureCard: {
    background: '#fff', padding: '28px', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', textAlign: 'left',
    border: '1px solid #f0f0f0'
  },
  featureIconBox: {
    width: '52px', height: '52px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '14px'
  },
  featureTitle: { fontSize: '17px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 8px' },
  featureText: { fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.6' },
  cta: {
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    textAlign: 'center'
  },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontWeight: '800', color: '#fff', margin: '0 0 16px' },
  ctaText: { fontSize: '16px', color: '#aaa', margin: '0 0 36px' },
  ctaButtons: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
  ctaPrimaryBtn: {
    background: 'linear-gradient(135deg, #f6c90e, #f39c12)',
    color: '#1a1a2e', padding: '14px 36px', borderRadius: '12px',
    textDecoration: 'none', fontWeight: '800', fontSize: '15px',
    boxShadow: '0 8px 24px rgba(246,201,14,0.4)'
  },
  ctaSecondaryBtn: {
    background: 'transparent', color: '#fff', padding: '14px 36px',
    borderRadius: '12px', textDecoration: 'none', fontWeight: '700',
    fontSize: '15px', border: '2px solid rgba(255,255,255,0.3)'
  },
  footer: { background: '#111' },
  footerContent: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap'
  },
  footerLogo: { color: '#f6c90e', margin: '0 0 8px', fontSize: '20px' },
  footerText: { color: '#666', margin: 0, fontSize: '14px' },
  footerLinks: { display: 'flex', gap: '20px' },
  footerLink: { color: '#666', textDecoration: 'none', fontSize: '14px' },
  footerBottom: { color: '#444', fontSize: '13px', textAlign: 'center', margin: 0 }
}

export default Home