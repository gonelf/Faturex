import { createClient } from './supabase/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

async function getAuthToken() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await getAuthToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// Invoice API methods
export const invoiceApi = {
  list: () => apiRequest('/invoices'),
  get: (id: string) => apiRequest(`/invoices/${id}`),
  create: (data: any) => apiRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  finalize: (id: string, sourceId: string) => apiRequest(`/invoices/${id}/finalize`, {
    method: 'POST',
    body: JSON.stringify({ sourceId }),
  }),
  cancel: (id: string, sourceId: string, reason: string) => apiRequest(`/invoices/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ sourceId, reason }),
  }),
}

// Customer API methods (to be implemented in backend)
export const customerApi = {
  list: () => apiRequest('/customers'),
  get: (id: string) => apiRequest(`/customers/${id}`),
  create: (data: any) => apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Product API methods (to be implemented in backend)
export const productApi = {
  list: () => apiRequest('/products'),
  get: (id: string) => apiRequest(`/products/${id}`),
  create: (data: any) => apiRequest('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
}

// Billing Series API methods (to be implemented in backend)
export const seriesApi = {
  list: () => apiRequest('/series'),
  get: (id: string) => apiRequest(`/series/${id}`),
  create: (data: any) => apiRequest('/series', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
