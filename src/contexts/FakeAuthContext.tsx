import { createContext, ReactNode, useContext, useReducer } from 'react'

type UserType = {
  name: string
  email: string
  password: string
  avatar: string
}

type AuthContextType = {
  user: UserType | null
  isAuthenticated: boolean
  login: (email: string, password: string) => void
  logout: () => void
}

type ActionType = { type: 'login'; payload: UserType } | { type: 'logout' }

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
}

const FAKE_USER = {
  name: 'John',
  email: 'john@example.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
}

const AuthContext = createContext<AuthContextType>(initialState)

function reducer(state: AuthContextType, action: ActionType): AuthContextType {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case 'logout':
      return initialState
    default:
      throw new Error('unknown dispath type')
  }
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  )

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER })
    }
  }
  function logout() {
    dispatch({ type: 'logout' })
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error('auth contexts was used outside of AuthProvider')
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth }
