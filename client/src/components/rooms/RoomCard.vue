<script setup>
// Demonstrates PROPS: dynamic data flowing down from parent (RoomsView) into a child component,
// with strict type safety enforced via defineProps validators.
const props = defineProps({
  room: {
    type: Object,
    required: true,
    validator: (value) =>
      ['id', 'name', 'price', 'image'].every((key) => key in value)
  }
})

// Demonstrates EMITS: this child notifies its parent when the user wants to view details,
// rather than handling navigation logic itself.
const emit = defineEmits(['view-details'])

function handleViewDetails() {
  emit('view-details', props.room.id)
}
</script>

<template>
  <article class="room-card card">
    <div class="room-image" :style="{ backgroundImage: `url(${room.image})` }">
      <span class="badge badge-success room-rating">&#9733; {{ room.rating }}</span>
    </div>
    <div class="room-body">
      <div class="room-header">
        <h3>{{ room.name }}</h3>
        <span class="room-price">Rs. {{ room.price.toLocaleString() }}<small>/night</small></span>
      </div>
      <p class="room-type text-muted">{{ room.type }} &middot; Sleeps {{ room.capacity }}</p>
      <p v-if="room.availableUnits !== undefined" class="availability-note" :class="{ 'sold-out': room.availableUnits === 0 }">
        {{ room.availableUnits === 0 ? 'Fully Booked' : `${room.availableUnits} room(s) available` }}
      </p>
      <p class="room-desc">{{ room.description }}</p>
      <ul class="amenity-list">
        <li v-for="amenity in room.amenities.slice(0, 3)" :key="amenity">{{ amenity }}</li>
      </ul>
      <button class="btn btn-primary room-cta" @click="handleViewDetails">
        View Details
      </button>
    </div>
  </article>
</template>

<style scoped>
.room-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;
}

.room-card:hover {
  box-shadow: var(--shadow-md);
}

.room-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.room-rating {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.room-body {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}

.room-header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.room-price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.room-price small {
  font-weight: 400;
  color: var(--color-text-muted);
}

.room-type {
  margin: 0.2rem 0 0.6rem;
  font-size: 0.85rem;
}

.availability-note {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-success);
  margin: 0 0 0.5rem;
}

.availability-note.sold-out {
  color: var(--color-danger);
}

.room-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0 0 0.75rem;
}

.amenity-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.amenity-list li {
  font-size: 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  color: var(--color-text-muted);
}

.room-cta {
  margin-top: auto;
  width: 100%;
}
</style>
