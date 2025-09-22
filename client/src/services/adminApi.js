import { portfolioAPI, servicesAPI, contactAPI, adminAPI } from './api'

// Helper function to handle API responses
const handleApiResponse = (response, fallbackKey) => {
  if (Array.isArray(response)) return response
  if (response && typeof response === 'object') {
    const result = response[fallbackKey] || response.data || response.items || response.services || response.messages || response || []
    return Array.isArray(result) ? result : [result].filter(Boolean)
  }
  return []
}

// Centralized API service for admin operations
export const adminApiService = {
  // Dashboard APIs
  dashboard: {
    getStats: async () => {
      try {
        const [portfolio, services, messages] = await Promise.allSettled([
          portfolioAPI.getAll(),
          servicesAPI.getAll(),
          contactAPI.getAll()
        ])
        
        const portfolioData = portfolio.status === 'fulfilled' ? handleApiResponse(portfolio.value, 'items') : []
        const servicesData = services.status === 'fulfilled' ? handleApiResponse(services.value, 'services') : []
        const messagesData = messages.status === 'fulfilled' ? handleApiResponse(messages.value, 'messages') : []
        
        return {
          portfolio: {
            total: portfolioData.length,
            featured: portfolioData.filter(p => p.featured).length,
            recent: portfolioData.slice(0, 5)
          },
          services: {
            total: servicesData.length,
            recent: servicesData.slice(0, 5)
          },
          messages: {
            total: messagesData.length,
            new: messagesData.filter(m => m.status === 'new').length,
            recent: messagesData.slice(0, 5)
          }
        }
      } catch (error) {
        console.error('Dashboard stats error:', error)
        throw new Error('Failed to fetch dashboard stats')
      }
    }
  },

  // Portfolio APIs
  portfolio: {
    getAll: async () => {
      try {
        console.log('AdminAPI: Calling portfolioAPI.getAll()')
        const response = await portfolioAPI.getAll()
        console.log('AdminAPI: Raw portfolio response:', response)
        const result = handleApiResponse(response, 'items')
        console.log('AdminAPI: Final portfolio result:', result)
        return result
      } catch (error) {
        console.error('Portfolio getAll error:', error)
        throw error
      }
    },
    getById: (id) => portfolioAPI.getById(id),
    create: async (data) => {
      try {
        console.log('AdminAPI: Creating portfolio with data:', data)
        const response = await portfolioAPI.create(data)
        console.log('AdminAPI: Create response:', response)
        return response
      } catch (error) {
        console.error('Portfolio create error:', error)
        throw error
      }
    },
    update: (id, data) => {
      console.log('AdminAPI: Updating portfolio', id, 'with data:', data)
      return portfolioAPI.update(id, data)
    },
    delete: (id) => portfolioAPI.delete(id)
  },

  // Services APIs
  services: {
    getAll: async () => {
      try {
        console.log('AdminAPI: Calling servicesAPI.getAll()')
        const response = await servicesAPI.getAll()
        console.log('AdminAPI: Raw services response:', response)
        const result = handleApiResponse(response, 'services')
        console.log('AdminAPI: Final services result:', result)
        return result
      } catch (error) {
        console.error('Services getAll error:', error)
        throw error
      }
    },
    getById: (id) => servicesAPI.getById(id),
    create: async (data) => {
      try {
        console.log('AdminAPI: Creating service with data:', data)
        const response = await servicesAPI.create(data)
        console.log('AdminAPI: Service create response:', response)
        return response
      } catch (error) {
        console.error('Service create error:', error)
        throw error
      }
    },
    update: (id, data) => {
      console.log('AdminAPI: Updating service', id, 'with data:', data)
      return servicesAPI.update(id, data)
    },
    delete: (id) => servicesAPI.delete(id)
  },

  // Messages APIs
  messages: {
    getAll: async () => {
      try {
        const response = await contactAPI.getAll()
        return handleApiResponse(response, 'messages')
      } catch (error) {
        console.error('Messages getAll error:', error)
        throw error
      }
    },
    update: (id, data) => contactAPI.update(id, data),
    delete: (id) => contactAPI.delete(id)
  }
}