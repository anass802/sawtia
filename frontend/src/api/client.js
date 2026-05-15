import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Attach Bearer token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sawtia_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sawtia_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ─── API helpers ──────────────────────────────────────────────────

// WhatsApp
export const whatsappAPI = {
  getStatus:   () => api.get('/whatsapp/status'),
  getQR:       () => api.get('/whatsapp/qr'),
  disconnect:  () => api.post('/whatsapp/disconnect'),
  sendMessage: (data) => api.post('/whatsapp/send', data),
}

// AI Parameters
export const aiParamsAPI = {
  getAll:    () => api.get('/ai-parameters'),
  update:    (id, data) => api.put(`/ai-parameters/${id}`, data),
  getModels: () => api.get('/ai-parameters/models'),
}

// Dashboard
export const dashboardAPI = {
  getStats: (period) => api.get(`/dashboard/stats?period=${period}`),
  getChart: () => api.get('/dashboard/chart'),
  getAgents: () => api.get('/dashboard/agents'),
}

// Agents
export const agentsAPI = {
  list:   () => api.get('/agents'),
  get:    (id) => api.get(`/agents/${id}`),
  create: (data) => api.post('/agents', data),
  update: (id, data) => api.put(`/agents/${id}`, data),
  delete: (id) => api.delete(`/agents/${id}`),
}

// Knowledge Base
export const knowledgeAPI = {
  listScanners: () => api.get('/knowledge/scanners'),
  createScanner: (data) => api.post('/knowledge/scanners', data),
  deleteScanner: (id) => api.delete(`/knowledge/scanners/${id}`),
  listDocs: () => api.get('/knowledge/documents'),
  uploadDoc: (formData) => api.post('/knowledge/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// Billing
export const billingAPI = {
  getInvoices:   () => api.get('/billing/invoices'),
  getPlan:       () => api.get('/billing/plan'),
  recharge:      (amount) => api.post('/billing/recharge', { amount }),
  getBalance:    () => api.get('/billing/balance'),
}

// Settings
export const settingsAPI = {
  getProfile:    () => api.get('/settings/profile'),
  updateProfile: (data) => api.put('/settings/profile', data),
  changePassword: (data) => api.post('/settings/password', data),
  getApiKeys:    () => api.get('/settings/api-keys'),
  regenerateKey: () => api.post('/settings/api-keys/regenerate'),
}
