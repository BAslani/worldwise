import { useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'

export default function DetectClick() {
  const navigate = useNavigate()
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    },
  })
  return null
}
