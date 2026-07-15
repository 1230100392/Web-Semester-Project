import apiClient from './client'

// Normalize MongoDB's _id into id so existing components (which expect room.id)
// work unchanged regardless of whether data comes from the mock source or the API.
function normalizeRoom(room) {
  if (!room) return room
  return { ...room, id: room._id || room.id }
}

export async function fetchRooms(params = {}) {
  const res = await apiClient.get('/rooms', { params })
  return res.data.map(normalizeRoom)
}

export async function fetchRoomById(id) {
  const res = await apiClient.get(`/rooms/${id}`)
  return normalizeRoom(res.data)
}

export function createRoom(payload) {
  return apiClient.post('/rooms', payload).then((res) => normalizeRoom(res.data))
}

export function updateRoom(id, payload) {
  return apiClient.put(`/rooms/${id}`, payload).then((res) => normalizeRoom(res.data))
}

export function deleteRoom(id) {
  return apiClient.delete(`/rooms/${id}`).then((res) => res.data)
}
