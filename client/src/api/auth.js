import apiClient from './client'

export function registerRequest(payload) {
  return apiClient.post('/auth/register', payload).then((res) => res.data)
}

export function loginRequest(payload) {
  return apiClient.post('/auth/login', payload).then((res) => res.data)
}

export function fetchCurrentUser() {
  return apiClient.get('/auth/me').then((res) => res.data)
}
