import { LatLngExpression } from 'leaflet'
import { useMap } from 'react-leaflet'

type Props = {
  position: LatLngExpression
}

export default function ChangeCenter({ position }: Props) {
  const map = useMap()
  map.setView(position)
  return null
}
