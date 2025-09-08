import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error.response?.data || error)
  }
)

export const portfolioAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/portfolio${queryString ? `?${queryString}` : ''}`)
  },
  getById: (id) => api.get(`/portfolio/${id}`),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`)
}

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
}

export const blogAPI = {
  getAll: () => api.get('/blog'),
  getById: (id) => api.get(`/blog/${id}`),
  create: (data) => api.post('/blog', data)
}

export const contactAPI = {
  send: (data) => api.post('/contact', data)
}

export const testimonialsAPI = {
  getAll: () => api.get('/testimonials')
}

export default api