import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from './Map.module.css'
import { useState } from 'react'
import { LatLngExpression } from 'leaflet'
import { useCities } from '../contexts/CitiesContexts'

export default function Map() {
  // const navigate = useNavigate()
  // const [searchParams] = useSearchParams()
  // const lat = searchParams.get('lat')
  // const lng = searchParams.get('lng')
  const { cities } = useCities()

  const [position, setPosition] = useState<LatLngExpression>([40, 0])

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={position}
        zoom={10}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
