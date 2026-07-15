<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchAllBookings, updateBookingStatusRequest } from '../../api/bookings'
import BaseAlert from '../../components/common/BaseAlert.vue'

const bookings = ref([])
const loading = ref(true)
const error = ref('')
const successMsg = ref('')
const statusFilter = ref('All')

async function loadBookings() {
  loading.value = true
  try {
    bookings.value = await fetchAllBookings()
  } catch (err) {
    error.value = 'Failed to load bookings.'
  } finally {
    loading.value = false
  }
}

onMounted(loadBookings)

const filteredBookings = computed(() => {
  if (statusFilter.value === 'All') return bookings.value
  return bookings.value.filter((b) => b.status === statusFilter.value)
})

function nightsFor(booking) {
  const diff = Math.round(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  )
  return diff > 0 ? diff : 1
}

function totalFor(booking) {
  const price = booking.room?.price || 0
  return nightsFor(booking) * price
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function handleStatusChange(booking, newStatus) {
  error.value = ''
  successMsg.value = ''
  try {
    await updateBookingStatusRequest(booking._id, newStatus)
    booking.status = newStatus
    successMsg.value = `Booking marked as ${newStatus}.`
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update booking status.'
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1>Bookings</h1>
        <p class="text-muted">Review and manage all guest bookings.</p>
      </div>
      <select v-model="statusFilter" class="form-control filter-select">
        <option>All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <BaseAlert v-if="successMsg" type="success" :message="successMsg" />
    <BaseAlert v-if="error" type="error" :message="error" />

    <p v-if="loading" class="text-muted">Loading bookings...</p>

    <div v-else class="card table-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            <th>Dates</th>
            <th>Guests</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="b in filteredBookings" :key="b._id">
            <td>
              <div class="guest-name">{{ b.fullName }}</div>
              <div class="guest-email text-muted">{{ b.email }}</div>
            </td>
            <td>{{ b.room?.name || '—' }}</td>
            <td>{{ formatDate(b.checkIn) }} &rarr; {{ formatDate(b.checkOut) }}</td>
            <td>{{ b.guests }}</td>
            <td>Rs. {{ totalFor(b).toLocaleString() }}</td>
            <td><span class="badge" :class="`status-${b.status}`">{{ b.status }}</span></td>
            <td class="actions-cell">
              <select
                :value="b.status"
                class="form-control status-select"
                @change="handleStatusChange(b, $event.target.value)"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredBookings.length === 0" class="text-muted empty-msg">No bookings found.</p>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  width: auto;
  min-width: 160px;
}

.table-card {
  padding: 0;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table th {
  text-align: left;
  color: var(--color-text-muted);
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
  text-transform: uppercase;
  white-space: nowrap;
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.guest-name {
  font-weight: 600;
}

.guest-email {
  font-size: 0.8rem;
}

.status-select {
  width: auto;
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
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

.empty-msg {
  padding: 1.5rem;
  text-align: center;
}
</style>
