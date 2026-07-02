<script setup>
import { ref, computed } from 'vue'
import { getRoomById } from '../data/rooms'
import { useBookingStore } from '../store/booking'
import BookingForm from '../components/booking/BookingForm.vue'
import BaseAlert from '../components/common/BaseAlert.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const bookingStore = useBookingStore()
const room = computed(() => getRoomById(props.id))
const confirmed = ref(false)
const lastBooking = ref(null)

// Handles the 'submit-booking' event emitted UP from the BookingForm child component.
function handleBookingSubmit(payload) {
  bookingStore.addBooking(payload)
  lastBooking.value = payload
  confirmed.value = true
}
</script>

<template>
  <section v-if="room" class="section container booking-view">
    <h1>Book: {{ room.name }}</h1>
    <p class="text-muted">Complete the form below to reserve your stay.</p>

    <BaseAlert
      v-if="confirmed"
      type="success"
      :message="`Booking confirmed for ${lastBooking.fullName}! A confirmation has been sent to ${lastBooking.email}.`"
    />

    <div class="booking-grid">
      <BookingForm :room="room" @submit-booking="handleBookingSubmit" />

      <aside class="summary card">
        <h3>Booking Summary</h3>
        <div class="summary-row">
          <span>Room</span>
          <strong>{{ room.name }}</strong>
        </div>
        <div class="summary-row">
          <span>Rate</span>
          <strong>Rs. {{ room.price.toLocaleString() }} / night</strong>
        </div>
        <div class="summary-row">
          <span>Max Guests</span>
          <strong>{{ room.capacity }}</strong>
        </div>
        <p class="text-muted note">
          Payment integration (JazzCash / EasyPaisa) will be connected once the backend
          (Express.js + MongoDB) phase is implemented.
        </p>
      </aside>
    </div>
  </section>

  <section v-else class="section container">
    <h2>Room not found</h2>
    <RouterLink to="/rooms" class="btn btn-outline">Back to Rooms</RouterLink>
  </section>
</template>

<style scoped>
.booking-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.summary {
  padding: 1.5rem;
  height: fit-content;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.92rem;
}

.note {
  margin-top: 1rem;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .booking-grid {
    grid-template-columns: 1fr;
  }
}
</style>
