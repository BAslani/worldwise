import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from './Map.module.css'
import { useEffect, useState } from 'react'
import { LatLngExpression } from 'leaflet'
import { useCities } from '../contexts/CitiesContexts'
import ChangeCenter from './ChangeCenter'
import DetectClick from './DetectClick'
import { useGeolocation } from '../hooks/useGeolocation'
import Button from './Button'
import { useUrlPosition } from '../hooks/useUrlPosition'

export default function Map() {
  const { cities } = useCities()
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation()

  const [mapLat, mapLng] = useUrlPosition()

  const [position, setPosition] = useState<LatLngExpression>([40, 0])

  useEffect(() => {
    if (mapLat && mapLng) {
      setPosition([mapLat, mapLng])
    }
  }, [mapLat, mapLng])

  useEffect(() => {
    if (geolocationPosition) {
      setPosition([geolocationPosition.lat, geolocationPosition.lng])
    }
  }, [geolocationPosition])

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={position}
        zoom={8}
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
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  )
}
