<script setup>
import { ref, onMounted, watch } from 'vue'
import { useBookingStore } from '../store/booking'

// props: true in the router config means `id` arrives here as a component prop,
// not via $route.params — a cleaner form of parent-to-child data flow.
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const store = useBookingStore()
const room = ref(null)
const loading = ref(true)
const error = ref('')

async function loadRoom() {
  loading.value = true
  error.value = ''
  try {
    room.value = await store.getRoom(props.id)
  } catch (err) {
    error.value = 'Room not found'
  } finally {
    loading.value = false
  }
}

onMounted(loadRoom)
watch(() => props.id, loadRoom)
</script>

<template>
  <section v-if="loading" class="section container">
    <p class="text-muted">Loading room...</p>
  </section>

  <section v-else-if="room" class="section container room-details">
    <RouterLink to="/rooms" class="back-link">&larr; Back to Rooms</RouterLink>

    <div class="details-grid">
      <div class="details-image" :style="{ backgroundImage: `url(${room.image})` }"></div>

      <div class="details-info">
        <span class="badge badge-success">&#9733; {{ room.rating }} rating</span>
        <h1>{{ room.name }}</h1>
        <p class="text-muted">{{ room.type }} &middot; Sleeps up to {{ room.capacity }} guests</p>
        <p class="details-desc">{{ room.description }}</p>

        <h3>Amenities</h3>
        <ul class="amenity-full-list">
          <li v-for="amenity in room.amenities" :key="amenity">{{ amenity }}</li>
        </ul>

        <div v-if="room.totalUnits !== undefined" class="availability-box card">
          <div class="avail-stat">
            <span class="avail-value">{{ room.totalUnits }}</span>
            <span class="avail-label text-muted">Total Rooms</span>
          </div>
          <div class="avail-stat">
            <span class="avail-value booked">{{ room.bookedUnits }}</span>
            <span class="avail-label text-muted">Booked</span>
          </div>
          <div class="avail-stat">
            <span class="avail-value" :class="{ 'sold-out': room.availableUnits === 0 }">
              {{ room.availableUnits }}
            </span>
            <span class="avail-label text-muted">Available</span>
          </div>
        </div>

        <div class="price-box card">
          <div>
            <span class="price">Rs. {{ room.price.toLocaleString() }}</span>
            <span class="text-muted"> / night</span>
          </div>
          <RouterLink
            v-if="room.availableUnits !== 0"
            :to="{ name: 'booking', params: { id: room.id } }"
            class="btn btn-primary"
          >
            Book Now
          </RouterLink>
          <button v-else class="btn" disabled>Fully Booked</button>
        </div>
      </div>
    </div>
  </section>

  <section v-else class="section container">
    <h2>Room not found</h2>
    <RouterLink to="/rooms" class="btn btn-outline">Back to Rooms</RouterLink>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1.25rem;
  font-weight: 600;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.details-image {
  min-height: 340px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-lg);
}

.details-desc {
  margin: 1rem 0;
}

.amenity-full-list {
  columns: 2;
  padding-left: 1.1rem;
  margin-bottom: 1.5rem;
}

.price-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  margin-top: 1.5rem;
}

.price {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-primary);
}

.availability-box {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.avail-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.avail-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
}

.avail-value.booked {
  color: #92700c;
}

.avail-value.sold-out {
  color: var(--color-danger);
}

.avail-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  .details-image {
    min-height: 220px;
  }
}
</style>
