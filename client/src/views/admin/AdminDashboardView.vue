<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchRooms } from '../../api/rooms'
import { fetchAllBookings } from '../../api/bookings'

const rooms = ref([])
const bookings = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [roomsData, bookingsData] = await Promise.all([fetchRooms(), fetchAllBookings()])
    rooms.value = roomsData
    bookings.value = bookingsData
  } finally {
    loading.value = false
  }
})

const totalRevenue = computed(() => {
  return bookings.value.reduce((sum, b) => {
    if (b.status === 'cancelled' || !b.room) return sum
    const nights = Math.max(
      1,
      Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24))
    )
    return sum + nights * b.room.price
  }, 0)
})

const pendingCount = computed(() => bookings.value.filter((b) => b.status === 'pending').length)
const confirmedCount = computed(() => bookings.value.filter((b) => b.status === 'confirmed').length)

// Groups rooms by category (type), summing total/booked/available units across
// every room listing that falls under each type — e.g. "Suite: 5 total, 2 booked, 3 available".
const categoryBreakdown = computed(() => {
  const groups = {}
  rooms.value.forEach((room) => {
    if (!groups[room.type]) {
      groups[room.type] = { type: room.type, listings: 0, total: 0, booked: 0, available: 0 }
    }
    const g = groups[room.type]
    g.listings += 1
    g.total += room.totalUnits ?? 0
    g.booked += room.bookedUnits ?? 0
    g.available += room.availableUnits ?? 0
  })
  return Object.values(groups)
})

const recentBookings = computed(() =>
  [...bookings.value]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <p class="text-muted">Overview of rooms, bookings, and revenue.</p>

    <p v-if="loading" class="text-muted">Loading dashboard...</p>

    <template v-else>
      <div class="stats-grid">
        <div class="stat-card card">
          <span class="stat-label">Total Rooms</span>
          <span class="stat-value">{{ rooms.length }}</span>
        </div>
        <div class="stat-card card">
          <span class="stat-label">Total Bookings</span>
          <span class="stat-value">{{ bookings.length }}</span>
        </div>
        <div class="stat-card card">
          <span class="stat-label">Pending</span>
          <span class="stat-value pending">{{ pendingCount }}</span>
        </div>
        <div class="stat-card card">
          <span class="stat-label">Confirmed</span>
          <span class="stat-value confirmed">{{ confirmedCount }}</span>
        </div>
        <div class="stat-card card revenue-card">
          <span class="stat-label">Est. Revenue</span>
          <span class="stat-value">Rs. {{ totalRevenue.toLocaleString() }}</span>
        </div>
      </div>

      <div class="card recent-card">
        <h3>Room Availability by Category</h3>
        <table v-if="categoryBreakdown.length" class="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Room Types</th>
              <th>Total Units</th>
              <th>Booked</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="g in categoryBreakdown" :key="g.type">
              <td>{{ g.type }}</td>
              <td>{{ g.listings }}</td>
              <td>{{ g.total }}</td>
              <td class="booked-cell">{{ g.booked }}</td>
              <td :class="{ 'sold-out-cell': g.available === 0 }">{{ g.available }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-muted">No rooms yet.</p>
      </div>

      <div class="card recent-card">
        <h3>Recent Bookings</h3>
        <table v-if="recentBookings.length" class="admin-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Room</th>
              <th>Dates</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in recentBookings" :key="b._id">
              <td>{{ b.fullName }}</td>
              <td>{{ b.room?.name || '—' }}</td>
              <td>{{ formatDate(b.checkIn) }} &rarr; {{ formatDate(b.checkOut) }}</td>
              <td><span class="badge" :class="`status-${b.status}`">{{ b.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-muted">No bookings yet.</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0 2rem;
}

.stat-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-value.pending {
  color: #92700c;
}

.stat-value.confirmed {
  color: var(--color-success);
}

.revenue-card {
  border-left: 3px solid var(--color-accent);
}

.recent-card {
  padding: 1.5rem;
}

.recent-card h3 {
  margin-bottom: 1rem;
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
  padding: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
  text-transform: uppercase;
}

.admin-table td {
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
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

.booked-cell {
  color: #92700c;
  font-weight: 600;
}

.sold-out-cell {
  color: var(--color-danger);
  font-weight: 700;
}

.recent-card + .recent-card {
  margin-top: 1.5rem;
}
</style>
