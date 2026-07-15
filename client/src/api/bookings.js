import apiClient from './client'

export function createBookingRequest(payload) {
  return apiClient.post('/bookings', payload).then((res) => res.data)
}

export function fetchMyBookings() {
  return apiClient.get('/bookings/my').then((res) => res.data)
}

export function fetchAllBookings() {
  return apiClient.get('/bookings').then((res) => res.data)
}

export function updateBookingStatusRequest(id, status) {
  return apiClient.put(`/bookings/${id}/status`, { status }).then((res) => res.data)
}

export function cancelBookingRequest(id) {
  return apiClient.put(`/bookings/${id}/cancel`).then((res) => res.data)
}
