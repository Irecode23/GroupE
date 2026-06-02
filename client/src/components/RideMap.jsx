import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

function FitBounds({ pickup, dropoff }) {
  const map = useMap()
  useEffect(() => {
    if (pickup && dropoff) {
      const bounds = L.latLngBounds([pickup, dropoff])
      map.fitBounds(bounds, { padding: [60, 60] })
    } else if (pickup) {
      map.setView(pickup, 13)
    } else if (dropoff) {
      map.setView(dropoff, 13)
    }
  }, [pickup, dropoff, map])
  return null
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function RideMap({ pickupAddress, dropoffAddress }) {
  const [pickupCoords, setPickupCoords] = useState(null)
  const [dropoffCoords, setDropoffCoords] = useState(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMapReady(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const geocodeAddress = async (address) => {
    // Try with Nigeria filter first
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Nigeria')}&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch (e) {}

    // Try without Nigeria filter
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch (e) {}

    throw new Error(`Location not found: ${address}`)
  }

  useEffect(() => {
    if (!pickupAddress && !dropoffAddress) return

    const runGeocode = async () => {
      setLoading(true)
      setError('')

      try {
        if (pickupAddress && dropoffAddress) {
          const [pickup, dropoff] = await Promise.all([
            geocodeAddress(pickupAddress),
            geocodeAddress(dropoffAddress)
          ])
          setPickupCoords([pickup.lat, pickup.lng])
          setDropoffCoords([dropoff.lat, dropoff.lng])

          const dist = calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
          setDistance(dist.toFixed(1))
          setDuration(Math.round((dist / 30) * 60))

        } else if (pickupAddress) {
          const pickup = await geocodeAddress(pickupAddress)
          setPickupCoords([pickup.lat, pickup.lng])
          setDropoffCoords(null)
          setDistance(null)
          setDuration(null)

        } else if (dropoffAddress) {
          const dropoff = await geocodeAddress(dropoffAddress)
          setDropoffCoords([dropoff.lat, dropoff.lng])
          setPickupCoords(null)
          setDistance(null)
          setDuration(null)
        }
      } catch (err) {
        setError('Could not find one or more locations. Try adding "Lagos" to your address.')
      }

      setLoading(false)
    }

    // Debounce — wait 1 second after user stops typing
    const timer = setTimeout(runGeocode, 1000)
    return () => clearTimeout(timer)
  }, [pickupAddress, dropoffAddress])

  const defaultCenter = [6.5244, 3.3792]

  if (!mapReady) {
    return (
      <div style={styles.placeholder}>
        <p style={styles.placeholderText}>🗺️ Preparing map...</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>🗺️ Finding locations...</p>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Route Info — only distance and time */}
      {distance && duration && (
        <div style={styles.routeInfo}>
          <div style={styles.routeItem}>
            <span style={styles.routeIcon}>📏</span>
            <div>
              <p style={styles.routeLabel}>Distance</p>
              <p style={styles.routeValue}>{distance} km</p>
            </div>
          </div>
          <div style={styles.routeDivider} />
          <div style={styles.routeItem}>
            <span style={styles.routeIcon}>⏱️</span>
            <div>
              <p style={styles.routeLabel}>Est. Time</p>
              <p style={styles.routeValue}>{duration} mins</p>
            </div>
          </div>
          <div style={styles.routeDivider} />
          <div style={styles.routeItem}>
            <span style={styles.routeIcon}>🚗</span>
            <div>
              <p style={styles.routeLabel}>Traffic</p>
              <p style={styles.routeValue}>Lagos avg</p>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={pickupCoords || dropoffCoords || defaultCenter}
        zoom={12}
        style={{ height: '380px', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>
              <strong>📍 Pickup</strong><br />
              {pickupAddress}
            </Popup>
          </Marker>
        )}

        {dropoffCoords && (
          <Marker position={dropoffCoords} icon={dropoffIcon}>
            <Popup>
              <strong>🏁 Dropoff</strong><br />
              {dropoffAddress}
            </Popup>
          </Marker>
        )}

        <FitBounds pickup={pickupCoords} dropoff={dropoffCoords} />
      </MapContainer>

      {/* Legend */}
      <div style={styles.legend}>
        {pickupCoords && (
          <div style={styles.legendItem}>
            <span style={styles.greenDot} />
            <span style={styles.legendText}>Pickup: {pickupAddress}</span>
          </div>
        )}
        {dropoffCoords && (
          <div style={styles.legendItem}>
            <span style={styles.redDot} />
            <span style={styles.legendText}>Dropoff: {dropoffAddress}</span>
          </div>
        )}
        {!pickupCoords && !dropoffCoords && !loading && (
          <p style={styles.legendHint}>
            💡 Tip: Add "Lagos" to your address for better results e.g "Victoria Island, Lagos"
          </p>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'relative', borderRadius: '16px',
    overflow: 'hidden', border: '2px solid #eee',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  placeholder: {
    height: '200px', background: '#f9f9f9', borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #eee'
  },
  placeholderText: { color: '#999', fontSize: '16px', fontWeight: '600' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(255,255,255,0.7)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  loadingBox: {
    background: '#1a1a2e', padding: '16px 24px', borderRadius: '10px'
  },
  loadingText: { color: '#f6c90e', margin: 0, fontWeight: '700' },
  errorBox: {
    background: '#fff8e0', color: '#b8860b', padding: '10px 16px',
    fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #f6c90e'
  },
  routeInfo: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    padding: '12px 16px', background: '#1a1a2e', gap: '8px'
  },
  routeItem: { display: 'flex', alignItems: 'center', gap: '10px' },
  routeIcon: { fontSize: '20px' },
  routeLabel: { fontSize: '10px', color: '#aaa', margin: '0 0 2px', fontWeight: '600' },
  routeValue: { fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 },
  routeDivider: { width: '1px', height: '32px', background: 'rgba(255,255,255,0.2)' },
  legend: {
    display: 'flex', flexDirection: 'column', gap: '6px',
    padding: '10px 16px', background: '#f9f9f9', borderTop: '1px solid #eee'
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  greenDot: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: '#2ecc71', display: 'block', flexShrink: 0
  },
  redDot: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: '#e74c3c', display: 'block', flexShrink: 0
  },
  legendText: { fontSize: '12px', color: '#555', fontWeight: '500' },
  legendHint: { fontSize: '12px', color: '#999', margin: 0, fontStyle: 'italic' }
}

export default RideMap