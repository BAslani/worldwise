import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { CityType } from '../../types'

const BASE_URL = 'http://localhost:8000'

type CitiesContextType = {
  cities: CityType[]
  isLoading: boolean
}

const CitiesContext = createContext<CitiesContextType>({
  cities: [],
  isLoading: false,
})

function CitiesProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<CityType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        setCities(data)
      } catch {
        alert('There was an error loading data...')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [])
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const citiesContex = useContext(CitiesContext)
  if (citiesContex === undefined)
    throw new Error('CitiesContext was used outside the cities provider')
  return citiesContex
}

// eslint-disable-next-line react-refresh/only-export-components
export { CitiesProvider, useCities }
