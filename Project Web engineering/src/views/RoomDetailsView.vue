<script setup>
import { computed } from 'vue'
import { getRoomById } from '../data/rooms'

// props: true in the router config means `id` arrives here as a component prop,
// not via $route.params — a cleaner form of parent-to-child data flow.
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const room = computed(() => getRoomById(props.id))
</script>

<template>
  <section v-if="room" class="section container room-details">
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

        <div class="price-box card">
          <div>
            <span class="price">Rs. {{ room.price.toLocaleString() }}</span>
            <span class="text-muted"> / night</span>
          </div>
          <RouterLink :to="{ name: 'booking', params: { id: room.id } }" class="btn btn-primary">
            Book Now
          </RouterLink>
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

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  .details-image {
    min-height: 220px;
  }
}
</style>
