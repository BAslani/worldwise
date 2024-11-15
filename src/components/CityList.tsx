import styles from './CityList.module.css'
import { CityType } from '../../types'
import Spinner from './Spinner'
import CityItem from './CityItem'
import Message from './Message'

type Props = {
  cities: CityType[] | []
  isLoading: boolean
}

export default function CityList({ cities, isLoading }: Props) {
  if (isLoading) return <Spinner />
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    )

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  )
}
