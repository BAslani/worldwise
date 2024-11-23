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
  getCity: (id: string) => void
  createCity: (city: Omit<CityType, 'id'>) => Promise<void>
  deleteCity: (id: string) => void
  currentCity: CityType
}

const initialState = {
  cities: [],
  isLoading: false,
  getCity: () => {},
  createCity: () => {
    return Promise.resolve()
  },
  deleteCity: () => {},
  currentCity: {
    cityName: '',
    country: '',
    date: new Date(),
    emoji: '',
    id: '',
    notes: '',
    position: {
      lat: 0,
      lng: 0,
    },
  },
}

const CitiesContext = createContext<CitiesContextType>(initialState)

function CitiesProvider({ children }: { children: ReactNode }) {
  const [cities, setCities] = useState<CityType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState(initialState.currentCity)

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

  async function getCity(id: string) {
    try {
      setIsLoading(true)
      const res = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await res.json()
      setCurrentCity(data)
    } catch {
      alert('There was an error loading data...')
    } finally {
      setIsLoading(false)
    }
  }

  async function createCity(newCity: Omit<CityType, 'id'>) {
    try {
      setIsLoading(true)
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setCities((cities) => [...cities, data])
    } catch {
      alert('There was an error creating city...')
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCity(id: string) {
    try {
      setIsLoading(true)
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      })
      setCities((cities) => cities.filter((city) => city.id !== id))
    } catch {
      alert('There was an error deleting city...')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
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
