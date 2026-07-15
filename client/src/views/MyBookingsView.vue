<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import BaseAlert from '../components/common/BaseAlert.vue'

const router = useRouter()
const store = useBookingStore()
const loading = ref(true)
const error = ref('')
const cancellingId = ref(null)
const actionError = ref('')

onMounted(async () => {
  if (!store.isLoggedIn) {
    router.push({ name: 'login' })
    return
  }
  try {
    await store.fetchMyBookings()
  } catch (err) {
    error.value = 'Could not load your bookings. Please try again.'
  } finally {
    loading.value = false
  }
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function nightsFor(booking) {
  const inDate = new Date(booking.checkIn)
  const outDate = new Date(booking.checkOut)
  const diff = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 1
}

function totalFor(booking) {
  const price = booking.room?.price || 0
  return nightsFor(booking) * price
}

function bookingRef(booking) {
  const id = booking._id || booking.id || ''
  return `BK-${String(id).slice(-6).toUpperCase()}`
}

async function handleCancel(booking) {
  if (!confirm('Cancel this booking? This cannot be undone.')) return

  actionError.value = ''
  cancellingId.value = booking._id
  try {
    await store.cancelBooking(booking._id)
  } catch (err) {
    actionError.value = err.response?.data?.message || 'Failed to cancel booking.'
  } finally {
    cancellingId.value = null
  }
}
</script>

<template>
  <section class="section container my-bookings">
    <h1>My Bookings</h1>
    <p class="text-muted">A record of every stay you've booked with StayEase.</p>

    <BaseAlert v-if="actionError" type="error" :message="actionError" />

    <p v-if="loading" class="text-muted">Loading your bookings...</p>
    <p v-else-if="error" class="text-muted">{{ error }}</p>

    <template v-else>
      <div v-if="store.myBookings.length === 0" class="empty-state card">
        <p class="text-muted">You haven't made any bookings yet.</p>
        <RouterLink to="/rooms" class="btn btn-primary">Browse Rooms</RouterLink>
      </div>

      <div v-else class="bookings-list">
        <article v-for="booking in store.myBookings" :key="booking._id" class="booking-card card">
          <div class="booking-main">
            <div class="booking-title-row">
              <h3>{{ booking.room?.name || 'Room' }}</h3>
              <span class="ref-number">{{ bookingRef(booking) }}</span>
            </div>
            <p class="text-muted booking-dates">
              {{ formatDate(booking.checkIn) }} &rarr; {{ formatDate(booking.checkOut) }}
              &middot; {{ nightsFor(booking) }} night(s) &middot; {{ booking.guests }} guest(s)
            </p>
            <p class="payment-note">Pay at Hotel &middot; Total: Rs. {{ totalFor(booking).toLocaleString() }}</p>
          </div>

          <div class="booking-side">
            <span class="badge" :class="`status-${booking.status}`">{{ booking.status }}</span>
            <button
              v-if="booking.status !== 'cancelled'"
              class="btn btn-sm cancel-btn"
              :disabled="cancellingId === booking._id"
              @click="handleCancel(booking)"
            >
              {{ cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking' }}
            </button>
          </div>
        </article>
      </div>
    </template>
  </section>
</template>

<style scoped>
.empty-state {
  padding: 2.5rem;
  text-align: center;
}

.empty-state p {
  margin-bottom: 1rem;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.booking-card {
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.booking-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.booking-main h3 {
  margin: 0;
  font-size: 1.05rem;
}

.ref-number {
  font-size: 0.75rem;
  font-family: 'Courier New', monospace;
  color: var(--color-text-muted);
  background: var(--color-bg);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}

.booking-dates {
  margin: 0.3rem 0 0.2rem;
  font-size: 0.9rem;
}

.payment-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-primary);
  font-weight: 600;
}

.booking-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.cancel-btn {
  background: #fdecec;
  color: var(--color-danger);
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
}

.cancel-btn:hover {
  background: #f8d7d7;
}

.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-confirmed {
  background: #e6f4ea;
  color: var(--color-success);
}

.status-pending {
  background: #fff6e0;
  color: #92700c;
}

.status-cancelled {
  background: #fdecec;
  color: var(--color-danger);
}
</style>
