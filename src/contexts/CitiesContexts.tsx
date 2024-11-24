import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { CityType } from '../../types'

const BASE_URL = 'http://localhost:8000'

type CitiesContextType = {
  cities: CityType[]
  isLoading: boolean
  error: string
  getCity: (id: string) => void
  createCity: (city: Omit<CityType, 'id'>) => Promise<void>
  deleteCity: (id: string) => void
  currentCity: CityType
}

type ActionType =
  | { type: 'loading' }
  | { type: 'rejected'; payload: string }
  | { type: 'city/loaded'; payload: CityType }
  | { type: 'cities/loaded'; payload: CityType[] }
  | { type: 'city/created'; payload: CityType }
  | { type: 'city/deleted'; payload: string }

const initialState: CitiesContextType = {
  cities: [],
  isLoading: false,
  error: '',
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

function reducer(
  state: CitiesContextType,
  action: ActionType
): CitiesContextType {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      }
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    default:
      throw new Error('Unknown action type')
  }
}

function CitiesProvider({ children }: { children: ReactNode }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  )

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' })
      try {
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        dispatch({
          type: 'rejected',
          payload: 'There was an error loading cities data...',
        })
      }
    }

    fetchCities()
  }, [])

  async function getCity(id: string) {
    if (id === currentCity.id) return
    dispatch({ type: 'loading' })
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await res.json()
      dispatch({ type: 'city/loaded', payload: data })
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error loading city data...',
      })
    }
  }

  async function createCity(newCity: Omit<CityType, 'id'>) {
    dispatch({ type: 'loading' })
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      dispatch({ type: 'city/created', payload: data })
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating city...',
      })
    }
  }

  async function deleteCity(id: string) {
    dispatch({ type: 'loading' })
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      })
      dispatch({ type: 'city/deleted', payload: id })
    } catch {
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting city...',
      })
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
        error,
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
