import { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  portfolio: [],
  services: [],
  blog: [],
  testimonials: [],
  loading: false,
  error: null
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
    default:
      return state
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState)
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
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