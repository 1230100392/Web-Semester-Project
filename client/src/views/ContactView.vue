<script setup>
import { reactive, ref } from 'vue'
import BaseAlert from '../components/common/BaseAlert.vue'

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const sent = ref(false)

function handleSubmit() {
  sent.value = true
  form.name = ''
  form.email = ''
  form.message = ''
}
</script>

<template>
  <section class="section container contact-view">
    <h1>Contact Us</h1>
    <p class="text-muted">Have a question about your stay? Send us a message.</p>

    <div class="contact-grid">
      <form class="card contact-form" @submit.prevent="handleSubmit">
        <BaseAlert v-if="sent" type="success" message="Thanks! Your message has been sent." />

        <div class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="form.name" type="text" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            v-model="form.message"
            class="form-control"
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
      </form>

      <div class="contact-info card">
        <h3>Our Office</h3>
        <p class="text-muted">Sialkot, Punjab, Pakistan</p>
        <h3>Email</h3>
        <p class="text-muted">support@stayease.com</p>
        <h3>Phone</h3>
        <p class="text-muted">+92 300 1234567</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.contact-form,
.contact-info {
  padding: 1.5rem;
}

.contact-info h3 {
  font-size: 1rem;
  margin-top: 1rem;
}

.contact-info h3:first-child {
  margin-top: 0;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
