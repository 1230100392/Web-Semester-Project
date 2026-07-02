import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    currentUser: null
  }),
  getters: {
    totalBookings: (state) => state.bookings.length
  },
  actions: {
    addBooking(booking) {
      this.bookings.push({ id: Date.now(), ...booking })
    },
    login(user) {
      this.currentUser = user
    },
    logout() {
      this.currentUser = null
    }
  }
})
