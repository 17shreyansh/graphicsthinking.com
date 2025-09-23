import { createContext, useContext, useReducer, useState } from 'react'

const AppContext = createContext()
export { AppContext }

const initialState = {
  portfolio: [],
  services: [],
  blog: [],
  testimonials: [],
  loading: false,
  error: null,
  isAuthenticated: false
}

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_PORTFOLIO':
      return { ...state, portfolio: action.payload, loading: false }
    case 'SET_SERVICES':
      return { ...state, services: action.payload, loading: false }
    case 'SET_BLOG':
      return { ...state, blog: action.payload, loading: false }
    case 'SET_TESTIMONIALS':
      return { ...state, testimonials: action.payload, loading: false }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true'
  });
  const [state, dispatch] = useReducer(appReducer, initialState)

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const login = () => {
    setIsAuthenticated(true)
    localStorage.setItem('adminAuth', 'true')
  };
  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
  };
  
  return (
    <AppContext.Provider value={{ 
      ...state,
      dispatch,
      theme, 
      toggleTheme, 
      isAuthenticated, 
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}