<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import RoomCard from '../components/rooms/RoomCard.vue'

const router = useRouter()
const store = useBookingStore()

onMounted(() => {
  if (store.rooms.length === 0) store.fetchRooms()
})

// Only pass a subset down to the child components as props
const featuredRooms = computed(() => store.rooms.slice(0, 3))

function goToDetails(roomId) {
  router.push({ name: 'room-details', params: { id: roomId } })
}
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero-inner">
        <h1>Find Your Perfect Stay with StayEase</h1>
        <p>Simple, transparent hotel booking — search, compare, and reserve in minutes.</p>
        <RouterLink to="/rooms" class="btn btn-accent hero-cta">Browse Rooms</RouterLink>
      </div>
    </section>

    <section class="section container">
      <h2>Featured Rooms</h2>
      <p class="text-muted">Hand-picked stays our guests love the most.</p>

      <p v-if="store.roomsLoading" class="text-muted">Loading rooms...</p>
      <p v-else-if="store.roomsError" class="text-muted">{{ store.roomsError }}</p>

      <div v-else class="grid grid-3 rooms-grid">
        <RoomCard
          v-for="room in featuredRooms"
          :key="room.id"
          :room="room"
          @view-details="goToDetails"
        />
      </div>

      <div class="see-all">
        <RouterLink to="/rooms" class="btn btn-outline">See All Rooms</RouterLink>
      </div>
    </section>

    <section class="section why-section">
      <div class="container grid grid-3">
        <div class="why-item">
          <h3>Best Price Guarantee</h3>
          <p class="text-muted">Transparent pricing with no hidden fees on every booking.</p>
        </div>
        <div class="why-item">
          <h3>Verified Rooms</h3>
          <p class="text-muted">Every listing is checked for quality and accuracy.</p>
        </div>
        <div class="why-item">
          <h3>24/7 Support</h3>
          <p class="text-muted">Our team is always available to help with your stay.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #fff;
  padding: 5rem 0;
  text-align: center;
}

.hero-inner h1 {
  color: #fff;
  font-size: 2.4rem;
  max-width: 700px;
  margin: 0 auto 0.75rem;
}

.hero-inner p {
  color: #dbe4f0;
  max-width: 520px;
  margin: 0 auto 1.75rem;
}

.rooms-grid {
  margin-top: 1.5rem;
}

.see-all {
  text-align: center;
  margin-top: 2rem;
}

.why-section {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.why-item {
  text-align: center;
}
</style>
