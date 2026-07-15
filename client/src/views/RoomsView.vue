<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import RoomCard from '../components/rooms/RoomCard.vue'

const router = useRouter()
const store = useBookingStore()

const search = ref('')
const typeFilter = ref('All')

onMounted(() => {
  store.fetchRooms()
})

const roomTypes = computed(() => ['All', ...new Set(store.rooms.map((r) => r.type))])

const filteredRooms = computed(() => {
  return store.rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesType = typeFilter.value === 'All' || room.type === typeFilter.value
    return matchesSearch && matchesType
  })
})

function goToDetails(roomId) {
  router.push({ name: 'room-details', params: { id: roomId } })
}
</script>

<template>
  <section class="section container">
    <h1>Available Rooms</h1>
    <p class="text-muted">Browse our full catalogue and filter by room type.</p>

    <div class="filters card">
      <div class="form-group">
        <label for="search">Search by name</label>
        <input
          id="search"
          v-model="search"
          type="text"
          class="form-control"
          placeholder="e.g. Executive Suite"
        />
      </div>
      <div class="form-group">
        <label for="type">Room Type</label>
        <select id="type" v-model="typeFilter" class="form-control">
          <option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
    </div>

    <p v-if="store.roomsLoading" class="text-muted">Loading rooms...</p>
    <p v-else-if="store.roomsError" class="text-muted">{{ store.roomsError }}</p>

    <template v-else>
      <p class="results-count text-muted">{{ filteredRooms.length }} room(s) found</p>

      <div class="grid grid-3">
        <RoomCard
          v-for="room in filteredRooms"
          :key="room.id"
          :room="room"
          @view-details="goToDetails"
        />
      </div>

      <p v-if="filteredRooms.length === 0" class="text-muted no-results">
        No rooms match your search. Try adjusting your filters.
      </p>
    </template>
  </section>
</template>

<style scoped>
.filters {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  padding: 1.25rem;
  margin: 1.5rem 0;
}

.results-count {
  margin-bottom: 1rem;
}

.no-results {
  text-align: center;
  padding: 2rem 0;
}

@media (max-width: 600px) {
  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
