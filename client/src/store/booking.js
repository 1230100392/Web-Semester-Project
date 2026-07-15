import { defineStore } from 'pinia'
import { fetchRooms, fetchRoomById } from '../api/rooms'
import { registerRequest, loginRequest, fetchCurrentUser } from '../api/auth'
import { createBookingRequest, fetchMyBookings, cancelBookingRequest } from '../api/bookings'

const TOKEN_KEY = 'stayease_token'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    currentUser: null,
    token: localStorage.getItem(TOKEN_KEY) || null,

    rooms: [],
    roomsLoading: false,
    roomsError: null,

    myBookings: [],

    authLoading: false,
    authError: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    totalBookings: (state) => state.myBookings.length
  },

  actions: {
    // ---- Rooms ----
    async fetchRooms(params = {}) {
      this.roomsLoading = true
      this.roomsError = null
      try {
        this.rooms = await fetchRooms(params)
      } catch (error) {
        this.roomsError = error.response?.data?.message || 'Failed to load rooms'
      } finally {
        this.roomsLoading = false
      }
    },

    async getRoom(id) {
      return fetchRoomById(id)
    },

    // ---- Auth ----
    async register(payload) {
      this.authLoading = true
      this.authError = null
      try {
        const data = await registerRequest(payload)
        this._setSession(data)
        return true
      } catch (error) {
        this.authError = error.response?.data?.message || 'Registration failed'
        return false
      } finally {
        this.authLoading = false
      }
    },

    async login(payload) {
      this.authLoading = true
      this.authError = null
      try {
        const data = await loginRequest(payload)
        this._setSession(data)
        return true
      } catch (error) {
        this.authError = error.response?.data?.message || 'Invalid email or password'
        return false
      } finally {
        this.authLoading = false
      }
    },

    async restoreSession() {
      if (!this.token) return
      try {
        this.currentUser = await fetchCurrentUser()
      } catch (error) {
        this.logout()
      }
    },

    logout() {
      this.currentUser = null
      this.token = null
      localStorage.removeItem(TOKEN_KEY)
    },

    _setSession(data) {
      const { token, ...user } = data
      this.token = token
      this.currentUser = user
      localStorage.setItem(TOKEN_KEY, token)
    },

    // ---- Bookings ----
    async submitBooking(payload) {
      const booking = await createBookingRequest(payload)
      this.myBookings.push(booking)
      return booking
    },

    async fetchMyBookings() {
      this.myBookings = await fetchMyBookings()
    },

    async cancelBooking(bookingId) {
      const updated = await cancelBookingRequest(bookingId)
      const index = this.myBookings.findIndex((b) => b._id === bookingId)
      if (index !== -1) this.myBookings[index] = updated
      return updated
    }
  }
})
