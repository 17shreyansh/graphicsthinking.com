import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: () => fetchData() }
}

export const usePortfolio = () => {
  const { state, dispatch } = useApp()
  
  const fetchPortfolio = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const { portfolioAPI } = await import('../services/api')
      const data = await portfolioAPI.getAll()
      dispatch({ type: 'SET_PORTFOLIO', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  return {
    portfolio: state.portfolio,
    loading: state.loading,
    error: state.error,
    fetchPortfolio
  }
}