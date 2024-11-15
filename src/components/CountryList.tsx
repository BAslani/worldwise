import styles from './CountryList.module.css'
import { CityType } from '../../types'
import Spinner from './Spinner'
import Message from './Message'
import CountryItem from './CountryItem'

type Props = {
  cities: CityType[] | []
  isLoading: boolean
}

export default function CountryList({ cities, isLoading }: Props) {
  if (isLoading) return <Spinner />
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    )

  const countries = cities.reduce<
    {
      id: string
      country: string
      emoji: string
    }[]
  >((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji, id: city.id }]
    else return arr
  }, [])

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem key={country.id} country={country} />
      ))}
    </ul>
  )
}
