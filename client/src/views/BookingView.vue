<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import BookingForm from '../components/booking/BookingForm.vue'
import BillReceipt from '../components/booking/BillReceipt.vue'
import BaseAlert from '../components/common/BaseAlert.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()
const store = useBookingStore()

const room = ref(null)
const loading = ref(true)
const confirmed = ref(false)
const lastBooking = ref(null)
const submitError = ref('')

onMounted(async () => {
  // Booking requires a logged-in user, since the backend attaches the booking to req.user.
  if (!store.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  try {
    room.value = await store.getRoom(props.id)
  } finally {
    loading.value = false
  }
})

// Handles the 'submit-booking' event emitted UP from the BookingForm child component.
async function handleBookingSubmit(payload) {
  submitError.value = ''
  try {
    const booking = await store.submitBooking(payload)
    lastBooking.value = booking
    confirmed.value = true
  } catch (error) {
    submitError.value = error.response?.data?.message || 'Booking failed. Please try again.'
  }
}
</script>

<template>
  <section v-if="loading" class="section container">
    <p class="text-muted">Loading...</p>
  </section>

  <section v-else-if="room" class="section container booking-view">
    <template v-if="confirmed">
      <h1>Booking Received!</h1>
      <p class="text-muted">
        Thanks, {{ lastBooking.fullName }} — your booking is <strong>pending approval</strong>.
        We'll notify you at {{ lastBooking.email }} once the hotel confirms it.
      </p>

      <div class="confirmed-grid">
        <BillReceipt :booking="lastBooking" :room="room" />
        <div class="confirmed-actions">
          <RouterLink to="/my-bookings" class="btn btn-primary">View My Bookings</RouterLink>
          <RouterLink to="/rooms" class="btn btn-outline">Browse More Rooms</RouterLink>
        </div>
      </div>
    </template>

    <template v-else>
      <h1>Book: {{ room.name }}</h1>
      <p class="text-muted">Complete the form below to reserve your stay.</p>

      <BaseAlert v-if="submitError" type="error" :message="submitError" />

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
            Payment is collected at the hotel during check-in. No online payment required.
          </p>
        </aside>
      </div>
    </template>
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

.confirmed-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
  align-items: start;
}

.confirmed-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .booking-grid,
  .confirmed-grid {
    grid-template-columns: 1fr;
  }
}
</style>
