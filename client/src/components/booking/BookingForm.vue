<script setup>
import { reactive } from 'vue'

// PROPS: receives the room being booked from the parent BookingView.
const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

// EMITS: sends the completed booking payload back up to the parent,
// which is responsible for actually persisting/dispatching it.
const emit = defineEmits(['submit-booking'])

const form = reactive({
  fullName: '',
  email: '',
  checkIn: '',
  checkOut: '',
  guests: 1
})

function handleSubmit() {
  emit('submit-booking', { ...form, roomId: props.room.id, roomName: props.room.name })
}
</script>

<template>
  <form class="booking-form card" @submit.prevent="handleSubmit">
    <h3>Guest Details</h3>

    <div class="form-group">
      <label for="fullName">Full Name</label>
      <input
        id="fullName"
        v-model="form.fullName"
        type="text"
        class="form-control"
        placeholder="e.g. Ali Sher"
        required
      />
    </div>

    <div class="form-group">
      <label for="email">Email Address</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="form-control"
        placeholder="you@example.com"
        required
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="checkIn">Check-in</label>
        <input id="checkIn" v-model="form.checkIn" type="date" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="checkOut">Check-out</label>
        <input id="checkOut" v-model="form.checkOut" type="date" class="form-control" required />
      </div>
    </div>

    <div class="form-group">
      <label for="guests">Guests</label>
      <input
        id="guests"
        v-model.number="form.guests"
        type="number"
        min="1"
        :max="room.capacity"
        class="form-control"
      />
    </div>

    <button type="submit" class="btn btn-primary booking-submit">Confirm Booking</button>
  </form>
</template>

<style scoped>
.booking-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.booking-submit {
  width: 100%;
  margin-top: 0.5rem;
}

@media (max-width: 560px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
